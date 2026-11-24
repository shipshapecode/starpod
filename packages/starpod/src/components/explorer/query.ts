/**
 * The explorer's state, and the URL hash it lives in. Pure functions, shared
 * by the browser controller and the tests.
 *
 * The hash is a contract other pages link into:
 * `/#q=<text>&kind=video|audio&guest=<person id>&year=<yyyy>&sort=newest|oldest|longest|shortest&view=grid|list`,
 * plus `progress=1` for episodes the visitor has started. Defaults are left
 * out of the URL. It is the hash, not the query, because Astro's router
 * treats a change of hash alone as a move within the page (no fetch, no
 * swap, and Back and Forward step through it), and any change of query as
 * another page.
 */

import { RESUME_MIN_SECONDS } from '../media/position';

export const SORTS = ['newest', 'oldest', 'longest', 'shortest'] as const;
export type Sort = (typeof SORTS)[number];

export interface ExplorerState {
  q: string;
  kind: '' | 'video' | 'audio';
  guest: string;
  year: string;
  progress: boolean;
  sort: Sort;
  view: 'grid' | 'list';
}

export const DEFAULT_STATE: ExplorerState = {
  q: '',
  kind: '',
  guest: '',
  year: '',
  progress: false,
  sort: 'newest',
  view: 'grid'
};

const KEYS = new Set([
  'q',
  'kind',
  'guest',
  'year',
  'progress',
  'sort',
  'view'
]);

/**
 * The whole archive, once filters have been cleared on the page. The router
 * takes a URL with no hash for another page, so clearing leaves this one.
 */
export const ALL = '#all';

/**
 * Is this hash the explorer's, rather than an in-page link (`#main`) that
 * leaves the state where it is?
 */
export function isStateHash(hash: string): boolean {
  if (hash === '' || hash === ALL) {
    return true;
  }
  const keys = [...new URLSearchParams(hash.slice(1)).keys()];
  return keys.length > 0 && keys.every((key) => KEYS.has(key));
}

export function parseState(hash: string): ExplorerState {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const kind = params.get('kind');
  const sort = params.get('sort') as Sort | null;
  const year = params.get('year') ?? '';
  return {
    q: params.get('q')?.trim() ?? '',
    kind: kind === 'video' || kind === 'audio' ? kind : '',
    guest: params.get('guest') ?? '',
    year: /^\d{4}$/.test(year) ? year : '',
    progress: params.get('progress') === '1',
    sort: sort && SORTS.includes(sort) ? sort : 'newest',
    view: params.get('view') === 'list' ? 'list' : 'grid'
  };
}

/** The hash for a state, `''` when everything is at its default. */
export function toHash(state: ExplorerState): string {
  const params = new URLSearchParams();
  if (state.q) {
    params.set('q', state.q);
  }
  if (state.kind) {
    params.set('kind', state.kind);
  }
  if (state.guest) {
    params.set('guest', state.guest);
  }
  if (state.year) {
    params.set('year', state.year);
  }
  if (state.progress) {
    params.set('progress', '1');
  }
  if (state.sort !== 'newest') {
    params.set('sort', state.sort);
  }
  if (state.view !== 'grid') {
    params.set('view', state.view);
  }
  const hash = params.toString();
  return hash ? `#${hash}` : '';
}

/** Is anything narrowing the archive? (Sort and view only rearrange it.) */
export function isFiltered(state: ExplorerState): boolean {
  return Boolean(
    state.q || state.kind || state.guest || state.year || state.progress
  );
}

/** What the explorer knows about one episode card. */
export interface ExplorerEntry {
  /** Feed order: 0 is the newest. */
  index: number;
  duration: number;
  people: Array<string>;
  /** Seconds the visitor has listened, from the media engine's resume store. */
  position: number;
  /** Lowercased title, description and people, for search. */
  text: string;
  video: boolean;
  year: string;
}

export function matches(entry: ExplorerEntry, state: ExplorerState): boolean {
  if (state.kind && entry.video !== (state.kind === 'video')) {
    return false;
  }
  if (state.year && entry.year !== state.year) {
    return false;
  }
  if (state.guest && !entry.people.includes(state.guest)) {
    return false;
  }
  if (state.progress && !inProgress(entry)) {
    return false;
  }
  if (state.q) {
    const words = state.q.toLowerCase().split(/\s+/);
    return words.every((word) => entry.text.includes(word));
  }
  return true;
}

/** Started, by the engine's own rule: Play would pick up where it was left. */
export function inProgress(entry: ExplorerEntry): boolean {
  return entry.position > RESUME_MIN_SECONDS;
}

export function compare(sort: Sort) {
  return (a: ExplorerEntry, b: ExplorerEntry): number => {
    switch (sort) {
      case 'oldest':
        return b.index - a.index;
      case 'longest':
        return b.duration - a.duration || a.index - b.index;
      case 'shortest':
        return a.duration - b.duration || a.index - b.index;
      default:
        return a.index - b.index;
    }
  };
}
