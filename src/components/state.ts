import { signal } from '@preact/signals';
import type { Episode } from '@lib/rss';

export const isPlaying = signal(false);
export const currentEpisode = signal<Episode | null>(null);
