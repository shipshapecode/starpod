import { decodeEntities } from './entities';
import type { Episode } from './rss';
import {
  fetchTranscriptText,
  parseCues,
  readJsonSegment,
  type JsonSegment
} from './transcript';

/**
 * A short, timed line of speech for the live transcript performance. `v` is
 * the voice: the speaker's order of first appearance (0, 1, 2…), absent when
 * the source carries no speaker names (plain captions). `n` is the name.
 */
export interface TranscriptCue {
  s: number;
  t: string;
  v?: number;
  n?: string;
}

interface Segment {
  start: number;
  text: string;
  speaker?: string;
}

// Lines longer than this are split at sentence ends so the live line stays a
// phrase, not a paragraph.
const CUE_TARGET_CHARS = 140;

export function mergeIntoLines(segments: Array<Segment>): Array<TranscriptCue> {
  const voices = new Map<string, number>();
  const lines: Array<TranscriptCue> = [];
  let current: TranscriptCue | null = null;
  let speaker: string | undefined;

  for (const segment of segments) {
    const endsSentence = current ? /[.!?]["”’)]?$/.test(current.t) : false;
    // Never break mid-sentence unless a line runs far past the target; a
    // transcript paragraph that was cut mid-thought joins the next one.
    const startNew =
      !current ||
      segment.speaker !== speaker ||
      (current.t.length >= CUE_TARGET_CHARS / 2 && endsSentence) ||
      current.t.length >= CUE_TARGET_CHARS * 1.6;

    if (startNew) {
      speaker = segment.speaker;
      current = { s: Math.round(segment.start * 10) / 10, t: segment.text };
      if (speaker) {
        if (!voices.has(speaker)) {
          voices.set(speaker, voices.size);
        }
        current.v = voices.get(speaker);
        current.n = speaker;
      }
      lines.push(current);
    } else if (current) {
      current.t = `${current.t} ${segment.text}`;
    }
  }

  return rankVoices(lines);
}

/**
 * The two people who talk the most get the two signature voices (0 and 1, in
 * order of first appearance); everyone else (intros, guests, ads) shares the
 * supporting voices from 2 up.
 */
function rankVoices(lines: Array<TranscriptCue>): Array<TranscriptCue> {
  const counts = new Map<string, number>();
  const firstSeen: Array<string> = [];
  for (const line of lines) {
    if (!line.n) {
      continue;
    }
    if (!counts.has(line.n)) {
      firstSeen.push(line.n);
    }
    counts.set(line.n, (counts.get(line.n) ?? 0) + 1);
  }
  const leads = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([name]) => name)
    .sort((a, b) => firstSeen.indexOf(a) - firstSeen.indexOf(b));
  const supporting = firstSeen.filter((name) => !leads.includes(name));
  for (const line of lines) {
    if (line.n) {
      const lead = leads.indexOf(line.n);
      line.v = lead !== -1 ? lead : 2 + (supporting.indexOf(line.n) % 4);
    }
  }
  return lines;
}

const MARKDOWN_LINE =
  /^\s*\[(?:(\d+):)?(\d{1,2}):(\d{2})\]\s*(?:(?:\*\*|__)?([^:\n[\]*_]{1,40}):(?:\*\*|__)?\s*)?(.*)$/;

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|__|\*|_|`)/g, '');
}

/**
 * Parse a markdown transcript (`[HH:MM:SS] Speaker: text` paragraphs) into
 * timed lines with voices. Long speeches split into sentences that share the
 * paragraph's start time, so they still perform one phrase at a time.
 */
export function parseMarkdownCues(markdown: string): Array<TranscriptCue> {
  const paragraphs: Array<{ start: number; speaker?: string; sentences: Array<string> }> = [];
  for (const block of markdown.replace(/\r\n?/g, '\n').split(/\n{2,}/)) {
    const match = block.replace(/\n/g, ' ').match(MARKDOWN_LINE);
    if (!match) {
      continue;
    }
    const [, h, m, sec, name, text] = match;
    const sentences = (
      stripInlineMarkdown(text).trim().match(/[^.!?]+[.!?]+["”’)]?|[^.!?]+$/g) ?? []
    )
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    paragraphs.push({
      start: Number(h ?? 0) * 3600 + Number(m) * 60 + Number(sec),
      speaker: name?.trim(),
      sentences
    });
  }

  // Each sentence starts partway through its paragraph, in proportion to the
  // text before it, so the live line moves at roughly the pace of speech.
  const segments: Array<Segment> = [];
  paragraphs.forEach((paragraph, index) => {
    const total = paragraph.sentences.reduce((sum, item) => sum + item.length, 0) || 1;
    const next = paragraphs[index + 1]?.start;
    const span = next && next > paragraph.start ? next - paragraph.start : total / 15;
    let offset = 0;
    for (const sentence of paragraph.sentences) {
      segments.push({
        start: paragraph.start + (span * offset) / total,
        text: sentence,
        speaker: paragraph.speaker
      });
      offset += sentence.length;
    }
  });
  return mergeIntoLines(segments);
}

/**
 * Timed segments from a JSON transcript (either field naming; see
 * `readJsonSegment`). Segments without a time or text are dropped.
 */
export function jsonSegments(data: { segments?: Array<JsonSegment> } | null): Array<Segment> {
  return (data?.segments ?? []).flatMap((segment) => {
    const { start, text, speaker } = readJsonSegment(segment);
    return start !== undefined && text ? [{ start, text, speaker }] : [];
  });
}

/** A VTT/SRT cue's text: voice and styling tags removed, references decoded. */
export function cueText(raw: string): { text: string; speaker?: string } {
  // WebVTT voice spans: <v Speaker>text</v>
  const voice = raw.match(/^<v(?:\.[^\s>]*)?\s+([^>]+)>/);
  return {
    text: decodeEntities(raw.replace(/<[^>]+>/g, '')).trim(),
    speaker: voice ? decodeEntities(voice[1]).trim() : undefined
  };
}

/**
 * Timed lines from the feed's `<podcast:transcript>` (VTT/SRT cues or JSON
 * segments). Returns `null` when none is available.
 */
const rssCueCache = new Map<string, Promise<Array<TranscriptCue> | null>>();

export function getRssCues(
  episode: Episode
): Promise<Array<TranscriptCue> | null> {
  const url = episode.transcriptUrl;
  if (!url) {
    return Promise.resolve(null);
  }
  let pending = rssCueCache.get(url);
  if (!pending) {
    pending = fetchRssCues(episode, url);
    rssCueCache.set(url, pending);
    // Forget misses so a failed download can be retried on a later request.
    void pending.then((cues) => {
      if (!cues) {
        rssCueCache.delete(url);
      }
    });
  }
  return pending;
}

async function fetchRssCues(
  episode: Episode,
  url: string
): Promise<Array<TranscriptCue> | null> {
  const download = await fetchTranscriptText(url);
  if (!download) {
    return null;
  }
  const type = (episode.transcriptType || download.type).toLowerCase();
  try {
    if (type.includes('json')) {
      const segments = jsonSegments(JSON.parse(download.raw));
      return segments.length ? mergeIntoLines(segments) : null;
    }
    const cues = parseCues(download.raw).map((cue) => ({
      start: cue.start,
      ...cueText(cue.text)
    }));
    return cues.length ? mergeIntoLines(cues) : null;
  } catch {
    return null;
  }
}
