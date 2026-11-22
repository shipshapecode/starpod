import type { TranscriptCue } from '../../lib/cues';

const cache = new Map<string, Promise<Array<TranscriptCue>>>();

/**
 * Timed transcript lines for an episode, fetched once per visit and shared by
 * everything that reads them (the live script, the scrubber preview).
 * Resolves to an empty list when the episode has no transcript.
 */
export function loadCues(slug: string): Promise<Array<TranscriptCue>> {
  let request = cache.get(slug);
  if (!request) {
    // The endpoint answers every episode, with [] when it has no transcript,
    // so a failure is the network's or the server's: forget it, and the next
    // reader asks again.
    const attempt: Promise<Array<TranscriptCue>> = fetch(`/api/cues/${slug}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`cues: ${response.status}`);
        }
        return response.json();
      })
      // cueIndexAt() searches by start time: not every transcript source
      // lists its lines in order.
      .then((cues: Array<TranscriptCue>) =>
        Array.isArray(cues) ? [...cues].sort((a, b) => a.s - b.s) : []
      )
      .catch(() => {
        if (cache.get(slug) === attempt) {
          cache.delete(slug);
        }
        return [];
      });
    request = attempt;
    cache.set(slug, request);
  }
  return request;
}

/** The index of the line being spoken at `time` (binary search). */
export function cueIndexAt(cues: Array<TranscriptCue>, time: number) {
  let low = 0;
  let high = cues.length - 1;
  let found = 0;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (cues[mid].s <= time) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return found;
}
