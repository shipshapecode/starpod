import { signal } from '@preact/signals';
import type { Episode } from '../lib/rss';

export const currentEpisode = signal<Pick<
  Episode,
  'audio' | 'episodeNumber' | 'id' | 'title'
> | null>(null);
export const isPlaying = signal(false);
export const isMuted = signal(false);
