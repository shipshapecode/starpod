import { getEntry } from 'astro:content';

import { getRssCues, parseMarkdownCues, type TranscriptCue } from './cues';
import type { Episode } from './rss';

/**
 * Timed lines for an episode: a markdown transcript in the site's content
 * collection wins (it names speakers), then the feed's transcript. Server-only.
 */
export async function getEpisodeCues(
  episode: Episode
): Promise<Array<TranscriptCue> | null> {
  if (episode.episodeNumber && episode.episodeNumber !== 'Bonus') {
    let entry;
    try {
      entry = await getEntry('transcripts', episode.episodeNumber);
    } catch {
      entry = undefined;
    }
    if (entry?.body) {
      const cues = parseMarkdownCues(entry.body);
      if (cues.length) {
        return cues;
      }
    }
  }
  return getRssCues(episode);
}
