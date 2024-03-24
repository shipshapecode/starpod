import { signal } from '@preact/signals';
import type { Episode } from '@lib/episodes';

export const isPlaying = signal(false);
export const currentEpisode = signal<Episode | null>(null);
