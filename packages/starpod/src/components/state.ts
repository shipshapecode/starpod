import { computed, signal } from '@preact/signals';
import type { Episode } from '../lib/rss';

/**
 * The episode fields the player needs. Older callers pass only the audio
 * subset; `video`, `image`, `slug`, and `duration` enrich the experience when
 * present (video-first stage, artwork fallback, lock-screen metadata).
 */
export type PlayableEpisode = Pick<
  Episode,
  'audio' | 'episodeNumber' | 'id' | 'title'
> &
  Partial<Pick<Episode, 'video' | 'duration'>> & {
    image?: string;
    slug?: string;
  };

export const currentEpisode = signal<PlayableEpisode | null>(null);
export const isPlaying = signal(false);
export const isMuted = signal(false);

// Set to a time (in seconds) to ask the player to seek there. The player
// consumes it and resets it back to null. Used by clickable transcript
// timestamps to jump to a moment in the current episode.
export const seekTo = signal<number | null>(null);

// Load the given episode (if it isn't already current) and ask the player to
// seek to `seconds`. Shared by the RSS and markdown transcript timestamps.
export function seekToEpisode(episode: PlayableEpisode, seconds: number) {
  if (currentEpisode.value?.id !== episode.id) {
    currentEpisode.value = { ...episode };
  }
  seekTo.value = seconds;
}

// Start (or toggle) an episode. Shared by every play control.
export function playEpisode(episode: PlayableEpisode) {
  const isCurrent = currentEpisode.value?.id === episode.id;
  if (!isCurrent) {
    currentEpisode.value = { ...episode };
  }
  isPlaying.value = isCurrent ? !isPlaying.value : true;
}

/**
 * Watch or listen. This is the visitor's standing preference, remembered
 * across visits; an episode without video always plays as audio regardless.
 */
export type Medium = 'watch' | 'listen';

const MEDIUM_KEY = 'starpod:medium';

function readMedium(): Medium {
  try {
    return globalThis.localStorage?.getItem(MEDIUM_KEY) === 'listen'
      ? 'listen'
      : 'watch';
  } catch {
    return 'watch';
  }
}

export const preferredMedium = signal<Medium>(readMedium());

export function setMedium(medium: Medium) {
  preferredMedium.value = medium;
  try {
    globalThis.localStorage?.setItem(MEDIUM_KEY, medium);
  } catch {
    // Private mode or blocked storage: the choice still holds for this visit.
  }
}

export const activeMedium = computed<Medium>(() =>
  currentEpisode.value?.video && preferredMedium.value === 'watch'
    ? 'watch'
    : 'listen'
);

// Live playback readouts, written by the media engine.
export const currentTime = signal(0);
export const mediaDuration = signal(0);
export const playbackRate = signal(1);
export const isBuffering = signal(false);

// Where the one media element currently lives: inside an episode stage on the
// page, or in the persistent dock.
export const mediaHost = signal<'stage' | 'dock'>('dock');

// Search state
export const isSearchOpen = signal(false);
