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

interface JsonTranscript {
  text?: string;
  segments?: Array<{ text?: string; start?: number }>;
}

// Cache parsed transcripts by URL so the episode page and its `.html.md`
// counterpart don't fetch the same transcript twice during a build.
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

  let paragraphs: Array<TranscriptParagraph> | null = null;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const raw = await response.text();
      const type =
        episode.transcriptType || response.headers.get('content-type') || '';
      paragraphs = parseTranscript(raw, type);
    }
  } catch {
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
  return paragraphs?.length
    ? paragraphs.map((paragraph) => paragraph.text).join('\n\n')
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
        const text = segment.text?.trim();
        if (text) {
          segments.push({ text, start: segment.start });
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

  // VTT, SRT, or plain text: strip cue metadata and fall back to paragraph
  // splitting on blank lines. Timing information isn't recovered here.
  const stripped = stripCues(raw);
  return stripped ? splitParagraphs(stripped) : null;
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
