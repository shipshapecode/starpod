import { signal } from '@preact/signals';
import type { Episode } from '../lib/rss';

export const currentEpisode = signal<Pick<
  Episode,
  'audio' | 'episodeNumber' | 'id' | 'title'
> | null>(null);
export const isPlaying = signal(false);
export const isMuted = signal(false);

// Set to a time (in seconds) to ask the player to seek there. The player
// consumes it and resets it back to null. Used by clickable transcript
// timestamps to jump to a moment in the current episode.
export const seekTo = signal<number | null>(null);

// Load the given episode (if it isn't already current) and ask the player to
// seek to `seconds`. Shared by the RSS and markdown transcript timestamps.
export function seekToEpisode(
  episode: NonNullable<(typeof currentEpisode)['value']>,
  seconds: number
) {
  if (currentEpisode.value?.id !== episode.id) {
    currentEpisode.value = { ...episode };
  }
  seekTo.value = seconds;
}

// Search state
export const isSearchOpen = signal(false);
