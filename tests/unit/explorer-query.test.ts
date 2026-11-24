import { describe, expect, it } from 'vitest';
import {
  compare,
  DEFAULT_STATE,
  isFiltered,
  isStateHash,
  matches,
  parseState,
  toHash,
  type ExplorerEntry
} from 'starpod/src/components/explorer/query';

const entry = (overrides: Partial<ExplorerEntry> = {}): ExplorerEntry => ({
  index: 0,
  duration: 3600,
  people: ['robbiethewagner', 'argyleink'],
  position: 0,
  text: 'css container queries with chris coyier',
  video: true,
  year: '2024',
  ...overrides
});

describe('explorer query', () => {
  it('reads every documented parameter', () => {
    expect(
      parseState(
        '#q=%20css%20&kind=audio&guest=chriscoyier&year=2023&progress=1&sort=longest&view=list'
      )
    ).toEqual({
      q: 'css',
      kind: 'audio',
      guest: 'chriscoyier',
      year: '2023',
      progress: true,
      sort: 'longest',
      view: 'list'
    });
  });

  it('falls back to defaults for missing or unknown values', () => {
    expect(parseState('#kind=vinyl&sort=random&view=table&year=next')).toEqual(
      DEFAULT_STATE
    );
  });

  it('leaves defaults out of the URL', () => {
    expect(toHash(DEFAULT_STATE)).toBe('');
    expect(toHash({ ...DEFAULT_STATE, kind: 'video', view: 'list' })).toBe(
      '#kind=video&view=list'
    );
  });

  it("tells its own hashes from the page's anchors", () => {
    expect(isStateHash('')).toBe(true);
    expect(isStateHash('#all')).toBe(true);
    expect(isStateHash('#guest=argyleink&sort=oldest')).toBe(true);
    expect(isStateHash('#main')).toBe(false);
    expect(isStateHash('#guest=argyleink&utm=x')).toBe(false);
  });

  it('round-trips through the URL', () => {
    const state = parseState('#q=ai&guest=argyleink&sort=oldest');
    expect(parseState(toHash(state))).toEqual(state);
  });

  it('knows sort and view only rearrange', () => {
    expect(isFiltered({ ...DEFAULT_STATE, sort: 'oldest', view: 'list' })).toBe(
      false
    );
    expect(isFiltered({ ...DEFAULT_STATE, year: '2024' })).toBe(true);
  });

  it('matches every word of a search, in any order', () => {
    expect(matches(entry(), { ...DEFAULT_STATE, q: 'Coyier CSS' })).toBe(true);
    expect(matches(entry(), { ...DEFAULT_STATE, q: 'css grid' })).toBe(false);
  });

  it('filters by kind, year, person and progress', () => {
    expect(matches(entry(), { ...DEFAULT_STATE, kind: 'audio' })).toBe(false);
    expect(
      matches(entry({ video: false }), { ...DEFAULT_STATE, kind: 'audio' })
    ).toBe(true);
    expect(matches(entry(), { ...DEFAULT_STATE, year: '2025' })).toBe(false);
    expect(matches(entry(), { ...DEFAULT_STATE, guest: 'argyleink' })).toBe(
      true
    );
    expect(matches(entry(), { ...DEFAULT_STATE, guest: 'chriscoyier' })).toBe(
      false
    );
    expect(
      matches(entry({ position: 12 }), { ...DEFAULT_STATE, progress: true })
    ).toBe(false);
    expect(
      matches(entry({ position: 600 }), { ...DEFAULT_STATE, progress: true })
    ).toBe(true);
  });

  it("counts an episode in progress by the engine's resume rule: past 30s", () => {
    const progress = { ...DEFAULT_STATE, progress: true };
    expect(matches(entry({ position: 30 }), progress)).toBe(false);
    expect(matches(entry({ position: 30.5 }), progress)).toBe(true);
  });

  it('sorts newest, oldest, longest and shortest', () => {
    const a = entry({ index: 0, duration: 1800 });
    const b = entry({ index: 1, duration: 5400 });
    const c = entry({ index: 2, duration: 3600 });
    const order = (sort: Parameters<typeof compare>[0]) =>
      [c, a, b].sort(compare(sort)).map((e) => e.index);
    expect(order('newest')).toEqual([0, 1, 2]);
    expect(order('oldest')).toEqual([2, 1, 0]);
    expect(order('longest')).toEqual([1, 2, 0]);
    expect(order('shortest')).toEqual([0, 2, 1]);
  });
});
