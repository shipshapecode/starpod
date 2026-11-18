import { act, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountBoard, nextEpisode } from 'starpod/src/components/media/board';
import StageControls from 'starpod/src/components/media/StageControls';
import {
  currentEpisode,
  currentTime,
  dequeue,
  enqueue,
  islandHome,
  isPlaying,
  moveInQueue,
  playEpisode,
  playNext,
  queue
} from 'starpod/src/components/state';

const episode = (n: number) => ({
  id: `ep-${n}`,
  title: `Episode Title ${n}`,
  audio: { src: `${n}.mp3`, type: 'audio/mpeg' },
  episodeNumber: String(n),
  slug: `episode-${n}`,
  duration: 1800
});

const ids = () => queue.value.map((queued) => queued.id);

describe('Up next queue', () => {
  beforeEach(() => {
    queue.value = [];
    currentEpisode.value = null;
    isPlaying.value = false;
  });

  it('queues each episode once, in order, and remembers it', () => {
    enqueue(episode(1));
    enqueue(episode(2));
    enqueue(episode(1));
    expect(ids()).toEqual(['ep-1', 'ep-2']);
    expect(JSON.parse(localStorage.getItem('starpod:queue')!).map((e: { id: string }) => e.id)).toEqual([
      'ep-1',
      'ep-2'
    ]);
  });

  it('reorders and removes', () => {
    [1, 2, 3].forEach((n) => enqueue(episode(n)));
    moveInQueue('ep-3', 0);
    expect(ids()).toEqual(['ep-3', 'ep-1', 'ep-2']);
    moveInQueue('ep-3', 99);
    expect(ids()).toEqual(['ep-1', 'ep-2', 'ep-3']);
    dequeue('ep-2');
    expect(ids()).toEqual(['ep-1', 'ep-3']);
  });

  it('plays the next episode, taking it off the queue', () => {
    enqueue(episode(1));
    enqueue(episode(2));
    expect(playNext()).toBe(true);
    expect(currentEpisode.value?.id).toBe('ep-1');
    expect(isPlaying.value).toBe(true);
    expect(ids()).toEqual(['ep-2']);

    // Playing a queued episode from anywhere takes it off too.
    playEpisode(episode(2));
    expect(ids()).toEqual([]);
    expect(playNext()).toBe(false);
  });

  it('adds at a place in Up next, where 0 plays next', () => {
    enqueue(episode(1));
    enqueue(episode(2));
    enqueue(episode(3), 0);
    enqueue(episode(4), 1);
    expect(ids()).toEqual(['ep-3', 'ep-4', 'ep-1', 'ep-2']);
  });

  it('adds and removes an episode from its stage', () => {
    const { container } = render(<StageControls episode={episode(4)} part="actions" />);
    const toggle = screen.getByRole('button', { name: 'Up next' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);
    expect(ids()).toEqual(['ep-4']);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(ids()).toEqual([]);

    // Not offered for the episode that is already playing, though it keeps
    // its place in the row (unseen and out of reach), so the row keeps its height.
    act(() => {
      currentEpisode.value = episode(4);
    });
    expect(screen.queryByRole('button', { name: 'Up next' })).toBeNull();
    expect(container.querySelector('.button-secondary')).toHaveAttribute('inert');
  });
});

describe('stored state', () => {
  afterEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('ignores a stored queue, corner or docking it cannot use', async () => {
    localStorage.setItem('starpod:queue', '{"not":"a list"}');
    localStorage.setItem('starpod:pip-corner', '"middle"');
    localStorage.setItem('starpod:pip-docked', '"yes"');
    vi.resetModules();
    const state = await import('starpod/src/components/state');
    expect(state.queue.value).toEqual([]);
    expect(state.pipCorner.value).toBe('se');
    expect(state.pipDocked.value).toEqual({ watch: false, listen: true });

    localStorage.setItem(
      'starpod:queue',
      JSON.stringify([{ id: 'ep-1', title: 'Kept', audio: { src: '1.mp3' } }, { id: 2 }, null, 'x'])
    );
    vi.resetModules();
    const again = await import('starpod/src/components/state');
    expect(again.queue.value.map((queued) => queued.id)).toEqual(['ep-1']);
  });
});

describe('the Up next board', () => {
  const shelf = [5, 6, 7, 8].map(episode);
  const fill = (id: string) => document.querySelector(`.tile[data-id="${id}"]`)?.getAttribute('data-⚓️-fill');
  let stop = () => {};

  beforeEach(() => {
    queue.value = [];
    isPlaying.value = false;
    currentEpisode.value = episode(1);
    currentTime.value = 1;
    islandHome.value = 'card';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          episodes: {
            data: shelf.map((e) => ({ ...e, episodeSlug: e.slug, episodeThumbnail: `${e.id}.jpg` }))
          }
        })
      }))
    );
    const host = document.createElement('div');
    document.body.append(host);
    stop = mountBoard(host).stop;
  });

  afterEach(() => {
    stop();
    document.body.replaceChildren();
    vi.unstubAllGlobals();
    islandHome.value = 'dock';
  });

  it('fetches the shelf only once something has actually played', async () => {
    stop();
    document.body.replaceChildren();
    const fetched = vi.mocked(fetch);
    fetched.mockClear();
    currentTime.value = 0;
    const host = document.createElement('div');
    document.body.append(host);
    stop = mountBoard(host).stop;
    await new Promise((done) => setTimeout(done, 300));
    expect(fetched).not.toHaveBeenCalled();
    act(() => {
      currentTime.value = 2;
    });
    await waitFor(() => expect(fetched).toHaveBeenCalledTimes(1));
  });

  it('gives every episode one cover that fills a slot by name, and never moves it in the DOM', async () => {
    await waitFor(() => expect(fill('ep-5')).toBe('--slot-s0'));
    expect(fill('ep-1')).toBe('--slot-now');
    const covers = [...document.querySelectorAll('.tile')];

    act(() => enqueue(episode(2)));
    expect(fill('ep-2')).toBe('--slot-q0');
    act(() => enqueue(episode(6), 0));
    expect(fill('ep-6')).toBe('--slot-q0');
    expect(fill('ep-2')).toBe('--slot-q1');
    // The shelf closes up behind the cover that left it.
    expect(fill('ep-5')).toBe('--slot-s0');
    expect(fill('ep-7')).toBe('--slot-s1');
    // The same elements, in the same order: only the attribute changed.
    expect([...document.querySelectorAll('.tile')].slice(0, covers.length)).toEqual(covers);
  });

  it('says how to queue another under Up next: a tap on a cover below', async () => {
    const hint = () => document.querySelector('.board-row[data-drop] .board-row-name')?.textContent;
    expect(hint()).toBe('Nothing queued yet');
    act(() => enqueue(episode(2)));
    await waitFor(() => expect(hint()).toBe('Tap a cover below to queue it'));
    expect(document.body.textContent).not.toContain('Drop a cover here');
  });

  it("gives each queued row a remove of its own, off the cover", () => {
    act(() => enqueue(episode(2)));
    const removes = [...document.querySelectorAll<HTMLButtonElement>('.board-row-remove')];
    // One per queued row; the row after them has none.
    expect(removes.map((button) => button.hidden)).toEqual([false, true]);
    expect(removes[0]).toHaveAccessibleName('Remove Episode Title 2 from Up next');
    fireEvent.click(removes[0]!);
    expect(ids()).toEqual([]);
  });

  it('queues a shelf cover on a tap, and plays a queued one, sending the old one to the shelf', async () => {
    await waitFor(() => expect(fill('ep-5')).toMatch(/^--slot-s/));
    fireEvent.click(document.querySelector('.tile[data-id="ep-5"] .tile-hit')!);
    expect(ids()).toEqual(['ep-5']);
    expect(fill('ep-5')).toBe('--slot-q0');
    expect(nextEpisode()?.id).toBe('ep-5');

    fireEvent.click(document.querySelector('.tile[data-id="ep-5"] .tile-hit')!);
    expect(currentEpisode.value?.id).toBe('ep-5');
    expect(fill('ep-5')).toBe('--slot-now');
    expect(ids()).toEqual([]);
    // What was playing goes to the end of the shelf.
    const shelfOrder = [...document.querySelectorAll<HTMLElement>('.tile[data-⚓️-fill^="--slot-s"]')]
      .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order))
      .map((tile) => tile.dataset.id);
    expect(shelfOrder.at(-1)).toBe('ep-1');
  });

  it('reorders and removes from the keyboard', async () => {
    await waitFor(() => expect(fill('ep-5')).toMatch(/^--slot-s/));
    act(() => {
      enqueue(episode(2));
      enqueue(episode(3));
    });
    const second = document.querySelector<HTMLElement>('.tile[data-id="ep-2"] .tile-hit')!;
    fireEvent.keyDown(second, { key: 'ArrowDown', altKey: true });
    expect(ids()).toEqual(['ep-3', 'ep-2']);
    expect(screen.getByText(/Episode Title 2 is 2 in Up next/)).toBeInTheDocument();
    fireEvent.keyDown(second, { key: 'Delete' });
    expect(ids()).toEqual(['ep-3']);
    // Out of Up next, it waits at the front of the shelf.
    expect(fill('ep-2')).toBe('--slot-s0');
  });

  it('puts a held cover back in its slot when the card closes under the drag', async () => {
    await waitFor(() => expect(fill('ep-5')).toMatch(/^--slot-s/));
    const tile = document.querySelector<HTMLElement>('.tile[data-id="ep-5"]')!;
    tile.setPointerCapture = () => {};
    // The face is what is held and moved; the tile stays on its anchor.
    const face = tile.querySelector<HTMLElement>('.tile-face')!;
    fireEvent.pointerDown(tile, { button: 0, clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(tile, { clientX: 60, clientY: 40, pointerId: 1 });
    expect(face.style.transition).toBe('none');
    expect(face.style.getPropertyValue('--tx')).toBe('50');
    expect(tile.getAttribute('style') ?? '').not.toMatch(/--tx|transition/);

    act(() => {
      islandHome.value = 'dock';
    });
    expect(face.style.transition).toBe('');
    expect(face.style.getPropertyValue('--tx')).toBe('0');
    expect(tile).not.toHaveAttribute('data-held');
    // The pointer coming up afterwards drops nothing.
    fireEvent.pointerUp(tile, { pointerId: 1 });
    expect(ids()).toEqual([]);
  });

  it('reads the slots once per drag, not on every move', async () => {
    await waitFor(() => expect(fill('ep-5')).toMatch(/^--slot-s/));
    const tile = document.querySelector<HTMLElement>('.tile[data-id="ep-5"]')!;
    tile.setPointerCapture = () => {};
    fireEvent.pointerDown(tile, { button: 0, clientX: 10, clientY: 10, pointerId: 1 });
    const read = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    for (const x of [30, 50, 70, 90]) {
      fireEvent.pointerMove(tile, { clientX: x, clientY: 20, pointerId: 1 });
    }
    expect(read).toHaveBeenCalledTimes(document.querySelectorAll('.slot').length);
    read.mockRestore();
    fireEvent.pointerUp(tile, { pointerId: 1 });
  });

  it('keeps the keys it handles to itself, and Enter taps a cover', async () => {
    await waitFor(() => expect(fill('ep-5')).toMatch(/^--slot-s/));
    const behind = vi.fn();
    document.addEventListener('keydown', behind);
    const hit = document.querySelector<HTMLElement>('.tile[data-id="ep-5"] .tile-hit')!;
    expect(fireEvent.keyDown(hit, { key: 'Enter' })).toBe(false);
    expect(ids()).toEqual(['ep-5']);
    expect(fireEvent.keyDown(hit, { key: 'ArrowRight' })).toBe(false);
    expect(behind).not.toHaveBeenCalled();
    // Keys it does not handle go on as usual.
    fireEvent.keyDown(hit, { key: 'k' });
    expect(behind).toHaveBeenCalledTimes(1);
    document.removeEventListener('keydown', behind);
  });

  it('labels each cover with where it is and what a tap does', async () => {
    await waitFor(() => expect(fill('ep-5')).toMatch(/^--slot-s/));
    act(() => enqueue(episode(2)));
    expect(document.querySelector('.tile[data-id="ep-2"] .tile-hit')).toHaveAccessibleName(
      'Episode Title 2: Up next 1 of 1, tap to play now'
    );
    expect(document.querySelector('.tile[data-id="ep-6"] .tile-hit')).toHaveAccessibleName(
      'Episode Title 6: more episodes, tap to play next'
    );
    // Captions in sentence case, and a remove control on the queued cover.
    expect(document.querySelector('.board-row-meta')).toHaveTextContent('Ep 2 · 30 min');
    expect(document.querySelector('.shelf-cell-meta')).toHaveTextContent(/^Ep \d+ · 30 min$/);
    // (Its row's remove, for phones, has the same name; CSS shows one or the other.)
    fireEvent.click(document.querySelector('.tile[data-id="ep-2"] .tile-remove')!);
    expect(ids()).toEqual([]);
  });
});
