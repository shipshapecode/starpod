import { decodeEntities, escapeHtml } from './entities';
import type { Episode } from './rss';

// Roughly how many characters to accumulate before starting a new paragraph
// when grouping transcript segments. Auto-generated transcripts have no real
// paragraph boundaries, so we group short segments into readable chunks.
const PARAGRAPH_TARGET_CHARS = 600;

// A paragraph of transcript text, optionally tagged with the time (in seconds)
// at which it begins so the UI can offer a "jump to this moment" control.
export interface TranscriptParagraph {
  start?: number;
  text: string;
}

/** A JSON transcript segment, in either field naming. */
export interface JsonSegment {
  body?: string;
  speaker?: string;
  start?: number;
  startTime?: number;
  text?: string;
}

interface JsonTranscript {
  text?: string;
  segments?: Array<JsonSegment>;
}

/**
 * A JSON segment's time, text, and speaker. The Podcast Namespace format names
 * them `startTime`, `body`, and `speaker`; `start` and `text` are accepted too.
 */
export function readJsonSegment(segment: JsonSegment): {
  start?: number;
  text?: string;
  speaker?: string;
} {
  const start = segment.startTime ?? segment.start;
  return {
    start: typeof start === 'number' ? start : undefined,
    text: (segment.body ?? segment.text)?.trim() || undefined,
    speaker: segment.speaker || undefined
  };
}

const FETCH_TIMEOUT_MS = 10_000;
const downloads = new Map<string, Promise<{ raw: string; type: string } | null>>();

/**
 * Download a transcript once per build, shared by the transcript on the page,
 * its `.html.md` twin, and the live transcript's timed lines. The deadline
 * covers the whole request, body included, so a stalled server can't hold up
 * the build. Failures are not remembered, so a later request can retry.
 */
export function fetchTranscriptText(
  url: string
): Promise<{ raw: string; type: string } | null> {
  let pending = downloads.get(url);
  if (!pending) {
    pending = (async () => {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
        });
        if (!response.ok) {
          return null;
        }
        return {
          raw: await response.text(),
          type: response.headers.get('content-type') ?? ''
        };
      } catch {
        return null;
      }
    })();
    downloads.set(url, pending);
    void pending.then((result) => {
      if (!result) {
        downloads.delete(url);
      }
    });
  }
  return pending;
}

// Cache parsed transcripts by URL so the episode page and its `.html.md`
// counterpart don't parse the same transcript twice during a build.
const cache = new Map<string, Array<TranscriptParagraph> | null>();

/**
 * Fetch the transcript referenced by the episode's RSS `<podcast:transcript>`
 * tag and return it as an array of paragraphs (each with an optional start
 * time). Returns `null` when the episode has no RSS transcript, or when it
 * can't be fetched or parsed.
 */
export async function getRssTranscriptParagraphs(
  episode: Episode
): Promise<Array<TranscriptParagraph> | null> {
  const url = episode.transcriptUrl;
  if (!url) {
    return null;
  }

  const cached = cache.get(url);
  if (cached !== undefined) {
    return cached;
  }

  const download = await fetchTranscriptText(url);
  if (!download) {
    // Not cached: the download may succeed on a later request.
    return null;
  }
  let paragraphs: Array<TranscriptParagraph> | null;
  try {
    paragraphs = parseTranscript(download.raw, episode.transcriptType || download.type);
  } catch {
    // Downloaded but unusable (e.g. a JSON body of `null`): no transcript.
    paragraphs = null;
  }
  cache.set(url, paragraphs);
  return paragraphs;
}

/**
 * Same as `getRssTranscriptParagraphs`, but joined into a single markdown/plain
 * text string (paragraphs separated by blank lines). Returns `null` when no
 * usable transcript is available.
 */
export async function getRssTranscriptText(
  episode: Episode
): Promise<string | null> {
  const paragraphs = await getRssTranscriptParagraphs(episode);
  // Cue text comes back decoded, so a transcript's escaped `&lt;img …&gt;` is
  // a real `<` by now: escape it again so the markdown can't carry HTML.
  return paragraphs?.length
    ? paragraphs.map((paragraph) => escapeHtml(paragraph.text)).join('\n\n')
    : null;
}

function parseTranscript(
  raw: string,
  type: string
): Array<TranscriptParagraph> | null {
  const lower = type.toLowerCase();

  if (lower.includes('json')) {
    let data: JsonTranscript;
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }

    if (Array.isArray(data.segments) && data.segments.length > 0) {
      const segments: Array<{ text: string; start?: number }> = [];
      for (const segment of data.segments) {
        const { start, text } = readJsonSegment(segment);
        if (text) {
          segments.push({ text, start });
        }
      }
      if (segments.length > 0) {
        return groupSegments(segments);
      }
    }

    if (typeof data.text === 'string' && data.text.trim()) {
      return splitParagraphs(data.text);
    }

    return null;
  }

  // VTT or SRT: parse cue blocks, keeping each cue's start time so the
  // timestamps stay clickable, then group them like JSON segments.
  const cues = parseCues(raw);
  if (cues.length > 0) {
    return groupSegments(cues);
  }

  // Plain text (or unparseable cues): strip any leftover cue metadata and fall
  // back to paragraph splitting on blank lines. Timing isn't recoverable here.
  const stripped = stripCues(raw);
  return stripped ? splitParagraphs(stripped) : null;
}

// What a cue's markup looks like, in any case: a WebVTT class, italic, bold,
// underline, ruby, voice or language span (`<v Speaker>`, `<c.loud>`,
// `</i>`…), SRT's `<font color="…">`, a `<span>` or `<br>` some captioners
// write, or a timestamp (`<00:01:02.500>`). Anything else in angle brackets,
// like SRT's unescaped "x < 5 and y > 3", is text.
const CUE_TAG =
  /<\/?(?:[cibuv]|ruby|rt|lang|font|span|br)(?:\.[^\s<>]*)?(?:\s[^<>]*)?\/?>|<(?:\d+:)?\d{2}:\d{2}\.\d{3}>/gi;

/**
 * Parse WebVTT/SRT cue blocks into `{ start, text, speaker }` entries,
 * preserving the start time (in seconds) of each cue. Blocks without a `-->`
 * timing line (e.g. the `WEBVTT` header) are skipped.
 *
 * The text comes back plain, ready to render once: a WebVTT voice span
 * (`<v Speaker>…`) gives the speaker, every tag is dropped, and only then are
 * character references (`&amp;`, `&lt;`…) decoded, so escaped text can never
 * turn into a tag.
 */
export function parseCues(
  raw: string
): Array<{ text: string; start: number; speaker?: string }> {
  const cues: Array<{ text: string; start: number; speaker?: string }> = [];

  for (const block of raw.replace(/\r\n/g, '\n').split(/\n{2,}/)) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const timingIndex = lines.findIndex((line) => line.includes('-->'));
    if (timingIndex === -1) {
      continue;
    }

    const start = parseCueStart(lines[timingIndex]);
    // Cue text is everything after the timing line (the numeric index and any
    // cue identifier come before it).
    const markup = lines.slice(timingIndex + 1).join(' ').trim();
    const voice = markup.match(/^<v(?:\.[^\s>]*)?\s+([^>]+)>/)?.[1];
    const speaker = voice && decodeEntities(voice).trim();
    const text = decodeEntities(
      // A line break becomes a space; any other tag just goes.
      markup.replace(CUE_TAG, (tag) => (/^<br\b/i.test(tag) ? ' ' : ''))
    )
      .replace(/\s+/g, ' ')
      .trim();
    if (start !== undefined && text) {
      cues.push(speaker ? { text, start, speaker } : { text, start });
    }
  }

  return cues;
}

/**
 * Parse the start timestamp from a cue's timing line, supporting
 * `HH:MM:SS.mmm` / `MM:SS.mmm` (VTT) and comma-delimited SRT milliseconds.
 */
function parseCueStart(timingLine: string): number | undefined {
  const startPart = timingLine.split('-->')[0];
  const match = startPart.match(/(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?/);
  if (!match) {
    return undefined;
  }

  const [, hours, minutes, seconds, milliseconds] = match;
  return (
    (hours ? Number(hours) * 3600 : 0) +
    Number(minutes) * 60 +
    Number(seconds) +
    (milliseconds ? Number(milliseconds) / 1000 : 0)
  );
}

/**
 * Group fine-grained transcript segments into readable paragraphs, breaking
 * once a paragraph reaches roughly `PARAGRAPH_TARGET_CHARS`. Each paragraph is
 * tagged with the start time of its first segment.
 */
function groupSegments(
  segments: Array<{ text: string; start?: number }>
): Array<TranscriptParagraph> {
  const paragraphs: Array<TranscriptParagraph> = [];
  let current = '';
  let start: number | undefined;

  for (const segment of segments) {
    if (!current) {
      start = segment.start;
    }
    current = current ? `${current} ${segment.text}` : segment.text;
    if (current.length >= PARAGRAPH_TARGET_CHARS) {
      paragraphs.push({ start, text: current });
      current = '';
    }
  }

  if (current) {
    paragraphs.push({ start, text: current });
  }

  return paragraphs;
}

function splitParagraphs(text: string): Array<TranscriptParagraph> {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((paragraph) => ({ text: paragraph }));
}

/**
 * Remove WebVTT/SRT scaffolding (the `WEBVTT` header, numeric cue indexes, and
 * `00:00:00.000 --> 00:00:00.000` timing lines), leaving just the spoken text.
 */
function stripCues(raw: string): string {
  return raw
    .replace(/^WEBVTT.*$/gim, '')
    .replace(/^\d+\s*$/gm, '')
    .replace(/^.*-->.*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
