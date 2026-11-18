/**
 * The home page's explorer: search, filter, sort, re-view and open the
 * whole archive in the browser. Every episode is already in the page; this
 * only decides which cards show, in what order and in which layout, and
 * carries the cards on screen to their new places with PropFLIP.
 *
 * - Only cards near the viewport are measured and flipped (an
 *   IntersectionObserver keeps that set), so the cost of a change doesn't
 *   grow with the archive, and `content-visibility` keeps skipping the rest.
 * - A card flips as parts: its artwork scales (it is square in every
 *   layout, so it never squishes), its text block only travels, and when
 *   the text block changes width its re-wrapped lines fade in at the
 *   destination instead of being stretched.
 * - Opening a card is the Close-Up (propflip-anchored-auto-layout's
 *   demos/closeup.html): its artwork, facts line and title re-target to
 *   their own slots in a close-up layout on three delays, the title growing
 *   as type and the artwork turning over, while the archive folds into a
 *   filmstrip beside it in the same change. The arrow keys step through the
 *   results and swap mid-flight; Escape closes.
 * - Cards that leave fade out where they stood, out of the flow; cards that
 *   arrive come in with `@starting-style`; cards that slide into view from
 *   far away rise in.
 * - Everything is interruptible: a flip starts from the pixels on screen.
 *
 * State lives in the URL query (see ./query.ts), so other pages can link
 * into a filtered archive and back/forward steps through the changes.
 */
import {
  flip,
  onFlip,
  registerFlipTargets,
  reducedMotion,
  type FlipRect
} from '../../motion/propflip';
import { readPosition } from '../media/position';
import {
  currentEpisode,
  dequeue,
  enqueue,
  playEpisode,
  queue,
  type PlayableEpisode
} from '../state';
import FullPlayButton from '../FullPlayButton';
import { personFact } from '../../lib/cast';
import { effect, untracked } from '@preact/signals';
import { h, render as mount } from 'preact';
import {
  compare,
  DEFAULT_STATE,
  inProgress,
  isFiltered,
  matches,
  parseState,
  toSearch,
  type ExplorerEntry,
  type ExplorerState
} from './query';

interface Card {
  entry: ExplorerEntry;
  li: HTMLElement;
  art: HTMLButtonElement;
  turn: HTMLElement;
  body: HTMLElement;
  facts: HTMLElement;
  title: HTMLElement;
  play: HTMLElement;
  detail: HTMLElement;
}

/** The episode's playable slice, from its card (Card.astro writes it once). */
function playableOf(li: HTMLElement): PlayableEpisode {
  const data = li.dataset;
  const title = li.querySelector('.xp-title a')!;
  return {
    audio: { src: data.audio!, type: data.audioType ?? 'audio/mpeg' },
    duration: Number(data.duration),
    episodeNumber: li.querySelector<HTMLElement>('.xp-number')!.dataset.number!,
    id: data.id!,
    image: data.thumb,
    slug: title.getAttribute('href')!.slice(1),
    title: title.textContent!.trim(),
    video: data.video
      ? { src: data.video, type: data.videoType ?? 'application/x-mpegURL' }
      : undefined
  } as PlayableEpisode;
}

/** Milliseconds between one card and the next in a cascade, and its cap. */
const STEP = 16;
const MAX_DELAY = 240;
/** The Close-Up's three delays: artwork, facts line, title (then play). */
const PART_STEP = 60;
/** How long a change to the close-up takes to land, at --slomo 1. */
const SWAP_MS = 1300;
/** When a card in the archive has all but arrived (explorer.css: its
 * flight eases out over 550ms, 97% of the way by half of it), and when one
 * coming home from the close-up has (its title, last of its parts, sets
 * out 120ms in, over 600ms). */
const ARRIVED_MS = 280;
/** When a card the sidebar carries has nearly arrived (the column glides on
 * the same clock, so its text may come back sooner). */
const CARRIED_MS = 140;
/** How long a card leaving the cut takes to clear its text (explorer.css). */
const LEAVE_MS = 120;
const SWAP_ARRIVED_MS = 480;
// Where the reading order can follow `order`, a sort only restyles the
// cards; elsewhere the cards move in the DOM so keyboard and screen readers
// meet them in the order they are shown.
const READING_FLOW =
  typeof CSS !== 'undefined' && CSS.supports('reading-flow', 'grid-order');
// Only the cards around the viewport are boxes in the archive's grid (see
// "The window" below). Where find in page can't open a parked block
// (hidden until found), the close-up can't anchor its parts, or a parked
// block can't lay its cards on the grid's own tracks, every card stays in
// the grid.
const WINDOWING =
  typeof CSS !== 'undefined' &&
  'onbeforematch' in HTMLElement.prototype &&
  CSS.supports('position-anchor', '--x') &&
  CSS.supports('grid-template-rows', 'subgrid');
// A card the shell glides keeps its containment and widens its clip (see
// `fly`), where the browser has a clip to widen.
const GLIDE_CLIP =
  typeof CSS !== 'undefined' && CSS.supports('overflow-clip-margin', '1px');

function slomo() {
  return (
    Number(
      getComputedStyle(document.documentElement).getPropertyValue('--slomo')
    ) || 1
  );
}

/** The archive's sizes when it was last live, and what they depend on. */
let lastSize: { key: string; width: string; bar: string } | undefined;
const sizeKey = () =>
  `${innerWidth} ${document.documentElement.dataset.rail ?? ''}`;

// Coming home as wide as the archive last was, it arrives sized: the router
// lays the incoming page out once (to restore its scroll), and that is the
// archive's only layout before the morph home is captured.
if (typeof document !== 'undefined') {
  document.addEventListener('astro:before-swap', (event) => {
    const explorer = (
      event as Event & { newDocument?: Document }
    ).newDocument?.querySelector<HTMLElement>('[data-explorer]');
    if (!explorer || lastSize?.key !== sizeKey()) {
      return;
    }
    explorer.style.setProperty('--xp-bar-h', lastSize.bar);
    explorer
      .querySelectorAll<HTMLElement>(
        '.xp-stage, .xp-list, [data-xp-ghost="title"]'
      )
      .forEach((el) => el.style.setProperty('--xp-w', lastSize!.width));
    explorer.querySelector('.xp-stage')?.setAttribute('data-sized', '');
  });
}

function clock(seconds: number) {
  const s = Math.floor(seconds);
  const parts = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
  return (parts[0] ? parts : parts.slice(1))
    .map((n, i) => (i ? String(n).padStart(2, '0') : String(n)))
    .join(':');
}

export function startExplorer() {
  const found = document.querySelector<HTMLElement>('[data-explorer]');
  if (!found || found.dataset.live !== undefined) {
    return;
  }
  const root: HTMLElement = found;
  root.dataset.live = '';

  const list = root.querySelector<HTMLElement>('.xp-list')!;
  const stage = root.querySelector<HTMLElement>('.xp-stage')!;
  const closeup = root.querySelector<HTMLElement>('[data-xp-closeup]')!;
  const ghostFacts = closeup.querySelector<HTMLElement>(
    '[data-xp-ghost="facts"]'
  )!;
  const ghostTitle = closeup.querySelector<HTMLElement>(
    '[data-xp-ghost="title"]'
  )!;
  const form = root.querySelector<HTMLFormElement>('.xp-bar-in')!;
  const bar = root.querySelector<HTMLElement>('[data-xp-bar]')!;
  const status = root.querySelector<HTMLElement>('[data-xp-status]')!;
  const empty = root.querySelector<HTMLElement>('[data-xp-empty]')!;
  const shownCount = root.querySelector('[data-xp-shown]')!;
  const ofTotal = root.querySelector<HTMLElement>('[data-xp-of]')!;
  const progressButton =
    form.querySelector<HTMLButtonElement>('[data-xp-progress]')!;
  const search = form.elements.namedItem('q') as HTMLInputElement;
  const lifetime = new AbortController();
  const { signal } = lifetime;

  // A pointer resting on the page as it arrives (a reload, or back from an
  // episode) is not a hover yet: the browser applies :hover a beat later on
  // its own (with pointerover, never pointermove), and the card under it
  // would start to grow by itself. Cards answer the pointer once it moves.
  root.dataset.still = '';
  const moved = () => {
    delete root.dataset.still;
    removeEventListener('pointermove', moved);
  };
  addEventListener('pointermove', moved, { signal, passive: true });

  // Everyone on the show, from the With menu: name and portrait by id. A
  // card's cast is made from these when it opens.
  const everyone = new Map<string, { name: string; photo: string }>();
  for (const option of form.querySelectorAll('#xp-people .xp-option')) {
    const id = option.querySelector('input')!.value;
    if (id) {
      everyone.set(id, {
        name: option.querySelector('span:not([class])')!.textContent!.trim(),
        photo: option.querySelector('img')?.getAttribute('src') ?? ''
      });
    }
  }
  const idsOf = (li: HTMLElement, key: 'people' | 'hosts') =>
    li.dataset[key] ? li.dataset[key]!.split(' ').map(decodeURIComponent) : [];

  const cards: Array<Card> = [...list.children].map((node) => {
    const li = node as HTMLElement;
    const part = <T extends HTMLElement>(selector: string) =>
      li.querySelector<T>(selector)!;
    let text: string | undefined;
    return {
      entry: {
        index: Number(li.dataset.index),
        duration: Number(li.dataset.duration),
        people: idsOf(li, 'people'),
        position: 0,
        // Read from the card when a search first needs it, not on arrival
        // (coming home, the explorer starts inside the morph).
        get text() {
          return (text ??= [
            part('.xp-facts').textContent,
            part('.xp-title').textContent,
            part('.xp-desc').textContent,
            ...idsOf(li, 'people').map((id) => everyone.get(id)?.name)
          ]
            .join(' ')
            .replace(/\s+/g, ' ')
            .toLowerCase());
        },
        video: li.dataset.video !== undefined,
        year: li.dataset.year ?? ''
      },
      li,
      art: part<HTMLButtonElement>('.xp-art'),
      turn: part('.xp-turn'),
      body: part('.xp-text'),
      facts: part('.xp-facts'),
      title: part('.xp-title'),
      play: part('.xp-play'),
      detail: part('.xp-detail')
    };
  });
  const cardOf = new Map<Element, Card>(cards.map((card) => [card.li, card]));

  /** A year or person the menus don't offer is no filter at all (a stale
   * link, or people when the site has no guests database). */
  function known(next: ExplorerState): ExplorerState {
    const offered = (name: 'year' | 'guest') => {
      const field = form.elements.namedItem(name) as RadioNodeList | null;
      return new Set(
        field
          ? [...field].map((input) => (input as HTMLInputElement).value)
          : []
      );
    };
    return {
      ...next,
      year: offered('year').has(next.year) ? next.year : '',
      guest: offered('guest').has(next.guest) ? next.guest : ''
    };
  }

  let state = known(parseState(location.search));
  // The page arrives newest first.
  let order = cards;
  let sorted: ExplorerState['sort'] = 'newest';
  // The card in the close-up, and the cards on their way in or out of it.
  let open: Card | null = null;
  // The stage's width, as last measured.
  let width = '';
  const swapping = new Map<Card, number>();
  // While the explorer runs a flip of its own, its listener adds the cascade.
  let mine = false;
  // The view the archive was in when the change began (its text's look),
  // and where the stage was once it had changed.
  let fromView = 'grid';
  let stageAt: DOMRect | null = null;
  let scale = 1;

  /* ---------- What is on screen ---------- */

  const near = new Set<Card>();
  const watcher = new IntersectionObserver(
    (entries) => {
      for (const { isIntersecting, target } of entries) {
        const card = cardOf.get(target)!;
        if (isIntersecting) {
          near.add(card);
        } else {
          near.delete(card);
        }
      }
    },
    { rootMargin: '25% 0px' }
  );
  cards.forEach((card) => watcher.observe(card.li));

  /** The line under the sticky toolbar: cards above it are out of sight. */
  function fold() {
    return bar.getBoundingClientRect().bottom;
  }

  /** Shown cards whose box is in the viewport now, found by bisection. */
  function onScreen() {
    const shown = order.filter(
      (card) => !card.li.hidden && card.li.parentElement === list
    );
    const top = fold();
    let lo = 0;
    let hi = shown.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (shown[mid]!.li.getBoundingClientRect().bottom <= top) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    const seen: Array<Card> = [];
    for (const card of shown.slice(lo)) {
      if (card.li.getBoundingClientRect().top >= innerHeight) {
        break;
      }
      seen.push(card);
    }
    return seen;
  }

  // In the close-up (and on the way in or out) the text block comes apart:
  // its facts line and title travel on their own.
  const parts = (card: Card) =>
    card === open || swapping.has(card)
      ? [card.art, card.facts, card.title, card.play]
      : [card.art, card.body, card.play];

  /** Each close-up part's place in the Close-Up's three delays. */
  function partIndex(card: Card, el: HTMLElement) {
    return [card.art, card.facts, card.title, card.play].indexOf(el);
  }

  /* ---------- The window ----------
     Every card box in the grid costs each frame that changes anything on
     the page (the compositor's layerizing walks them all, rendered or
     skipped) and every relayout of the grid. So only the cards around the
     viewport are grid items. The rest wait in two parked blocks, one before
     them and one after: each is one box spanning exactly the rows its cards
     would take (every row is the same height), with its cards laid on the
     same tracks inside (subgrid) and hidden until found, so find in page
     opens a block where the match would be and the window moves there. The
     window follows the scroll, and every change re-windows around the card
     it keeps in place. The HTML still holds every card in the grid. */

  const parked = (where: 'above' | 'below') => {
    const block = document.createElement('li');
    block.className = 'xp-park';
    block.dataset[where] = '';
    block.dataset.empty = '';
    block.setAttribute('role', 'none');
    block.setAttribute('hidden', 'until-found');
    return block;
  };
  const above = parked('above');
  const below = parked('below');
  // Shown cards [from, to) in display order are in the grid.
  let win = { from: 0, to: Infinity };
  let windowed = false;
  // The grid's columns and its row pitch, read from style (no layout).
  let span = 1;
  let pitch = 0;
  let inset = 0;

  const inGrid = (card: Card) => card.li.parentElement === list;
  const activeTransition = () => {
    try {
      return document.documentElement.matches(':active-view-transition');
    } catch {
      return false;
    }
  };

  function metrics() {
    const style = getComputedStyle(list);
    const row = parseFloat(style.gridAutoRows);
    span = parseInt(style.getPropertyValue('--xp-span'), 10) || 1;
    pitch = row + (parseFloat(style.rowGap) || 0);
    inset = parseFloat(style.paddingTop) || 0;
    return row > 0 && pitch > 0;
  }

  /** Rows above and below the viewport the window keeps. */
  const margin = () => Math.max(2, Math.ceil(innerHeight / pitch));

  /** The rows in the viewport now (one layout read). */
  // The first row whose top is in the viewport, and where: noted with every
  // read of the rows in view (no read of its own), so a resize can hold it.
  let seenRow: { row: number; y: number; span: number } | null = null;
  function viewRows() {
    const top = list.getBoundingClientRect().top + inset;
    const row = Math.max(0, Math.ceil(-top / pitch));
    seenRow = { row, y: top + row * pitch, span };
    return [
      Math.max(0, Math.floor(-top / pitch)),
      Math.max(0, Math.floor((innerHeight - top) / pitch))
    ] as const;
  }

  /**
   * The window around a card: the viewport it will be in (its top at `y`,
   * or centred) and a screen either side, as following the scroll keeps,
   * so the window that settles after a change is the one it made.
   */
  function rowsAround(card: Card, y = (innerHeight - pitch) / 2) {
    const shown = order.filter((other) => !other.li.hidden);
    const row = Math.floor(Math.max(0, shown.indexOf(card)) / span);
    const at = Math.min(Math.max(y, 0), innerHeight);
    const reach = margin();
    return [
      row - Math.ceil(at / pitch) - reach,
      row + Math.ceil((innerHeight - at) / pitch) + reach
    ] as const;
  }

  /**
   * Put the shown cards in rows `first` to `last` in the grid and the rest
   * in the parked blocks. `keep` stays in the grid wherever it falls (the
   * open card, the focused card, cards fading out where they stood).
   */
  function partition(
    first: number,
    last: number,
    keep = new Set<Card>(),
    linger = new Set<Card>()
  ) {
    const shown = order.filter((card) => !card.li.hidden);
    const rows = Math.ceil(shown.length / span);
    first = Math.max(0, Math.min(first, rows - 1));
    last = Math.max(first, Math.min(last, rows - 1));
    for (const card of keep) {
      if (card.li.hidden || card.li.dataset.away !== undefined) {
        continue;
      }
      const row = Math.floor(shown.indexOf(card) / span);
      first = Math.min(first, row);
      last = Math.max(last, row);
    }
    const from = rows ? first * span : 0;
    const to = rows ? Math.min(shown.length, (last + 1) * span) : 0;
    win = { from, to };
    above.style.setProperty('--xp-rows', String(rows ? first : 0));
    below.style.setProperty('--xp-rows', String(rows ? rows - last - 1 : 0));
    above.toggleAttribute('data-empty', !rows || first === 0);
    below.toggleAttribute('data-empty', !rows || last >= rows - 1);
    // Find in page may have opened one; the window has moved there now.
    for (const block of [above, below]) {
      if (block.getAttribute('hidden') !== 'until-found') {
        block.setAttribute('hidden', 'until-found');
      }
    }
    const grid = shown.slice(from, to);
    shown.forEach((card, i) => {
      if (i >= from && i < to) {
        fade(card, false);
        return;
      }
      // A card on screen whose new place is out of the window fades out
      // where it stood, and waits in the grid until it has.
      if (linger.has(card) && inGrid(card)) {
        fade(card, true);
      }
    });
    // Assistive technology meets only the window: it says where each card
    // is in the whole cut.
    grid.forEach((card, i) => {
      card.li.setAttribute('aria-posinset', String(from + i + 1));
      card.li.setAttribute('aria-setsize', String(shown.length));
    });
    // Cards go where they show: in the grid's DOM order (it is the reading
    // order where `order` isn't, and the order until a sort sets it) and
    // the blocks' (the order a block lays its cards out in, should find in
    // page open it). Only cards out of place move (a moved card is laid out
    // afresh and rebound by everything that observes it): each run is laid
    // past whatever else is in its parent, which moves elsewhere or stays.
    // (Cards hidden or fading out where they stood keep their DOM place.)
    const lay = (parent: Element, start: Element | null, run: Array<Card>) => {
      const members = new Set<Element>(run.map((card) => card.li));
      const next = (el: Element | null) => {
        let sibling = el ? el.nextElementSibling : parent.firstElementChild;
        while (sibling && !members.has(sibling)) {
          sibling = sibling.nextElementSibling;
        }
        return sibling;
      };
      let previous = start;
      for (const card of run) {
        if (next(previous) !== card.li) {
          if (previous) {
            previous.after(card.li);
          } else {
            parent.prepend(card.li);
          }
        }
        previous = card.li;
      }
    };
    // (A card fading out where it stood parks once it has.)
    const parks = (card: Card) => card.li.dataset.away === undefined;
    lay(list, above, grid);
    lay(above, null, shown.slice(0, from).filter(parks));
    lay(below, null, shown.slice(to).filter(parks));
  }

  /** Move the window to the viewport, if it is getting near an edge. */
  function follow(force = false) {
    if (!windowed || !metrics()) {
      return;
    }
    const [top, bottom] = viewRows();
    const reach = margin();
    const first = Math.floor(win.from / span);
    const last = Math.ceil(win.to / span) - 1;
    if (!force && top - first >= reach / 2 && last - bottom >= reach / 2) {
      return;
    }
    partition(top - reach, bottom + reach, kept());
  }

  /** Cards the window keeps wherever they fall. */
  function kept() {
    const keep = new Set<Card>([...flying.keys()].map((li) => cardOf.get(li)!));
    if (open) {
      keep.add(open);
    }
    // The focused card, and the card named for a view transition (coming
    // back from its episode, it flies home), stay in the grid.
    for (const li of [
      document.activeElement?.closest<HTMLElement>('.xp-card'),
      list.querySelector<HTMLElement>('.xp-card[data-vt-named]')
    ]) {
      if (li && cardOf.has(li)) {
        keep.add(cardOf.get(li)!);
      }
    }
    return keep;
  }

  let following = 0;
  let scrolled = false;
  const followSoon = () => {
    if (!following) {
      following = requestAnimationFrame(() => {
        following = 0;
        follow();
        if (scrolled) {
          scrolled = false;
          deepen(false);
        }
      });
    }
  };

  /* ---------- Depth ----------
     In the close-up only the strip's cells in view (and a quarter screen
     either way) are in depth (data-depth, explorer.css): their wrappers
     become boxes that lean back and catch the vantage. So opening, stepping
     and closing restyle the insides of those cells and of the cards flying,
     not of every cell the strip renders. While the page scrolls, cells take
     depth a screen ahead, before they render, and the far ones give it back
     once the scroll settles (`settled`). */
  const deep = new Set<Card>();
  function deepen(settled: boolean, extra: Iterable<Card> = []) {
    // Folding back into the wall, the cells keep their depth until they
    // land (`folding`), so they straighten up in perspective.
    if ((!open && (!deep.size || folded)) || !metrics()) {
      return;
    }
    const want = new Set<Card>();
    if (open) {
      const [top, bottom] = viewRows();
      const reach = settled
        ? Math.max(1, Math.ceil(innerHeight / pitch / 4))
        : margin();
      order
        .filter((card) => !card.li.hidden)
        .slice(Math.max(0, top - reach) * span, (bottom + reach + 1) * span)
        .forEach((card) => want.add(card));
      for (const card of extra) {
        if (!card.li.hidden) {
          want.add(card);
        }
      }
    }
    for (const card of deep) {
      if (settled && !want.has(card)) {
        delete card.li.dataset.depth;
        card.turn.parentElement!.style.removeProperty('perspective-origin');
        deep.delete(card);
      }
    }
    for (const card of want) {
      if (!deep.has(card)) {
        card.li.dataset.depth = '';
        deep.add(card);
      }
    }
  }

  /**
   * Start windowing, once the grid's rows have a size. The first partition
   * parks most of the archive, so it waits for idle time, and for any view
   * transition (the morph home) to end: moving the cards under one shifts
   * the page in WebKit, and would cost the morph its frames anywhere.
   */
  let starting: (() => void) | null = null;
  function startWindow() {
    if (windowed || !WINDOWING || starting) {
      return;
    }
    const begin = () => {
      starting = null;
      if (windowed || !metrics()) {
        return;
      }
      list.prepend(above);
      list.append(below);
      // Every row keeps its place as cards come and go, so the browser's
      // scroll anchoring has nothing to correct; left on, it would chase a
      // card on its way into or out of a parked block.
      list.style.overflowAnchor = 'none';
      windowed = true;
      follow(true);
    };
    const wait = () => {
      if (activeTransition()) {
        const timer = window.setTimeout(wait, 100);
        starting = () => clearTimeout(timer);
      } else if (typeof requestIdleCallback === 'function') {
        const idle = requestIdleCallback(begin, { timeout: 1000 });
        starting = () => cancelIdleCallback(idle);
      } else {
        const timer = window.setTimeout(begin, 50);
        starting = () => clearTimeout(timer);
      }
    };
    wait();
  }

  /**
   * Re-window after a change: around `card` (the one holding the reader's
   * place, or the close-up's), around the top of the results (`null`), or
   * around the viewport (left out). `y` is where that card's top will be in
   * the viewport, if not centred. `linger` were on screen: those whose
   * place is now out of the window fade out where they stood.
   */
  function reWindow(card?: Card | null, linger?: Set<Card>, y?: number) {
    if (!windowed || !metrics()) {
      return;
    }
    const keep = new Set<Card>();
    if (open) {
      keep.add(open);
    }
    // The focused card takes its new place rather than fade out where it
    // stood (inert, which would drop the focus).
    const focused = document.activeElement?.closest<HTMLElement>('.xp-card');
    if (focused && cardOf.has(focused)) {
      keep.add(cardOf.get(focused)!);
    }
    const anchor =
      card === null ? order.find((other) => !other.li.hidden) : card;
    if (anchor && !anchor.li.hidden) {
      const [first, last] = rowsAround(anchor, y);
      keep.add(anchor);
      partition(first, last, keep, linger);
    } else {
      const [top, bottom] = viewRows();
      partition(top - margin(), bottom + margin(), keep, linger);
    }
  }

  /**
   * A card fading out where it stood keeps its old place in the DOM until
   * it parks, which is the reading order where reading-flow isn't: until
   * then it is inert, out of the tab order and the accessibility tree.
   */
  function fade(card: Card, on: boolean) {
    card.li.toggleAttribute('data-away', on);
    card.li.inert = on;
  }

  /** Cards that faded out where they stood go to their parked block. */
  let settling = 0;
  function settleAway(after: number) {
    clearTimeout(settling);
    settling = window.setTimeout(() => {
      for (const card of cards) {
        fade(card, false);
      }
      follow(true);
    }, after);
  }

  /* ---------- Motion ---------- */

  const flying = new Map<HTMLElement, number>();
  const refitting = new WeakMap<HTMLElement, Animation>();
  /**
   * Copies of text blocks as they were (in `view`, at their old boxes),
   * fading out where they stood: inert, unseen by assistive technology,
   * gone once faded. Styled by a list in the old view, so they look as the
   * text did before it re-wrapped.
   */
  function fadeOutText(
    texts: Array<[HTMLElement, number, FlipRect]>,
    view: string,
    s: number,
    at?: DOMRect | null
  ) {
    if (!texts.length || reducedMotion()) {
      return;
    }
    const frame = at ?? stage.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'xp-fading-text';
    layer.dataset.view = view;
    layer.inert = true;
    layer.setAttribute('aria-hidden', 'true');
    for (const [el, , first] of texts) {
      const li = document.createElement('div');
      li.className = 'xp-fading-card';
      li.toggleAttribute(
        'data-current',
        el.closest<HTMLElement>('.xp-card')?.dataset.current !== undefined
      );
      const copy = el.cloneNode(true) as HTMLElement;
      for (const node of [copy, ...copy.querySelectorAll<HTMLElement>('*')]) {
        node.removeAttribute('id');
        node.removeAttribute('style');
        node.removeAttribute('data-props-for');
        node.classList.remove('PropFLIP');
      }
      copy.style.cssText = `position: absolute; left: ${first.left - frame.left}px; top: ${first.top - frame.top}px; width: ${first.width}px; height: ${first.height}px; margin: 0; transform: none;`;
      li.append(copy);
      layer.append(li);
    }
    stage.append(layer);
    layer.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 200 * s,
      easing: 'ease-out',
      fill: 'forwards'
    }).onfinish = () => layer.remove();
  }

  /** Text that lands somewhere new fades in there (opacity only). */
  function fadeIn(el: HTMLElement, delay: number, s: number) {
    refitting.get(el)?.cancel();
    refitting.set(
      el,
      el.animate([{ opacity: 0 }, { opacity: 1 }], {
        delay,
        duration: 380 * s,
        easing: 'ease-out',
        fill: 'backwards'
      })
    );
  }

  // A card skips styling and painting its contents while it is off screen
  // (content-visibility), and clips them to its box. A card about to fly
  // must render in full from before the flip until it lands, or its parts
  // would never start their transitions, or be cut off on the way.
  // The shell's glide carries only cards in view, which render already:
  // those keep their containment and widen their clip (`reach`, px) to
  // where their parts set out from, which restyles the card's own box and
  // nothing inside it, before the glide and after.
  function fly(card: Card, s: number, reach?: number) {
    if (reach === undefined) {
      card.li.dataset.flying = '';
    } else {
      card.li.style.setProperty('overflow-clip-margin', `${reach}px`);
    }
    clearTimeout(flying.get(card.li));
    flying.set(
      card.li,
      window.setTimeout(
        () => {
          delete card.li.dataset.flying;
          card.li.style.removeProperty('overflow-clip-margin');
          flying.delete(card.li);
          followSoon();
        },
        (900 + MAX_DELAY) * s
      )
    );
  }

  // Hears every flip, including the shell's sidebar. Nothing in here may
  // read style or layout before every delay is written: a flush would start
  // the transitions without their place in the cascade.
  const stopHearing = onFlip((moves) => {
    const s = mine ? scale : slomo();
    const ranks = new Map<HTMLElement, number>();
    const refits: Array<[HTMLElement, number, FlipRect]> = [];
    // How far outside its box each card the shell glides must paint: as far
    // as any of its parts sets out from where it lands.
    const reaches = new Map<Card, number>();
    for (const move of moves) {
      const li = move.el.closest<HTMLElement>('.xp-card');
      if (!li) {
        continue;
      }
      if (!ranks.has(li)) {
        ranks.set(li, ranks.size);
      }
      if (!mine && GLIDE_CLIP && cardOf.has(li)) {
        const { first, last } = move;
        reaches.set(
          cardOf.get(li)!,
          Math.max(
            reaches.get(cardOf.get(li)!) ?? 0,
            Math.abs(first.left - last.left),
            Math.abs(first.top - last.top),
            Math.abs(first.left + first.width - last.left - last.width),
            Math.abs(first.top + first.height - last.top - last.height)
          )
        );
      }
      // A cascade for the explorer's own changes, card by card in reading
      // order; anything already in flight keeps going without a pause. The
      // card going into or out of the close-up leaves on three delays.
      const card = cardOf.get(li);
      const part = card && swapping.has(card) ? partIndex(card, move.el) : -1;
      const delay =
        !mine || move.moving
          ? 0
          : part >= 0
            ? part * PART_STEP
            : Math.min(ranks.get(li)! * STEP, MAX_DELAY);
      if (mine) {
        move.el.style.setProperty('--flip-delay', `${delay}ms`);
      }
      if (
        move.el.classList.contains('xp-text') &&
        Math.abs(move.first.width - move.last.width) > 2
      ) {
        refits.push([move.el, delay, move.first]);
      }
    }
    // (The strip's leaning cells reach 48px past their boxes already.)
    reaches.forEach((reach, card) => fly(card, s, Math.ceil(reach) + 48));
    // Re-wrapped text can't be stretched into place: a copy of it as it was
    // fades out where it stood, and the text fades in where it lands once
    // the artwork has carried the card there (a list row's description
    // with it). Into the strip it only fades out: it leaves there.
    fadeOutText(
      refits,
      mine ? fromView : (list.dataset.view ?? 'grid'),
      s,
      mine ? stageAt : null
    );
    for (const [el, delay] of open ? [] : refits) {
      const detail = cardOf.get(el.closest<HTMLElement>('.xp-card')!)?.detail;
      for (const part of detail ? [el, detail] : [el]) {
        fadeIn(part, (delay + (mine ? ARRIVED_MS : CARRIED_MS)) * s, s);
      }
    }
  });

  // A shell layout change (the sidebar folding) carries only the cards that
  // are actually in view (read in one pass, then marked), and the close-up's
  // parts. Measured on home: the glide costs the same with no card motion at
  // all; one box per card (a translate and a uniform scale) held 60fps but
  // never 120 and scaled the type, so the parts travel on their own. They
  // are marked once the glide has measured them (above), unless the
  // browser can't widen a clip.
  // Before the glide measures where they land (settle), the archive sizes
  // itself from the column's new width (what the ResizeObserver would do a
  // frame late), re-deals its blocks if the column count changed, and holds
  // the reader's place: the first card in view (or the close-up's) stays
  // where it was on screen, as the browser's scroll anchoring would if the
  // window hadn't turned it off. Its boxes are measured in the viewport, so
  // that scroll is part of the flight.
  let carried: Array<Card> = [];
  let held: { card: Card; y: number } | null = null;
  const unregister = registerFlipTargets(
    () => {
      const top = fold();
      held = null;
      carried = [...near].filter((card) => {
        const box = card.li.getBoundingClientRect();
        const seen = card !== open && box.bottom > 0 && box.top < innerHeight;
        if (
          seen &&
          box.top >= top - 1 &&
          (!held ||
            box.top < held.y - 1 ||
            (box.top < held.y + 1 &&
              order.indexOf(card) < order.indexOf(held.card)))
        ) {
          held = { card, y: box.top };
        }
        return seen;
      });
      if (open) {
        held = { card: open, y: open.li.getBoundingClientRect().top };
        carried.push(open);
      }
      if (!GLIDE_CLIP) {
        const s = slomo();
        carried.forEach((card) => fly(card, s));
      }
      return carried.flatMap(parts);
    },
    {
      viewport: true,
      settle: () => {
        const columns = span;
        size();
        const place = held;
        held = null;
        if (!place || place.card.li.hidden) {
          return;
        }
        if (windowed && metrics() && span !== columns) {
          const [first, last] = rowsAround(place.card, place.y);
          partition(first, last, new Set([...carried, place.card]));
        }
        const shift = place.card.li.getBoundingClientRect().top - place.y;
        if (Math.abs(shift) > 0.5) {
          window.scrollBy({ top: shift, behavior: 'instant' });
        }
      }
    }
  );

  const wide = matchMedia('(min-width: 1024px)');

  /** Where the close-up's top edge sits: under the stuck toolbar. */
  function ceiling() {
    return parseFloat(getComputedStyle(bar).top) + bar.offsetHeight;
  }

  /** Where the dock and the phone's tab bar start covering the page. */
  function floor() {
    const style = getComputedStyle(root);
    return (
      innerHeight -
      (parseFloat(style.getPropertyValue('--dock-h')) || 0) -
      (wide.matches ? 0 : parseFloat(style.getPropertyValue('--tabbar-h')) || 0)
    );
  }

  /**
   * In the close-up the page itself scrolls the filmstrip, so nothing in
   * flight is ever clipped by a scroller, and the close-up sticks under the
   * toolbar. Bring `card`'s cell into view: centred when the close-up opens,
   * the least distance when stepping.
   */
  function placeStrip(card: Card, centre: boolean, smooth = false) {
    const top = ceiling();
    const box = stage.getBoundingClientRect();
    const view = closeup.getBoundingClientRect();
    // On a phone the close-up sits above the strip; the strip shows below.
    const band = view.left === box.left ? top + view.height : top;
    const bottom = floor();
    const cell = card.li.getBoundingClientRect();
    let shift = 0;
    if (centre) {
      shift = cell.top + cell.height / 2 - (band + bottom) / 2;
    } else if (cell.top < band + 8) {
      shift = cell.top - band - 8;
    } else if (cell.bottom > bottom - 8) {
      shift = cell.bottom - bottom + 8;
    }
    // The stage reaches the toolbar, so the close-up sticks at once, and
    // never scrolls past its end, so the close-up stays whole.
    const least = box.top - top;
    const most = Math.max(least, box.bottom - top - view.height);
    shift = Math.min(Math.max(shift, least), most);
    if (Math.abs(shift) > 0.5) {
      window.scrollBy({ top: shift, behavior: smooth ? 'smooth' : 'instant' });
    }
  }

  /** The toolbar is stuck under the top of the page. */
  const stuck = () =>
    bar.getBoundingClientRect().top <=
    parseFloat(getComputedStyle(bar).top) + 0.5;

  /**
   * Back in the archive, the closed card is in view, under the toolbar.
   * The page never scrolls back above the archive's top: the toolbar stays
   * stuck and nothing above the archive comes into view in one frame (only
   * the cards are carried through the scroll).
   */
  function placeHome(card: Card) {
    const top = ceiling();
    const bottom = floor();
    const box = card.li.getBoundingClientRect();
    if (box.top < top + 8 || box.bottom > bottom - 8) {
      const least = stage.getBoundingClientRect().top - top;
      const shift = Math.max(
        box.top + box.height / 2 - (top + bottom) / 2,
        Math.min(least, 0)
      );
      if (Math.abs(shift) > 0.5) {
        window.scrollBy({ top: shift, behavior: 'instant' });
      }
    }
  }

  /**
   * Run a layout change and carry the cards on screen through it.
   * `keep` is the card that should hold its place in the viewport. Left
   * out, the first card on screen that stays does; `null` (a re-sort) keeps
   * none. When there is nothing to hold and the visitor is down in the
   * results, they start under the toolbar again. `place` replaces all of
   * that (the close-up places the reader itself).
   */
  function change(
    mutate: () => void,
    {
      keep,
      place,
      anchor
    }: {
      keep?: Card | null;
      place?: () => void;
      /** The card the window must hold when `place` places the reader. */
      anchor?: Card | null;
    } = {}
  ) {
    // On screen now: in the viewport (read in one pass over the cards the
    // observer has near it), still in flight from the last change (its box
    // may be far away while its parts are not), or in the close-up. Cards
    // that come into view from further away rise in instead of flying.
    const before = new Set<Card>();
    for (const card of near) {
      const box = card.li.getBoundingClientRect();
      if (box.bottom > 0 && box.top < innerHeight) {
        before.add(card);
      }
    }
    for (const li of flying.keys()) {
      before.add(cardOf.get(li)!);
    }
    if (open) {
      before.add(open);
    }
    swapping.forEach((_, card) => before.add(card));
    scale = slomo();
    // Every read before the change comes first, in one pass; the first write
    // (marking the cards as flying) waits until the flip has measured them.
    const top = fold();
    // Where the reader is, unless the change places them itself.
    const seen = (place ? [] : keep !== undefined ? [keep] : [...before])
      .filter((card): card is Card => Boolean(card && !card.li.hidden))
      .map((card) => ({ card, y: card.li.getBoundingClientRect().top }))
      .filter(({ y }) => keep || (y >= top - 1 && y < innerHeight))
      .sort((a, b) => a.y - b.y);
    const listTop = list.getBoundingClientRect().top;
    const shownBefore = new Set(cards.filter((card) => !card.li.hidden));

    // Cards on screen that are about to leave fade out where they stand.
    const frame = stage.getBoundingClientRect();
    const leaving = [...before].filter((card) => !card.li.hidden);
    const boxes = leaving.map((card) => card.li.getBoundingClientRect());

    const targets = [...before].flatMap(parts);

    fromView = list.dataset.view ?? 'grid';
    mine = true;
    let position: Map<Element, number> | undefined;
    const rank = (el: HTMLElement) =>
      (position ??= new Map(order.map((card, n) => [card.li, n]))).get(
        el.closest('.xp-card')!
      )!;
    flip(
      targets,
      () => {
        // The browser's own scroll anchoring would pick its own card and
        // adjust again a frame later; this change places the reader itself.
        list.dataset.moving = '';
        before.forEach((card) => fly(card, scale));
        mutate();
        // Cards on screen that left the cut fade out where they stood:
        // marked and pinned there the moment they leave, before anything
        // reads style, which would take them out at once (display: none,
        // no fade). A card whose new place is out of the window is pinned
        // once the window has moved (below).
        const pin = (card: Card, i: number) => {
          const box = boxes[i]!;
          card.li.style.setProperty('--xp-x', `${box.left - frame.left}px`);
          card.li.style.setProperty('--xp-y', `${box.top - frame.top}px`);
          card.li.style.setProperty('--xp-w', `${box.width}px`);
          card.li.style.setProperty('--xp-h', `${box.height}px`);
        };
        leaving.forEach((card, i) => {
          card.li.toggleAttribute('data-exit', card.li.hidden);
          if (card.li.hidden) {
            pin(card, i);
          }
        });
        // The window moves with the reader: around the card that holds
        // their place (where it is held), the close-up's, or the top of the
        // results (just under the toolbar).
        const held =
          place || open ? undefined : seen.find(({ card }) => !card.li.hidden);
        const atTop = !place && !open && !held && listTop < top;
        if (windowed) {
          reWindow(
            place ? anchor : (open ?? held?.card ?? (atTop ? null : undefined)),
            new Set(leaving),
            held ? held.y : atTop ? top + 8 : undefined
          );
        }
        leaving.forEach((card, i) => {
          if (!card.li.hidden && card.li.dataset.away !== undefined) {
            pin(card, i);
          }
        });
        if (place) {
          place();
        } else if (open) {
          placeStrip(open, false);
        } else if (held) {
          // Hold the reader's place.
          window.scrollBy({
            top: held.card.li.getBoundingClientRect().top - held.y,
            behavior: 'instant'
          });
        } else if (atTop) {
          window.scrollBy({
            top: list.getBoundingClientRect().top - top - 8,
            behavior: 'instant'
          });
        }
        // In the close-up, the strip's cells in view and the cards flying
        // into it are in depth; closing, none are.
        deepen(true, before);
        // Where the stage is now, for the copies of re-wrapped text (read
        // here, where the flip is about to lay the page out anyway).
        stageAt = stage.getBoundingClientRect();
      },
      // The cascade runs in the order the cards are shown.
      { order: (a, b) => rank(a) - rank(b) }
    );
    mine = false;
    if (windowed) {
      settleAway(320 * scale);
    }
    // Let the browser's anchoring forget the old layout before it resumes.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => delete list.dataset.moving)
    );

    if (reducedMotion()) {
      return;
    }
    // Cards that were shown but far away and now slide into view rise in.
    // Found at the start of the next frame (still before it paints), where
    // the layout this read needs is computed once, with the frame's own,
    // rather than forced a second time inside the handler. Where cards on
    // screen are leaving, they rise once those have cleared their text
    // (explorer.css), so the two never read over each other.
    const s = scale;
    const clearing = leaving.some(
      (card) =>
        card.li.dataset.exit !== undefined || card.li.dataset.away !== undefined
    )
      ? LEAVE_MS
      : 0;
    requestAnimationFrame(() =>
      onScreen()
        .filter((card) => !before.has(card) && shownBefore.has(card))
        .forEach((card, i) => {
          // (Arriving, its picture fades in once loaded: explorer.css.)
          card.li.dataset.join = '';
          window.setTimeout(() => delete card.li.dataset.join, 700 * s);
          card.li.animate(
            [
              { opacity: 0, translate: '0 32px' },
              { opacity: 1, translate: '0 0' }
            ],
            {
              delay: (clearing + Math.min(i * STEP, MAX_DELAY)) * s,
              duration: 520 * s,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              fill: 'backwards'
            }
          );
        })
    );
  }

  /* ---------- State ---------- */

  function render(next: ExplorerState) {
    const shown = cards.filter((card) => matches(card.entry, next));
    const visible = new Set(shown);
    // The close-up's card left the cut: the close-up closes with it.
    if (open && !visible.has(open)) {
      home(open, false);
      open = null;
      delete root.dataset.open;
    }
    // Cards that join the cut fade up into their cell (@starting-style keys
    // on the mark); a card only moving between the grid and a parked block
    // is not arriving.
    const joined: Array<HTMLElement> = [];
    for (const card of cards) {
      const was = card.li.hidden;
      card.li.hidden = !visible.has(card);
      if (!card.li.hidden) {
        card.li.removeAttribute('data-exit');
        if (was) {
          card.li.dataset.join = '';
          joined.push(card.li);
        }
      }
    }
    if (joined.length) {
      window.setTimeout(
        () => joined.forEach((li) => delete li.dataset.join),
        700 * slomo()
      );
    }
    if (next.sort !== sorted) {
      sorted = next.sort;
      order = [...cards].sort((a, b) => compare(next.sort)(a.entry, b.entry));
      if (READING_FLOW) {
        order.forEach((card, i) => (card.li.style.order = String(i)));
      } else if (!windowed) {
        // Elsewhere the DOM order is the reading order (windowed, the
        // window keeps its own in step).
        list.append(...order.map((card) => card.li));
      }
    }
    list.dataset.view = next.view;

    empty.hidden = shown.length > 0;
    empty.querySelector('[data-xp-empty-what]')!.textContent = next.q
      ? `“${next.q}”`
      : 'those filters';
    shownCount.textContent = String(shown.length);
    ofTotal.hidden = !isFiltered(next);
  }

  /** Make the controls say what the state is (after a URL load or a back). */
  function syncControls(next: ExplorerState) {
    if (search.value.trim() !== next.q) {
      search.value = next.q;
    }
    for (const name of ['view', 'kind', 'sort', 'year', 'guest'] as const) {
      const field = form.elements.namedItem(name) as RadioNodeList | null;
      if (field) {
        field.value = next[name];
      }
    }
    progressButton.setAttribute('aria-pressed', String(next.progress));
    for (const name of ['sort', 'year', 'guest'] as const) {
      const label = form.querySelector(`[data-xp-label="${name}"]`);
      const field = form.elements.namedItem(name) as RadioNodeList | null;
      const option = [...(field ?? [])].find(
        (input) => (input as HTMLInputElement).checked
      );
      if (label) {
        label.textContent = next[name]
          ? (option?.parentElement?.querySelector('span:not([class])')
              ?.textContent ?? next[name])
          : name === 'year'
            ? 'Any'
            : 'Anyone';
        if (name !== 'sort') {
          label
            .closest('.xp-pick')!
            .toggleAttribute('data-on', Boolean(next[name]));
          const unset = form.querySelector<HTMLElement>(
            `[data-xp-unset="${name}"]`
          );
          if (unset) {
            unset.hidden = !next[name];
          }
        }
        // The With chip shows the chosen person's face.
        if (name === 'guest') {
          const face = form.querySelector<HTMLElement>('[data-xp-face]');
          const photo =
            option?.parentElement?.querySelector<HTMLImageElement>(
              '.person-face img'
            );
          if (face) {
            face.hidden = !next.guest || !photo;
            if (photo) {
              face.querySelector('img')!.src = photo.currentSrc || photo.src;
            }
          }
        }
      }
    }
    form.querySelector<HTMLElement>('[data-xp-reset]')!.hidden =
      !isFiltered(next);
  }

  let announce = 0;
  function tell(next: ExplorerState) {
    clearTimeout(announce);
    announce = window.setTimeout(() => {
      const count = cards.filter((card) => !card.li.hidden).length;
      status.textContent =
        count === 0
          ? 'No episodes match.'
          : isFiltered(next)
            ? `${count} of ${cards.length} episodes shown.`
            : `All ${cards.length} episodes shown.`;
    }, 500);
  }

  let lastParam = '';
  function remember(next: ExplorerState, param: string) {
    const url = location.pathname + toSearch(next);
    if (url === location.pathname + location.search) {
      return;
    }
    // Consecutive changes to one control (typing, arrowing through a menu)
    // are one step in history; switching controls starts a new one.
    if (param === lastParam) {
      history.replaceState(history.state, '', url);
    } else {
      history.pushState(history.state, '', url);
    }
    lastParam = param;
  }

  /**
   * Where the visitor has got to in each episode (the media engine keeps
   * saving it as they listen): progress bars, and the In progress chip.
   */
  function readProgress(next = state) {
    let started = 0;
    for (const card of cards) {
      card.entry.position = readPosition(card.li.dataset.id!);
      if (inProgress(card.entry)) {
        started++;
        card.li.style.setProperty(
          '--xp-progress',
          String(Math.min(card.entry.position / card.entry.duration, 1))
        );
      }
    }
    progressButton.hidden = started === 0 && !next.progress;
    progressButton.querySelector('[data-xp-progress-count]')!.textContent =
      String(started);
  }

  function commit(next: ExplorerState, param: string | null) {
    if (toSearch(next) === toSearch(state)) {
      return;
    }
    readProgress(next);
    if (open) {
      swap(open);
    }
    change(() => render(next), {
      keep: next.sort === state.sort ? undefined : null
    });
    state = next;
    syncControls(next);
    tell(next);
    if (param) {
      remember(next, param);
    }
  }

  /* ---------- The Close-Up ---------- */

  // The open card's detail after its description: its cast, where to
  // resume, and what to do. Only the open card shows them, so the page
  // carries one copy of the rest, moved into the card that opens, and the
  // cast is made from the With menu's people when a card first opens.
  const extras = root
    .querySelector<HTMLTemplateElement>('template[data-xp-actions]')!
    .content.cloneNode(true) as DocumentFragment;
  const resume = extras.querySelector<HTMLElement>('.xp-resume')!;
  const actions = extras.querySelector<HTMLElement>('.xp-actions')!;
  const queueButton = actions.querySelector<HTMLButtonElement>('.xp-queue')!;
  const openLink = actions.querySelector<HTMLAnchorElement>('.xp-open')!;
  const closeLabel = actions.querySelector('.xp-close .sr-only')!;
  const casts = new WeakMap<Card, HTMLElement | null>();

  /**
   * What each person is on each episode, in a line (`personFact`): their
   * tally, and which of their episodes this one is, counted oldest first.
   */
  let facts: Map<Card, Map<string, string>> | undefined;
  function factsOf(card: Card) {
    if (!facts) {
      facts = new Map();
      const tally = new Map<string, number>();
      cards.forEach((other) =>
        other.entry.people.forEach((id) =>
          tally.set(id, (tally.get(id) ?? 0) + 1)
        )
      );
      const seen = new Map<string, { count: number; first: string }>();
      for (const other of [...cards].sort(
        (a, b) => b.entry.index - a.entry.index
      )) {
        const number =
          other.facts.querySelector<HTMLElement>('.xp-number')!.dataset.number!;
        const label = number === 'Bonus' ? 'a bonus episode' : `Ep ${number}`;
        const hosts = new Set(idsOf(other.li, 'hosts'));
        const lines = new Map<string, string>();
        for (const id of other.entry.people) {
          const so = seen.get(id) ?? { count: 0, first: label };
          so.count += 1;
          seen.set(id, so);
          const host = hosts.has(id);
          lines.set(
            id,
            personFact({
              host,
              count: tally.get(id) ?? so.count,
              appearance: host ? undefined : so.count,
              first: so.first
            })
          );
        }
        facts.set(other, lines);
      }
    }
    return facts.get(card)!;
  }

  /** The card's cast as the shared people chips, made once. */
  function castOf(card: Card) {
    if (!casts.has(card)) {
      const people = card.entry.people.filter((id) => everyone.has(id));
      let list: HTMLElement | null = null;
      if (people.length) {
        const lines = factsOf(card);
        list = document.createElement('ul');
        list.className = 'xp-people';
        list.setAttribute('aria-label', 'Hosts and guests');
        for (const id of people) {
          const { name, photo } = everyone.get(id)!;
          const item = document.createElement('li');
          item.dataset.speaksAs = name;
          item.innerHTML =
            '<a class="person-chip"><span class="person-face" style="--person-size: 32px"><img alt="" decoding="async" height="32" width="32"></span><span class="xp-person"><span class="xp-person-name"></span><span class="person-fact"></span></span></a>';
          item.querySelector('a')!.href = `/?guest=${encodeURIComponent(id)}`;
          item.querySelector('img')!.src = photo;
          item.querySelector('.xp-person-name')!.textContent = name;
          item.querySelector('.person-fact')!.textContent = lines.get(id) ?? '';
          list.append(item);
        }
      }
      casts.set(card, list);
    }
    return casts.get(card)!;
  }

  function fillResume(card: Card) {
    const seconds = readPosition(card.li.dataset.id!);
    resume.hidden = seconds < 30;
    resume.textContent = `You stopped at ${clock(seconds)}, and play picks up there.`;
  }

  /** The Up next button says whether its episode is queued. */
  function syncQueue(card: Card, ids = new Set(queue.value.map((e) => e.id))) {
    const queued = ids.has(card.li.dataset.id!);
    queueButton.setAttribute('aria-pressed', String(queued));
    queueButton.querySelector('span')!.textContent = queued
      ? 'In Up next'
      : 'Add to Up next';
  }

  /**
   * The back of the card, made the first time it opens: the picture again,
   * its number and kind standing off it at different depths.
   */
  function backOf(card: Card) {
    if (card.turn.querySelector('.xp-back')) {
      return;
    }
    const front = card.turn.querySelector('img')!;
    const img = front.cloneNode() as HTMLImageElement;
    img.loading = 'eager';
    img.sizes = '(min-width: 1024px) 560px, 40vw';
    const layer = (name: string, text = '') => {
      const span = document.createElement('span');
      span.className = name;
      span.textContent = text;
      return span;
    };
    const face = layer('xp-face xp-back');
    face.setAttribute('aria-hidden', 'true');
    const length = card.facts.querySelector('.xp-facts-length')?.textContent;
    const light = card.turn
      .querySelector('.xp-progress')!
      .cloneNode() as HTMLElement;
    delete light.dataset.propsFor;
    face.append(
      img,
      light,
      layer('xp-plate-shade'),
      layer(
        'xp-plate-no',
        card.facts.querySelector<HTMLElement>('.xp-number')!.dataset.number!
      ),
      layer(
        'xp-plate-tag',
        `${card.entry.video ? 'Video' : 'Audio'} · ${length ?? ''}`
      )
    );
    card.turn.append(face);
    if (currentEpisode.value?.id === card.li.dataset.id) {
      light.dataset.propsFor = 'media-clock';
      clocked.push(light);
    }
  }

  /**
   * Re-home one card's parts: into the close-up's slots, or back to its
   * cell. The slots are CSS anchors; this only flips the attribute.
   */
  function home(card: Card, on: boolean) {
    card.li.toggleAttribute('data-on', on);
    card.art.setAttribute('aria-expanded', String(on));
    if (on) {
      // The close-up takes its light from the artwork (prop-for-that).
      card.li.dataset.propsTo = '.xp-stage';
      card.li.dataset.propsFor = 'img-color';
      card.title.style.setProperty('--xp-w', width);
      const cast = castOf(card);
      card.detail.append(...(cast ? [cast] : []), resume, actions);
      openLink.href = card.title.querySelector('a')!.href;
      closeLabel.textContent = `Close episode ${
        card.facts.querySelector<HTMLElement>('.xp-number')!.dataset.number
      }`;
      fillResume(card);
      syncQueue(card);
      // The text slots hold invisible copies, so they are exactly as big
      // as what lands in them.
      ghostFacts.replaceChildren(
        ...[...card.facts.childNodes].map((node) => node.cloneNode(true))
      );
      ghostTitle.textContent = card.title.textContent?.trim() ?? '';
    } else {
      card.title.style.removeProperty('--xp-w');
      delete card.li.dataset.propsFor;
      delete card.li.dataset.propsTo;
    }
  }

  /**
   * The close-up's detail column belongs to the open card and goes with it
   * the moment it closes; a copy of it, as it stands, fades out where it
   * was (inert, unseen by assistive technology, gone once faded).
   */
  function fadeOutDetail(card: Card) {
    const box = card.detail.getBoundingClientRect();
    if (reducedMotion() || !box.width || !box.height) {
      return;
    }
    const s = slomo();
    const copy = card.detail.cloneNode(true) as HTMLElement;
    for (const el of [copy, ...copy.querySelectorAll<HTMLElement>('*')]) {
      el.removeAttribute('id');
      delete el.dataset.propsFor;
    }
    // Styled as the open card's detail (explorer.css), so it looks as it
    // did; fixed where it stood in the viewport (outside the explorer, whose
    // containment would carry it with the page as the close scrolls).
    const shell = document.createElement('div');
    shell.className = 'xp-fading-detail';
    shell.inert = true;
    shell.setAttribute('aria-hidden', 'true');
    copy.style.cssText = `position: fixed; inset: auto; top: ${box.top}px; left: ${box.left}px; width: ${box.width}px; height: ${box.height}px; margin: 0;`;
    shell.append(copy);
    document.body.append(shell);
    copy.scrollTop = card.detail.scrollTop;
    copy.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 220 * s,
      easing: 'ease-out',
      fill: 'forwards'
    }).onfinish = () => shell.remove();
  }

  /** Mark a card as on its way into or out of the close-up until it lands. */
  function swap(card: Card) {
    clearTimeout(swapping.get(card));
    card.li.dataset.swap = '';
    swapping.set(
      card,
      window.setTimeout(() => {
        swapping.delete(card);
        delete card.li.dataset.swap;
      }, SWAP_MS * slomo())
    );
  }

  // While the archive folds into the strip (or back), the cards' text and
  // play discs fade on their way; once it lands they leave the page.
  let folded = 0;
  function folding(on: boolean) {
    if (!on) {
      return;
    }
    clearTimeout(folded);
    root.dataset.folding = '';
    folded = window.setTimeout(() => {
      folded = 0;
      delete root.dataset.folding;
      deepen(true);
    }, SWAP_MS * slomo());
  }

  /**
   * Show a card in the close-up, swap it for another (mid-flight too: the
   * old parts turn for home as the new ones leave), or close it (`null`).
   */
  function show(next: Card | null) {
    if (next === open) {
      return;
    }
    const prev = open;
    // Opening from above the archive (the toolbar not yet stuck), the page
    // scrolls up to it smoothly as the card flies, rather than at once: the
    // card and the archive set out at once, and nothing above the archive
    // is thrown out of view in one frame. (Stuck, only the toolbar's empty
    // margin lies between it and the archive, and the cards are carried
    // through the scroll: it happens at once.)
    const glide = Boolean(next && !prev && !reducedMotion() && !stuck());
    // The detail column it leaves fades where it stood.
    if (prev) {
      fadeOutDetail(prev);
    }
    // Folding back, the strip's cells straighten up seen from where they
    // were: the point each is seen from follows its place in the strip as
    // it scrolls (a view() timeline), and leaves with the open state, so it
    // is held where it stood, as a share of the cell (it moves with the
    // cell's new size), until the cell has landed and gives up its depth.
    if (prev && !next) {
      const held = [...deep].map((card) => {
        const tilt = card.turn.parentElement!;
        const [x, y] = getComputedStyle(tilt)
          .perspectiveOrigin.split(' ')
          .map(parseFloat);
        return [tilt, x! / tilt.offsetWidth, y! / tilt.offsetHeight] as const;
      });
      for (const [tilt, x, y] of held) {
        if (Number.isFinite(x) && Number.isFinite(y)) {
          tilt.style.perspectiveOrigin = `${x * 100}% ${y * 100}%`;
        }
      }
    } else if (next && !prev) {
      deep.forEach((card) =>
        card.turn.parentElement!.style.removeProperty('perspective-origin')
      );
    }
    if (prev) {
      swap(prev);
    }
    if (next) {
      swap(next);
      backOf(next);
    }
    for (const card of [prev, next]) {
      card?.art.style.setProperty('--flip-delay', '0ms');
      card?.facts.style.setProperty('--flip-delay', `${PART_STEP}ms`);
      card?.title.style.setProperty('--flip-delay', `${2 * PART_STEP}ms`);
    }
    change(
      () => {
        // Opening and closing fold the archive; stepping does not. (Marked
        // in the change: before it, the strip's text and play discs would
        // be laid out to be measured, 96px wide, and fly home stretched.)
        folding(!prev || !next);
        if (prev) {
          home(prev, false);
        }
        if (next) {
          home(next, true);
        }
        open = next;
        root.toggleAttribute('data-open', Boolean(next));
      },
      {
        place: () =>
          next ? placeStrip(next, !prev, glide) : prev && placeHome(prev),
        anchor: next ?? prev
      }
    );
    // Back in a list row, its description fades in as the title lands.
    if (prev && list.dataset.view === 'list' && !reducedMotion()) {
      fadeIn(prev.detail, SWAP_ARRIVED_MS * slomo(), slomo());
    }
    if (next) {
      status.textContent = `Episode ${
        next.facts.querySelector<HTMLElement>('.xp-number')?.dataset.number ??
        ''
      }: ${next.title.textContent?.trim()}. Arrow keys for the next and previous.`;
    }
  }

  // The media clock (`--live-progress`, `--live-paused`) is written only
  // where an element opts in. Only the playing episode's progress lights and
  // the hero's on-air levels opt in, and only while it is the current one, so
  // a tick restyles a handful of elements and never the archive.
  const byId = new Map(cards.map((card) => [card.li.dataset.id, card]));
  const hero = document.querySelector<HTMLElement>('.xp-hero');
  let clocked: Array<HTMLElement> = [];
  const stopClock = effect(() => {
    const id = currentEpisode.value?.id;
    clocked.forEach((el) => delete el.dataset.propsFor);
    clocked = [];
    if (!id) {
      return;
    }
    const card = byId.get(id);
    if (card) {
      clocked.push(...card.li.querySelectorAll<HTMLElement>('.xp-progress'));
    }
    if (hero?.dataset.id === id) {
      clocked.push(
        ...hero.querySelectorAll<HTMLElement>('.xp-hero-progress, .xp-onair')
      );
    }
    clocked.forEach((el) => (el.dataset.propsFor = 'media-clock'));
  });

  // The card whose episode is loaded gets the live play control (pause, the
  // on-air levels, buffering; it marks its card current and playing). Every
  // other card's disc is plain markup until it is pressed.
  let live: Card | null = null;
  const resting = new Map<Card, Element>();
  const stopLive = effect(() => {
    const id = currentEpisode.value?.id;
    const card = (id && byId.get(id)) || null;
    if (card === live) {
      return;
    }
    untracked(() => {
      if (live) {
        mount(null, live.play);
        live.play.append(resting.get(live)!);
        live.li.removeAttribute('data-current');
        live.li.removeAttribute('data-playing');
      }
      live = card;
      if (card) {
        const disc = card.play.querySelector('[data-static]');
        const focused = Boolean(disc) && disc === document.activeElement;
        if (disc) {
          resting.set(card, disc);
          disc.remove();
        }
        mount(
          h(FullPlayButton, { episode: playableOf(card.li), look: 'row' }),
          card.play
        );
        if (focused) {
          card.play.querySelector('button')?.focus({ preventScroll: true });
        }
      }
    });
  });

  const stopQueue = effect(() => {
    const ids = new Set(queue.value.map((episode) => episode.id));
    if (open) {
      syncQueue(open, ids);
    }
  });

  // The close-up sticks just under the toolbar, whatever its height; and
  // every card's exact size follows from the stage's width (explorer.css).
  // (The heading is as wide as the stage, and its size never depends on
  // the cards'.)
  const heading = root.querySelector<HTMLElement>('.xp-heading')!;
  function size() {
    // Both reads before any write, and only what changed is written (coming
    // home, the archive arrived sized already).
    const barHeight = `${bar.offsetHeight}px`;
    const was = width;
    width = `${heading.clientWidth}px`;
    const set = (el: HTMLElement | undefined, name: string, value: string) => {
      if (el && el.style.getPropertyValue(name) !== value) {
        el.style.setProperty(name, value);
      }
    };
    set(root, '--xp-bar-h', barHeight);
    // The stage's width doesn't inherit (explorer.css): it goes where
    // something sizes from it, so a width change restyles those alone.
    for (const el of [stage, list, ghostTitle, open?.title]) {
      set(el, '--xp-w', width);
    }
    if (stage.dataset.sized === undefined) {
      stage.dataset.sized = '';
    }
    lastSize = { key: sizeKey(), width, bar: barHeight };
    return width !== was;
  }
  const sizes = new ResizeObserver(() => {
    const place = seenRow;
    const columns = span;
    const resized = size();
    // In the close-up the strip's cells change size; depth follows them on
    // the next frame (and is trimmed once the page next settles).
    if (open) {
      scrolled = true;
      followSoon();
    }
    if (!windowed) {
      startWindow();
      return;
    }
    // A new column count re-deals the parked blocks' rows at once. Rows
    // that only grow or shrink keep every card in its place, so while the
    // sidebar's edge is dragged the window just follows, as on a scroll.
    const recount = metrics() && span !== columns;
    // A width the archive wasn't sized for already (a window resize, the
    // rail snapping where it doesn't glide; the glide sizes it in its
    // settle) holds the reader's place: the first card in view goes back
    // to where it was on screen, as the browser's scroll anchoring would.
    const card =
      resized && !open && place?.span === columns
        ? order.filter((other) => !other.li.hidden)[place.row * columns]
        : undefined;
    if (!card || !place) {
      if (recount) {
        follow(true);
      } else {
        followSoon();
      }
      return;
    }
    if (recount) {
      const [first, last] = rowsAround(card, place.y);
      partition(first, last, kept().add(card));
    } else {
      followSoon();
    }
    // Row tops on both sides (a card's box stands out of its row).
    const row = Math.floor((place.row * columns) / span);
    const shift =
      list.getBoundingClientRect().top + inset + row * pitch - place.y;
    if (Math.abs(shift) > 0.5) {
      window.scrollBy({ top: shift, behavior: 'instant' });
    }
  });
  sizes.observe(bar);
  sizes.observe(heading);

  /* ---------- Controls ---------- */

  form.addEventListener(
    'input',
    (event) => {
      if (event.target === search) {
        commit({ ...state, q: search.value.trim() }, 'q');
      }
    },
    { signal }
  );

  form.addEventListener(
    'change',
    (event) => {
      const input = event.target as HTMLInputElement;
      if (input.type !== 'radio') {
        return;
      }
      commit({ ...state, [input.name]: input.value }, input.name);
    },
    { signal }
  );

  // Picking an option with a click or Space settles the menu; a set
  // filter's × clears it.
  form.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element;
      const input = target.closest('.xp-menu input');
      input?.closest<HTMLElement>('[popover]')?.hidePopover();
      const unset = target.closest<HTMLElement>('[data-xp-unset]');
      if (unset) {
        const name = unset.dataset.xpUnset as 'year' | 'guest';
        commit({ ...state, [name]: '' }, name);
        unset
          .closest('.xp-filter')
          ?.querySelector<HTMLElement>('.xp-pick')
          ?.focus();
      }
    },
    { signal }
  );

  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      form.querySelector<HTMLElement>('.xp-menu:popover-open')?.hidePopover();
      search.blur();
    },
    { signal }
  );

  const clear = () =>
    commit({ ...DEFAULT_STATE, sort: state.sort, view: state.view }, 'reset');

  form.addEventListener(
    'reset',
    (event) => {
      event.preventDefault();
      clear();
    },
    { signal }
  );
  root
    .querySelector('[data-xp-clear]')!
    .addEventListener('click', clear, { signal });

  // Opening a menu puts you on its current choice.
  for (const menu of form.querySelectorAll<HTMLElement>('.xp-menu')) {
    menu.addEventListener(
      'toggle',
      (event) => {
        if ((event as ToggleEvent).newState === 'open') {
          menu.querySelector<HTMLInputElement>('input:checked')?.focus();
        }
      },
      { signal }
    );
  }

  progressButton.addEventListener(
    'click',
    () => commit({ ...state, progress: !state.progress }, 'progress'),
    { signal }
  );

  root.querySelector('[data-xp-top]')!.addEventListener(
    'click',
    (event) => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion() ? 'auto' : 'smooth'
      });
      // From the keyboard, carry on from the search field.
      if ((event as MouseEvent).detail === 0) {
        search.focus({ preventScroll: true });
      }
    },
    { signal }
  );

  // While the page scrolls the window follows; once it settles, the
  // strip's depth is trimmed to the cells in view.
  let settle = 0;
  addEventListener(
    'scroll',
    () => {
      scrolled = true;
      followSoon();
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        settle = 0;
        deepen(true);
      }, 150);
    },
    { passive: true, signal }
  );
  signal.addEventListener('abort', () => clearTimeout(settle));

  // A card's controls carry a scroll margin that clears the sticky toolbar
  // and the dock (explorer.css). Chromium honours it when focus scrolls a
  // control into view; Firefox doesn't scroll a control that is only partly
  // hidden, so it can sit under the toolbar. Bringing it in here honours the
  // margin everywhere, and where the browser already did nothing moves.
  list.addEventListener(
    'focusin',
    (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('.xp-card :is(a, button)')) {
        target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    },
    { signal }
  );

  list.addEventListener(
    'click',
    (event) => {
      const target = event.target as Element;
      const card = cardOf.get(target.closest('.xp-card')!);
      if (!card) {
        return;
      }
      if (target.closest('.xp-close')) {
        show(null);
        card.art.focus({ preventScroll: true });
      } else if (target.closest('.xp-play [data-static]')) {
        // A resting disc: play its episode (the card then gets the live one).
        playEpisode(playableOf(card.li));
      } else if (target.closest('.xp-queue')) {
        const episode = playableOf(card.li);
        if (queue.value.some((queued) => queued.id === episode.id)) {
          dequeue(episode.id);
          status.textContent = 'Removed from Up next.';
        } else {
          enqueue(episode);
          status.textContent = 'Added to Up next.';
        }
      } else if (target.closest('.xp-art')) {
        show(open === card ? null : card);
      } else if (!target.closest('a, button, .xp-detail') && open !== card) {
        // The rest of a card (a filmstrip cell) opens it too.
        show(card);
      }
    },
    { signal }
  );

  // In the close-up: Escape closes and the arrow keys step through the
  // results as they are shown, filtered and sorted, from anywhere in the
  // archive or the page itself (a click leaves focus on the page). A key
  // another widget took is not ours: one it handled (listened for on the
  // window, so the page's own document listeners go first), one pressed in
  // another part of the page (the sidebar's divider, the player), one typed
  // in a field, or one a menu, sheet or dialog is open to take.
  addEventListener(
    'keydown',
    (event) => {
      const target = event.target as Element;
      if (
        !open ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (target !== document.body &&
          target !== document.documentElement &&
          !root.contains(target)) ||
        target.closest?.('input, textarea, select, [contenteditable]') ||
        document.querySelector(
          "[popover]:not([popover='manual']):popover-open, dialog[open]"
        )
      ) {
        return;
      }
      const card = open;
      if (event.key === 'Escape') {
        show(null);
        card.art.focus({ preventScroll: true });
        return;
      }
      const step = (
        {
          ArrowRight: 1,
          ArrowDown: 1,
          ArrowLeft: -1,
          ArrowUp: -1
        } as Record<string, number>
      )[event.key];
      if (!step || target.closest?.('[data-xp-bar]')) {
        return;
      }
      event.preventDefault();
      const shown = order.filter((other) => !other.li.hidden);
      const next =
        shown[(shown.indexOf(card) + step + shown.length) % shown.length]!;
      const followFocus = card.li.contains(document.activeElement);
      show(next);
      if (followFocus) {
        next.art.focus({ preventScroll: true });
      }
    },
    { signal }
  );

  // Find in page opens a parked block where the match is and scrolls to it;
  // the window then moves there (and closes the block again).
  for (const block of [above, below]) {
    block.addEventListener(
      'beforematch',
      () => requestAnimationFrame(() => follow(true)),
      { signal }
    );
  }

  // Back and forward between explorer states stay on the page; the router
  // only takes over when the page itself changes.
  const path = location.pathname;
  addEventListener(
    'popstate',
    (event) => {
      if (location.pathname !== path) {
        return;
      }
      event.stopImmediatePropagation();
      lastParam = '';
      const next = known(parseState(location.search));
      commit(next, null);
      syncControls(next);
    },
    { capture: true, signal }
  );

  // Arriving with a query: show that cut at once, without motion. A filter
  // the menus don't offer leaves the address as well.
  if (toSearch(parseState(location.search)) !== toSearch(state)) {
    history.replaceState(
      history.state,
      '',
      location.pathname + toSearch(state) + location.hash
    );
  }
  readProgress();
  syncControls(state);
  if (toSearch(state)) {
    render(state);
  }
  delete document.documentElement.dataset.xpPending;

  // Back from an episode (EpisodeList starts the explorer as the page is
  // swapped in, before the morph home is captured): the router restored the
  // scroll the page had when it left, which in the close-up was the strip's.
  // The card for the episode just left (named for the morph) goes back in
  // view, under the toolbar, at its exact place.
  const back = list.querySelector<HTMLElement>('.xp-card[data-vt-named]');
  if (back && !back.hidden && cardOf.has(back)) {
    size();
    placeHome(cardOf.get(back)!);
  }

  document.addEventListener(
    'astro:before-swap',
    () => {
      lifetime.abort();
      watcher.disconnect();
      sizes.disconnect();
      stopHearing();
      stopQueue();
      stopClock();
      stopLive();
      clocked.forEach((el) => delete el.dataset.propsFor);
      unregister();
      swapping.forEach((timer) => clearTimeout(timer));
      clearTimeout(folded);
      clearTimeout(settling);
      cancelAnimationFrame(following);
      starting?.();
    },
    { once: true, signal }
  );
}
