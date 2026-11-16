/**
 * Up next, as a board where "the DOM never moves" (the queue demo).
 *
 * Now playing, Up next and a shelf of more episodes are slots: plain layout
 * in the island's card. Episode covers are sibling tiles at the end of the
 * board, never re-parented; each one fills a slot by name
 * (`data-⚓️-fill="--slot-q2"`). The ring is that mapping. Every change (play,
 * queue, reorder, next, an episode ending, the explorer adding one) rewrites
 * the attribute and one staggered flip() flies every cover that changed slot,
 * resizing between the big now-playing slot and the small ones. A cover can
 * be dragged onto any slot: held mid-flight, nudged, and released with a
 * forced flip. What flies and is dragged is the cover's face, inside it: the
 * tile on its anchor keeps its style, since Chrome lays an anchor-positioned
 * box out again on every change to its style.
 *
 * The state is state.ts's (`queue`, `currentEpisode`); the board only draws
 * it and asks for changes. Client-only.
 */
import { effect, signal, untracked } from '@preact/signals';

import { flip, hold, nudge, type FlipProps } from '../../motion/propflip';
import { formatDuration } from '../../utils/playable';
import {
  currentEpisode,
  currentTime,
  dequeue,
  enqueue,
  islandAt,
  moveInQueue,
  playEpisode,
  queue,
  type PlayableEpisode
} from '../state';

const A = 'data-⚓️-';
const MAX_NEXT = 6;
const SHELF = 12;
const STAGGER = 22;

/** Episodes the board has met, by id. */
const known = new Map<string, PlayableEpisode>();
/** The shelf's own order: more episodes, the ones played most recently last. */
let shelf: Array<string> = [];
let loading: Promise<void> | null = null;
/** Bumped whenever the shelf changes, so what reads it (nextEpisode()) re-renders. */
const shelfChanged = signal(0);

type Place = { name: string; order: number; label: string };

/* Writes only what changed: rewriting an attribute or a text to the same value
   still restyles or relays it out, and a cover's tabindex is dearer still. */
function set(el: Element, attr: string, value: string) {
  if (el.getAttribute(attr) !== value) {
    el.setAttribute(attr, value);
  }
}

function text(el: Element, value: string) {
  if (el.textContent !== value) {
    el.textContent = value;
  }
}

function showImage() {
  return document.querySelector<HTMLImageElement>('.rail-art img, .topbar-show img')?.src;
}

/** The shelf comes from the JSON API (see mountBoard() for when). */
function loadShelf(): Promise<void> {
  loading ??= fetch('/api/episodes/1.json')
    .then((response) => (response.ok ? response.json() : null))
    .then((body) => {
      const fallback = showImage();
      for (const episode of body?.episodes?.data ?? []) {
        const playable: PlayableEpisode = {
          audio: episode.audio,
          duration: episode.duration,
          episodeNumber: episode.episodeNumber,
          id: episode.id,
          image: episode.episodeThumbnail ?? fallback,
          slug: episode.episodeSlug,
          title: episode.title,
          video: episode.video
        };
        known.set(playable.id, { ...playable, ...known.get(playable.id) });
        if (!shelf.includes(playable.id)) {
          shelf.push(playable.id);
        }
      }
      shelfChanged.value++;
    })
    .catch(() => {
      loading = null;
    });
  return loading;
}

const number = (episode: PlayableEpisode) =>
  episode.episodeNumber && episode.episodeNumber !== 'Bonus' ? `Ep ${episode.episodeNumber}` : 'Bonus';

/** One unit of proof under a title: "Ep 240 · 1 hr 5 min". */
function caption(episode: PlayableEpisode) {
  return episode.duration ? `${number(episode)} · ${formatDuration(episode.duration)}` : number(episode);
}

export interface Board {
  stop: () => void;
}

/**
 * Build the board inside `host` (the island's queue part). Returns the board;
 * call stop() when the island goes away.
 */
export function mountBoard(host: HTMLElement): Board {
  host.innerHTML = `
    <i aria-hidden="true" class="slot slot-now" ${A}name="--slot-now"></i>
    <section class="board-next" aria-labelledby="board-next-title">
      <h3 class="board-title" id="board-next-title">Up next</h3>
      <ol class="board-next-list"></ol>
    </section>
    <section class="board-shelf" aria-labelledby="board-shelf-title">
      <h3 class="board-title" id="board-shelf-title">More episodes</h3>
      <p class="board-hint">Tap a cover to queue it · drag any cover onto any slot</p>
      <p class="board-quiet" id="board-hint">Enter queues a cover, or plays a queued one. Arrows move between covers, Alt with an arrow reorders Up next, Delete takes one out.</p>
      <div class="board-shelf-grid"></div>
    </section>
    <div class="board-tiles"></div>
    <p aria-live="polite" class="board-quiet board-live"></p>`;
  const nextList = host.querySelector<HTMLElement>('.board-next-list')!;
  const shelfGrid = host.querySelector<HTMLElement>('.board-shelf-grid')!;
  const tileLayer = host.querySelector<HTMLElement>('.board-tiles')!;
  const live = host.querySelector<HTMLElement>('.board-live')!;
  const tiles = new Map<string, HTMLElement>();
  const hit = (tile: HTMLElement) => tile.querySelector<HTMLButtonElement>('.tile-hit')!;
  /** What flies and is dragged: the cover's face (the tile itself stays on its anchor). */
  const face = (tile: HTMLElement) => tile.firstElementChild as HTMLElement;
  const tileOf = (el: HTMLElement) => el.parentElement as HTMLElement;
  let lastNow: string | undefined;
  let lastQueue = new Set<string>();
  let committing = false;
  let focusId: string | undefined;

  const say = (message: string) => (live.textContent = message);
  const open = () => islandAt.value === 'card';

  /** The ring: which episode fills which slot, in slot order. */
  function ring() {
    const now = currentEpisode.value;
    const next = queue.value.slice(0, MAX_NEXT);
    const taken = new Set([now?.id, ...next.map((episode) => episode.id)]);
    const rest = shelf.filter((id) => !taken.has(id) && known.has(id)).slice(0, SHELF);
    const places = new Map<string, Place>();
    let order = 0;
    if (now) {
      places.set(now.id, { name: '--slot-now', order: order++, label: 'now playing' });
    }
    next.forEach((episode, i) =>
      places.set(episode.id, {
        name: `--slot-q${i}`,
        order: order++,
        label: `Up next ${i + 1} of ${next.length}, tap to play now`
      })
    );
    rest.forEach((id, i) =>
      places.set(id, { name: `--slot-s${i}`, order: order++, label: 'more episodes, tap to play next' })
    );
    return { next, rest, places };
  }

  function slots(parent: HTMLElement, count: number, make: (i: number) => HTMLElement) {
    while (parent.children.length > count) {
      parent.lastElementChild!.remove();
    }
    for (let i = parent.children.length; i < count; i++) {
      parent.append(make(i));
    }
  }

  function tileFor(episode: PlayableEpisode) {
    let tile = tiles.get(episode.id);
    if (tile) {
      return tile;
    }
    // A cover: the art (the button you tap or drag), a glass chip with its
    // number on it, and a remove control that shows on hover or focus.
    tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.id = episode.id;
    tile.innerHTML = `<div class="tile-face PropFLIP"><button aria-describedby="board-hint" class="tile-hit" tabindex="-1" type="button"><img alt="" decoding="async" loading="lazy"><span class="tile-chip"></span></button><button class="tile-remove" tabindex="-1" type="button"><svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>`;
    const img = tile.querySelector('img')!;
    if (episode.image) {
      img.src = episode.image;
    }
    tile.querySelector('.tile-chip')!.textContent = number(episode);
    tile.querySelector('.tile-remove')!.setAttribute('aria-label', `Remove ${episode.title} from Up next`);
    wire(tile);
    // One that appears with the card open (the shelf arriving late) fades in,
    // in slot order.
    if (open()) {
      tile.dataset.arriving = '';
      window.setTimeout(() => delete tile.dataset.arriving, 1500);
    }
    tileLayer.append(tile);
    tiles.set(episode.id, tile);
    return tile;
  }

  const name = (el: HTMLElement, anchor: string) => {
    set(el, `${A}name`, anchor);
    set(el, 'data-slot', anchor);
  };

  /** Write the ring onto the slots and covers. Synchronous, so flip() can measure it. */
  function render() {
    name(host.querySelector<HTMLElement>('.slot-now')!, '--slot-now');
    const now = currentEpisode.value;
    // The episode that just stopped being current goes to the end of the
    // shelf as far as it shows (the conveyor), never off the end of it.
    if (lastNow && lastNow !== now?.id && !queue.value.some((episode) => episode.id === lastNow)) {
      const taken = new Set([now?.id, ...queue.value.map((episode) => episode.id)]);
      const rest = shelf.filter((id) => id !== lastNow);
      const shown = rest.filter((id) => !taken.has(id) && known.has(id)).slice(0, SHELF - 1);
      rest.splice(shown.length ? rest.indexOf(shown.at(-1)!) + 1 : 0, 0, lastNow);
      shelf = rest;
    }
    lastNow = now?.id;
    // One taken out of Up next (not to play it) goes back to the front of the shelf.
    const queued = new Set(queue.value.map((episode) => episode.id));
    for (const id of lastQueue) {
      if (!queued.has(id) && id !== now?.id) {
        shelf = [id, ...shelf.filter((other) => other !== id)];
      }
    }
    lastQueue = queued;
    for (const episode of [now, ...queue.value]) {
      if (episode) {
        known.set(episode.id, { ...known.get(episode.id), ...episode });
      }
    }
    const { next, rest, places } = ring();

    slots(nextList, next.length + 1, () => {
      const row = document.createElement('li');
      row.className = 'board-row';
      row.innerHTML = `<i aria-hidden="true" class="slot"></i><span class="board-row-text"><span class="board-row-name"></span><span class="board-row-meta"></span></span>`;
      return row;
    });
    // The row after Up next says how to add one: the shelf is under it in
    // every form of the card, once it has covers.
    const more = rest.length ? 'Tap a cover below to queue it' : 'Queue more from any episode';
    [...nextList.children].forEach((row, i) => {
      name(row.querySelector<HTMLElement>('.slot')!, i < next.length ? `--slot-q${i}` : '--slot-drop');
      text(
        row.querySelector('.board-row-name')!,
        i < next.length ? next[i]!.title : next.length ? more : 'Nothing queued yet'
      );
      text(row.querySelector('.board-row-meta')!, i < next.length ? caption(next[i]!) : '');
      row.toggleAttribute('data-drop', i === next.length);
    });
    // Each shelf slot carries its occupant's title and caption beneath it.
    slots(shelfGrid, rest.length, () => {
      const cell = document.createElement('div');
      cell.className = 'shelf-cell';
      cell.innerHTML = `<i aria-hidden="true" class="slot"></i><span class="shelf-cell-title"></span><span class="shelf-cell-meta"></span>`;
      return cell;
    });
    [...shelfGrid.children].forEach((cell, i) => {
      const episode = known.get(rest[i]!)!;
      name(cell.querySelector<HTMLElement>('.slot')!, `--slot-s${i}`);
      text(cell.querySelector('.shelf-cell-title')!, episode.title);
      text(cell.querySelector('.shelf-cell-meta')!, caption(episode));
    });

    for (const [id, place] of places) {
      const tile = tileFor(known.get(id)!);
      const episode = known.get(id)!;
      set(tile, `${A}fill`, place.name);
      set(tile, 'data-slot', place.name);
      set(tile, 'data-order', String(place.order));
      if (tile.style.getPropertyValue('--slot-i') !== String(place.order)) {
        tile.style.setProperty('--slot-i', String(place.order));
      }
      tile.classList.toggle('is-now', place.name === '--slot-now');
      tile.toggleAttribute('data-queued', place.name.startsWith('--slot-q'));
      tile.hidden = false;
      set(hit(tile), 'aria-label', `${episode.title}: ${place.label}`);
    }
    for (const [id, tile] of tiles) {
      if (!places.has(id)) {
        tile.hidden = true;
        tile.classList.remove('is-now');
        tile.removeAttribute(`${A}fill`);
      }
    }
  }

  /**
   * One cover is in the tab order: the focused one, or else the first. Done
   * at the next frame, never in the middle of a change: a tabindex change
   * makes the browser bring style and layout up to date there and then,
   * which at the frame it does anyway.
   */
  let roving = 0;
  function roveAll() {
    cancelAnimationFrame(roving);
    roving = requestAnimationFrame(() => {
      const list = ordered();
      const keep = list.find((tile) => tile.dataset.id === focusId) ?? list[0];
      tiles.forEach((tile) => rove(tile, tile === keep));
    });
  }

  /** The one cover in the tab order, with its remove control when it has one. */
  function rove(tile: HTMLElement, active: boolean) {
    // The attribute, not the tabIndex property: reading that asks whether the
    // button can take focus, which brings style up to date mid-update.
    const tab = (button: HTMLButtonElement, on: boolean) => set(button, 'tabindex', on ? '0' : '-1');
    tab(hit(tile), active);
    tab(tile.querySelector<HTMLButtonElement>('.tile-remove')!, active && Boolean(tile.dataset.slot?.startsWith('--slot-q')));
  }

  /**
   * The covers the keyboard moves between, in slot order. Not the one now
   * playing: the picture stands in front of it (and where it has no box of
   * its own, WebKit will not focus it), and a tap on it does nothing.
   */
  const ordered = () =>
    [...tiles.values()]
      .filter((tile) => !tile.hidden && !tile.classList.contains('is-now'))
      .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));

  /** Change the state and fly every cover that moved, in slot order. */
  function commit(change: () => void, opts: { stagger?: number; force?: (el: HTMLElement) => boolean } = {}) {
    committing = true;
    const shelfBefore = shelf;
    try {
      if (!open()) {
        change();
        render();
        // Nothing flies while the card is closed, so a cover still held from
        // a drag the card closed under goes straight back to its slot.
        for (const tile of tiles.values()) {
          if (face(tile).style.transition === 'none') {
            settle(tile);
          }
        }
      } else {
        const force = opts.force;
        flip([...tiles.values()].map(face), () => {
          change();
          render();
        }, {
          force: force && ((el) => force(tileOf(el))),
          order: (a, b) => Number(tileOf(a).dataset.order) - Number(tileOf(b).dataset.order),
          stagger: opts.stagger ?? STAGGER
        });
      }
      roveAll();
    } finally {
      committing = false;
      if (shelf !== shelfBefore) {
        shelfChanged.value++;
      }
    }
  }

  // ---------- what each gesture means ----------

  const kindOf = (name: string) =>
    name === '--slot-now' ? 'now' : name.startsWith('--slot-s') ? 'shelf' : 'next';
  const indexOf = (name: string) => Number(name.replace(/\D+/g, '')) || 0;

  /** The one that plays when the current one leaves now: Up next first, then the shelf. */
  const successor = () => queue.value[0] ?? known.get(ring().rest[0] ?? '');

  /** Tap: a shelf cover plays next; a queued one plays now. */
  function tap(tile: HTMLElement) {
    const episode = known.get(tile.dataset.id!);
    const kind = kindOf(tile.dataset.slot ?? '');
    if (!episode || kind === 'now') {
      return;
    }
    if (kind === 'shelf') {
      commit(() => enqueue(episode, 0));
      say(`${episode.title} plays next.`);
    } else {
      commit(() => playEpisode(episode));
      say(`Playing ${episode.title}.`);
    }
  }

  /** A cover dropped on a slot (or nowhere: it flies home). */
  function drop(tile: HTMLElement, onto: string | null) {
    const force = (el: HTMLElement) => el === tile;
    const episode = known.get(tile.dataset.id!);
    const from = kindOf(tile.dataset.slot ?? '');
    if (!episode || !onto || onto === tile.dataset.slot) {
      commit(() => {}, { force });
      return;
    }
    const to = onto === '--slot-drop' ? 'next' : kindOf(onto);
    const at = onto === '--slot-drop' ? Infinity : indexOf(onto);
    commit(() => {
      if (to === 'now') {
        // In it goes; what was playing waits at the front of Up next.
        const was = currentEpisode.value;
        playEpisode(episode);
        if (was) {
          enqueue(was, 0);
        }
      } else if (to === 'next') {
        if (from === 'now') {
          const following = successor();
          if (following) {
            playEpisode(following);
          }
          enqueue(episode, at);
        } else if (from === 'next') {
          moveInQueue(episode.id, at);
        } else {
          enqueue(episode, at);
        }
      } else {
        if (from === 'now') {
          const following = successor();
          if (following) {
            playEpisode(following);
          }
        }
        dequeue(episode.id);
        lastQueue.delete(episode.id);
        const others = shelf.filter((id) => id !== episode.id);
        const shown = ring().rest.filter((id) => id !== episode.id);
        const before = shown[at];
        others.splice(before ? others.indexOf(before) : others.length, 0, episode.id);
        shelf = others;
        lastNow = currentEpisode.value?.id;
      }
    }, { force });
    say(`${episode.title} moved.`);
  }

  // ---------- pointer: tap, or drag onto any slot ----------

  let drag: {
    tile: HTMLElement;
    x: number;
    y: number;
    p: FlipProps | null;
    moved: boolean;
    over: HTMLElement | null;
  } | null = null;

  // The slots' rects, read once per drag before anything moves (reading them
  // after each nudge would lay the card out on every move), and again only
  // if the card scrolls or the window resizes under the drag.
  let rects: Array<{ slot: HTMLElement; r: DOMRect }> | null = null;
  const forget = () => (rects = null);
  const slotAt = (x: number, y: number) =>
    rects?.find(({ r }) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)?.slot ?? null;

  /** A cover back in its slot, nothing held. */
  function settle(tile: HTMLElement) {
    face(tile).style.transition = '';
    nudge(face(tile), { tx: 0, ty: 0, sx: 1, sy: 1 });
  }

  /** End a drag without dropping (the card closed under it): the cover goes home. */
  function letGo() {
    if (!drag) {
      return;
    }
    const { tile, over } = drag;
    drag = null;
    over?.removeAttribute('data-hot');
    delete tile.dataset.held;
    forget();
    removeEventListener('scroll', forget, { capture: true });
    removeEventListener('resize', forget);
    settle(tile);
  }

  function wire(tile: HTMLElement) {
    tile.addEventListener('pointerdown', (event) => {
      if (event.button || (event.target as Element).closest('.tile-remove')) {
        return;
      }
      tile.setPointerCapture(event.pointerId);
      drag = { tile, x: event.clientX, y: event.clientY, p: null, moved: false, over: null };
    });
    tile.addEventListener('pointermove', (event) => {
      if (drag?.tile !== tile) {
        return;
      }
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < 5) {
          return;
        }
        drag.moved = true;
        addEventListener('scroll', forget, { capture: true, passive: true });
        addEventListener('resize', forget, { passive: true });
      }
      rects ??= [...host.querySelectorAll<HTMLElement>('.slot')].map((slot) => ({ slot, r: slot.getBoundingClientRect() }));
      if (!drag.p) {
        tile.dataset.held = '';
        // Grabbing mid-flight keeps it exactly where it is.
        drag.p = hold(face(tile));
      }
      nudge(face(tile), { ...drag.p!, tx: drag.p!.tx + dx, ty: drag.p!.ty + dy });
      const over = slotAt(event.clientX, event.clientY);
      if (over !== drag.over) {
        drag.over?.removeAttribute('data-hot');
        over?.setAttribute('data-hot', '');
        drag.over = over;
      }
    });
    const end = () => {
      if (drag?.tile !== tile) {
        return;
      }
      const { moved, over } = drag;
      drag = null;
      over?.removeAttribute('data-hot');
      delete tile.dataset.held;
      forget();
      removeEventListener('scroll', forget, { capture: true });
      removeEventListener('resize', forget);
      if (moved) {
        tile.dataset.dragged = '';
        drop(tile, over?.dataset.slot ?? null);
      }
    };
    tile.addEventListener('pointerup', end);
    tile.addEventListener('pointercancel', end);
    // Capture can be lost without a pointerup (the tile hidden, the window
    // blurred); the drop then happens where the cover is.
    tile.addEventListener('lostpointercapture', end);
    // The click lands on the cover itself (it holds the pointer while pressed).
    tile.addEventListener('click', (event) => {
      if ((event.target as Element).closest('.tile-remove')) {
        return;
      }
      // A drag ends in a click too; only a tap (or a key) means tap.
      if (tile.dataset.dragged !== undefined) {
        delete tile.dataset.dragged;
        return;
      }
      tap(tile);
    });
    tile.querySelector('.tile-remove')!.addEventListener('click', () => {
      const episode = known.get(tile.dataset.id!);
      if (episode) {
        commit(() => dequeue(episode.id));
        say(`${episode.title} is out of Up next.`);
      }
    });
    tile.addEventListener('focusin', () => (focusId = tile.dataset.id));
    hit(tile).addEventListener('keydown', (event) => key(tile, event));
  }

  // ---------- keys: the drag's equivalents ----------

  function key(tile: HTMLElement, event: KeyboardEvent) {
    const list = ordered();
    const at = list.indexOf(tile);
    const episode = known.get(tile.dataset.id!);
    const queued = tile.dataset.slot?.startsWith('--slot-q');
    const step = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1;
    if (event.key.startsWith('Arrow') && event.altKey && queued && episode) {
      const index = queue.value.findIndex((item) => item.id === episode.id);
      commit(() => moveInQueue(episode.id, index + step));
      say(`${episode.title} is ${Math.max(1, Math.min(queue.value.length, index + step + 1))} in Up next.`);
      hit(tile).focus();
    } else if (event.key.startsWith('Arrow')) {
      const target = list[Math.max(0, Math.min(list.length - 1, at + step))];
      if (target) {
        list.forEach((item) => rove(item, item === target));
        hit(target).focus();
      }
    } else if ((event.key === 'Delete' || event.key === 'Backspace') && queued && episode) {
      commit(() => dequeue(episode.id));
      say(`${episode.title} is out of Up next.`);
      const after = list[at + 1];
      if (after) {
        hit(after).focus();
      }
    } else if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
      tap(tile);
    } else {
      return;
    }
    // A key the board handles is not also acted on by anything behind it.
    event.preventDefault();
    event.stopPropagation();
  }

  // ---------- staying in step with everyone else ----------

  // The card closing under a drag (Escape, a number key) ends it.
  const stopClosing = effect(() => {
    if (!open()) {
      untracked(letGo);
    }
  });

  const stopState = effect(() => {
    void currentEpisode.value;
    void queue.value;
    if (!committing) {
      // Auto-advance, the explorer's enqueue, a play elsewhere: the same flight.
      untracked(() => commit(() => {}));
    }
  });
  // The board is always current (every change renders it, open or not), so
  // opening the card only flips. The shelf is fetched and drawn ahead of
  // time, on idle once something has actually played (its clock has moved),
  // while the card is parked; when the visitor asks to save data, only once
  // the card first opens. Should it arrive with the card open, it waits for
  // the island to land, then its covers fade in one after another.
  let stopped = false;
  function arrive() {
    if (stopped) {
      return;
    }
    const island = document.getElementById('player');
    if (open() && island?.hasAttribute('data-moving')) {
      window.setTimeout(arrive, 100);
      return;
    }
    commit(() => {});
  }
  const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 200));
  const lean = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  let asked = false;
  const stopAsking = effect(() => {
    if (asked || !(lean ? open() : currentTime.value > 0)) {
      return;
    }
    asked = true;
    idle(() => !stopped && void loadShelf().then(arrive));
    queueMicrotask(() => stopAsking());
  });

  return {
    stop: () => {
      stopped = true;
      cancelAnimationFrame(roving);
      stopClosing();
      stopState();
      stopAsking();
    }
  };
}

/**
 * What the skip button goes to: Up next's first, or else the shelf's. Only
 * Up next plays on its own when an episode ends (state.ts, playNext()); the
 * shelf's first is a skip the visitor chooses.
 */
export function nextEpisode(): PlayableEpisode | undefined {
  void shelfChanged.value;
  if (queue.value[0]) {
    return queue.value[0];
  }
  const taken = new Set([currentEpisode.value?.id]);
  const id = shelf.find((item) => !taken.has(item) && known.has(item));
  return id ? known.get(id) : undefined;
}
