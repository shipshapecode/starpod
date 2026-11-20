import { signal } from '@preact/signals';

/**
 * The transcript's name for whoever is speaking right now, while playing.
 * Anything that shows a person can light up for it. Written on every page
 * by speaking-source.ts (loaded from the Layout), which also marks
 * everything carrying `data-speaks-as` for that person with `data-speaking`.
 * This module has no side effects, so server-rendered islands can import it.
 */
export const speakingNow = signal<string | undefined>(undefined);
