import { computed, effect, signal } from '@preact/signals';
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

// Start (or toggle) an episode. Shared by every play control. Playing an
// episode that is waiting in Up next takes it out of the queue.
export function playEpisode(episode: PlayableEpisode) {
  const isCurrent = currentEpisode.value?.id === episode.id;
  if (!isCurrent) {
    dequeue(episode.id);
    currentEpisode.value = { ...episode };
  }
  isPlaying.value = isCurrent ? !isPlaying.value : true;
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = globalThis.localStorage?.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Only what can be played: storage may hold anything (an old shape, a hand edit). */
function readQueue(): Array<PlayableEpisode> {
  const stored = readStored<unknown>('starpod:queue', []);
  return Array.isArray(stored)
    ? stored.filter(
        (episode): episode is PlayableEpisode =>
          typeof episode?.id === 'string' &&
          typeof episode.title === 'string' &&
          typeof episode.audio?.src === 'string'
      )
    : [];
}

function store(key: string, value: unknown) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage: the choice still holds for this visit.
  }
}

/**
 * Up next: episodes queued to play after the current one, in order. It
 * survives reloads, and the player advances through it when an episode ends.
 */
export const queue = signal<Array<PlayableEpisode>>(readQueue());
effect(() => store('starpod:queue', queue.value));

/** Add an episode to Up next: at the end, or at `index` (0 plays it next). */
export function enqueue(episode: PlayableEpisode, index = Infinity) {
  if (queue.value.some((queued) => queued.id === episode.id)) {
    return;
  }
  const next = [...queue.value];
  next.splice(Math.max(0, Math.min(next.length, index)), 0, { ...episode });
  queue.value = next;
}

export function dequeue(id: string) {
  if (queue.value.some((queued) => queued.id === id)) {
    queue.value = queue.value.filter((queued) => queued.id !== id);
  }
}

/** Move a queued episode to `index` (clamped to the queue). */
export function moveInQueue(id: string, index: number) {
  const rest = queue.value.filter((queued) => queued.id !== id);
  const moving = queue.value.find((queued) => queued.id === id);
  if (moving) {
    rest.splice(Math.max(0, Math.min(rest.length, index)), 0, moving);
    queue.value = rest;
  }
}

/** Play the first queued episode. False when the queue is empty. */
export function playNext() {
  const next = queue.value[0];
  if (next) {
    playEpisode(next);
  }
  return Boolean(next);
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

// The visitor closed the floating picture. Closing pauses playback and tucks
// the picture into the player bar; any play (dock, stage, a row, the K
// shortcut) brings it back out.
export const miniClosed = signal(false);

/**
 * Where the picture floats when it is not on its stage: one of four corners,
 * or docked in the player bar. The corner is shared; docking is per medium,
 * and listening docks by default (the artwork sits in the bar).
 */
export type Corner = 'se' | 'sw' | 'nw' | 'ne';
const CORNERS: ReadonlyArray<Corner> = ['se', 'sw', 'nw', 'ne'];
const storedCorner = readStored<unknown>('starpod:pip-corner', 'se');
export const pipCorner = signal<Corner>(CORNERS.includes(storedCorner as Corner) ? (storedCorner as Corner) : 'se');
const storedDocked = readStored<Partial<Record<Medium, unknown>> | null>('starpod:pip-docked', null);
export const pipDocked = signal<Record<Medium, boolean>>({
  watch: typeof storedDocked?.watch === 'boolean' ? storedDocked.watch : false,
  listen: typeof storedDocked?.listen === 'boolean' ? storedDocked.listen : true
});
effect(() => store('starpod:pip-corner', pipCorner.value));
effect(() => store('starpod:pip-docked', pipDocked.value));

export function dockPicture(docked: boolean) {
  pipDocked.value = { ...pipDocked.value, [activeMedium.value]: docked };
}

/**
 * The player is one island with four homes the visitor chooses between: a
 * pill, the full transport dock, the large now-playing card (which holds Up
 * next), and the sidebar's rail. The card opens over the page and closes back
 * to the home it came from, so only the other three are remembered. Phones
 * have no rail; the dock stands in for it there.
 */
export type IslandHome = 'pill' | 'card' | 'dock' | 'rail';
export const ISLAND_HOMES: ReadonlyArray<IslandHome> = ['pill', 'card', 'dock', 'rail'];
type Resting = Exclude<IslandHome, 'card'>;

function readHome(): Resting {
  const stored = readStored<string>('starpod:island', 'dock');
  return stored === 'pill' || stored === 'rail' ? stored : 'dock';
}

/** Where the visitor sent the island (the card included). */
export const islandHome = signal<IslandHome>(readHome());
/** The home the card closes back to. */
export const islandBack = signal<Resting>(readHome());
effect(() => {
  const home = islandHome.value;
  if (home !== 'card') {
    islandBack.value = home;
    store('starpod:island', home);
  }
});

const wideQuery = globalThis.matchMedia?.('(min-width: 1024px)');
/** The sidebar is on screen (wide layouts). */
export const wideScreen = signal(wideQuery?.matches ?? true);
wideQuery?.addEventListener?.('change', (event) => (wideScreen.value = event.matches));

/** Where the island is: its chosen home, unless that home is not on screen. */
export const islandAt = computed<IslandHome>(() =>
  islandHome.value === 'rail' && !wideScreen.value ? 'dock' : islandHome.value
);

// The island is the large now-playing card (the picture docks in it).
export const playerExpanded = computed(() => islandAt.value === 'card');

export function closeMini() {
  isPlaying.value = false;
  miniClosed.value = true;
}

effect(() => {
  if (isPlaying.value) {
    miniClosed.value = false;
  }
});

// Search state
export const isSearchOpen = signal(false);
