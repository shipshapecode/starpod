import { signal } from '@preact/signals';
import type { Episode } from '../lib/rss';

export const currentEpisode = signal<Pick<
  Episode,
  'audio' | 'video' | 'episodeImage' | 'episodeNumber' | 'id' | 'title'
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

// When the current episode has video, whether to play the video stream or fall
// back to audio-only. Defaults to video; ignored for audio-only episodes.
export const mediaMode = signal<'video' | 'audio'>('video');

// Whether the expanded video theater (large, native-controls surface above the
// docked player bar) is open. Toggled from the player and the episode page.
export const isTheaterOpen = signal(false);

// Mobile slide-over navigation menu open/closed.
export const isMenuOpen = signal(false);

// Search state
export const isSearchOpen = signal(false);
