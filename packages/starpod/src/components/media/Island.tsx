import { navigate } from 'astro:transitions/client';
import { computed } from '@preact/signals';
import { createPortal } from 'preact/compat';
import { useLayoutEffect, useRef } from 'preact/hooks';

import { flip } from '../../motion/propflip';
import {
  ArrowOutIcon,
  BackIcon,
  ChevronUpIcon,
  CloseIcon,
  ExpandIcon,
  ForwardIcon,
  MoreIcon,
  NextIcon,
  PipIcon,
  Svg,
  VolumeIcon,
  type IconProps
} from '../icons';
import {
  activeMedium,
  closeMini,
  currentEpisode,
  currentTime,
  dockPicture,
  anchorPositioning,
  homeOnScreen,
  isMuted,
  islandAt,
  islandBack,
  islandHome,
  ISLAND_HOMES,
  mediaDuration,
  miniClosed,
  phoneScreen,
  pictureDocked,
  pipCorner,
  playbackRate,
  playEpisode,
  queue,
  type Corner,
  type IslandHome,
  type PlayableEpisode
} from '../state';
import { formatClock } from '../../utils/playable';
import { mountBoard, nextEpisode, type Board } from './board';
import { enterFullscreen, mediaStation, placeMedia, setRate, skip, startEngine } from './engine';
import MediumSwitch from './MediumSwitch';
import PlayToggle from './PlayToggle';
import Scrubber from './Scrubber';

const RATES = [1, 1.25, 1.5, 1.75, 2, 0.75];
const HOME_NAME: Record<IslandHome, string> = { pill: 'Pill', card: 'Card', dock: 'Dock', rail: 'Rail' };

// Clockwise round the screen, for the keyboard's way of moving the picture.
const NEXT_CORNER: Record<Corner, Corner> = { se: 'sw', sw: 'nw', nw: 'ne', ne: 'se' };
const CORNER_NAME: Record<Corner, string> = {
  se: 'bottom right',
  sw: 'bottom left',
  nw: 'top left',
  ne: 'top right'
};

let board: Board | null = null;
let settling = 0;

/**
 * How the dock lays itself out at a width, widest first: everything; the
 * home control folded into one "Move player" button and its popover; the
 * watch/listen switch down to its icons; speed and mute into the popover;
 * the bars, the switch and the picture button into it too; and the times
 * and Play next as well, the title giving way. The scrubber keeps a real
 * track (240px at least) in every form, and the picture, title, transport
 * and play never leave.
 */
export type DockFit = 'full' | 'move' | 'icon' | 'fold' | 'lean' | 'tight';

/**
 * The room each form needs besides the art, at 1024px and wider: its parts,
 * gaps and padding, and the scrubber at its minimum (measured, with a few
 * pixels to spare). Narrower than all of them, the dock is 'tight'.
 */
const DOCK_ROOM: Array<[DockFit, number]> = [
  ['full', 1370],
  ['move', 1217],
  ['icon', 1136],
  ['fold', 1036],
  ['lean', 822]
];

export function dockFit(width: number, art: number): DockFit {
  return DOCK_ROOM.find(([, room]) => width - art >= room)?.[0] ?? 'tight';
}

/**
 * Re-form the dock for its station's width. The station is where the dock
 * will be, so a journey to it flies straight to its final form, and a width
 * change at rest (the sidebar folding) flips the parts to their new places.
 */
function refit(island: HTMLElement, width: number) {
  const art = island.dataset.medium === 'watch' ? (56 * 16) / 9 : 56;
  const fit = dockFit(width, art);
  if (island.dataset.fit === fit) {
    return;
  }
  const set = () => {
    island.dataset.fit = fit;
    const label = fit === 'move' || fit === 'icon' ? 'Move player' : 'Player options';
    const more = island.querySelector('.island-more-button');
    more?.setAttribute('aria-label', label);
    more?.setAttribute('title', label);
  };
  if (island.dataset.fit && island.dataset.state === 'dock' && !island.hasAttribute('data-moving')) {
    flip([...island.children] as Array<HTMLElement>, set);
  } else {
    set();
  }
}

// The clock's text, bound as signals: a time update rewrites these text nodes
// and the scrubber, not the island.
const elapsed = computed(() => formatClock(currentTime.value));
const remaining = computed(
  () => `-${formatClock(Math.max(0, (mediaDuration.value || currentEpisode.value?.duration || 0) - currentTime.value))}`
);

function LiveScrubber({ episode }: { episode: PlayableEpisode }) {
  return (
    <Scrubber
      duration={mediaDuration.value || episode.duration || 0}
      episode={episode}
      time={currentTime.value}
    />
  );
}

/** Publish the island's home on <html>, for the rail slot and the room to read. */
export function markHome() {
  const root = document.documentElement;
  const island = document.getElementById('player');
  if (currentEpisode.value && island) {
    root.dataset.island = islandAt.value;
  } else {
    delete root.dataset.island;
  }
  syncPage();
}

/** What the open card made inert, to give back exactly that when it closes. */
const held = new Set<HTMLElement>();

/**
 * Hold the page (or let it go) to match the card, but only with the island
 * at rest: making the page inert, or lifting it, restyles the whole page
 * (some 900 elements), which mid-journey cost a frame. The landing calls
 * this again. Until then trapTab() keeps the keyboard in the card.
 */
function syncPage() {
  const island = document.getElementById('player');
  if (island?.hasAttribute('data-moving')) {
    return;
  }
  holdPage(island && islandAt.value === 'card' ? island : null);
}

/**
 * The island's tab stops, in the order Tab visits them: shown, focusable
 * from the keyboard, one per radio group, and not inside the More popover
 * (closed in the card).
 */
function tabStops(island: HTMLElement) {
  return [
    ...island.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]')
  ].filter(
    (el) =>
      el.tabIndex >= 0 &&
      !(el instanceof HTMLInputElement && el.type === 'radio' && !el.checked) &&
      !el.closest('[popover]') &&
      el.checkVisibility?.({ visibilityProperty: true }) !== false
  );
}

/**
 * While the card is open, Tab and Shift+Tab wrap round the card's own stops,
 * so the keyboard never reaches the page under the scrim: before the card
 * lands the page is not inert yet, and even once it is, Chrome still tabs
 * into an inert page's scrollable lists. (aria-modal says the same to
 * assistive technology from the start.)
 */
function trapTab(event: KeyboardEvent) {
  const island = document.getElementById('player');
  if (event.key !== 'Tab' || islandAt.value !== 'card' || !island) {
    return;
  }
  const stops = tabStops(island);
  const at = stops.indexOf(document.activeElement as HTMLElement);
  const wrap = event.shiftKey
    ? at <= 0 && stops.at(-1)
    : (at === -1 || at === stops.length - 1) && stops[0];
  if (wrap) {
    event.preventDefault();
    wrap.focus();
  }
}

/**
 * The card is modal: it all but fills the screen over a scrim, so while it
 * is open everything else on the page is inert (out of the tab order and out
 * of reach of assistive technology; the floating picture's layer too, which
 * still draws the picture in the card). A navigation swaps the page in under
 * an open card, so this runs again after every swap.
 */
/**
 * Focus that reaches the page some other way while the card is open (a
 * browser that tabs only to form fields, say) is brought back into it.
 */
function keepFocusIn(event: FocusEvent) {
  const island = document.getElementById('player');
  const target = event.target;
  if (islandAt.value !== 'card' || !island || !(target instanceof Element) || island.contains(target)) {
    return;
  }
  cardStart(island)?.focus({ preventScroll: true });
}

/** Where focus starts in the card: its close on phones, or else its home control. */
function cardStart(island: HTMLElement) {
  return island.querySelector<HTMLElement>(
    phoneScreen.value ? '.island-close button' : '.island-station input[value="card"]'
  );
}

function holdPage(card: HTMLElement | null) {
  if (card) {
    for (const el of document.body.children) {
      if (el instanceof HTMLElement && !el.contains(card) && !el.hasAttribute('inert')) {
        el.setAttribute('inert', '');
        held.add(el);
      }
    }
    return;
  }
  held.forEach((el) => el.removeAttribute('inert'));
  held.clear();
}

/**
 * Focus a control of the island's, or its title (every home has one) if
 * that control is not showing in the current home.
 */
function focusIsland(selector: string) {
  const island = document.getElementById('player');
  const wanted = island?.querySelector<HTMLElement>(selector);
  const target = wanted?.checkVisibility?.({ visibilityProperty: true })
    ? wanted
    : island?.querySelector<HTMLElement>('.island-name');
  target?.focus({ preventScroll: true });
}

/**
 * Send the island to a home. One attribute re-homes it: the island is
 * `data-⚓️-fill` on a station, so changing `data-⚓️-to` makes its own size and
 * place tween (x and y each on their own spring). Its grid re-templates per
 * `data-state`, and every part is a PropFLIP leaf: it inverts against the
 * island at frame zero and rides home on a stagger the parts take from their
 * place in the tree. Interruptible: flip() starts from the pixels on screen.
 */
export function go(home: IslandHome) {
  const island = document.getElementById('player');
  const to = homeOnScreen(home);
  if (!island || island.dataset.state === to) {
    islandHome.value = home;
    return;
  }
  // The More popover belongs to the dock; it closes as the island leaves.
  const pop = island.querySelector<HTMLElement>('.island-more-pop');
  if (pop?.matches(':popover-open')) {
    pop.hidePopover();
  }
  // WebKit tweens the island's anchor() insets when its station changes, but
  // not a size given as anchor-size(): the box took its new size at once and
  // parts flying in from outside it were clipped out of sight. There the
  // journey's size is given in pixels, from where it is to where it is going,
  // and handed back to the anchor on landing. (The rail's slot grows as the
  // island arrives, so that journey keeps the old way.)
  const station =
    to !== 'rail' &&
    typeof CSS?.supports === 'function' &&
    CSS.supports('anchor-name: --a') &&
    !CSS.supports('width: attr(x type(<length>))')
      ? document.querySelector<HTMLElement>(`.island-home[data-home='${to}']`)
      : null;
  if (station) {
    const now = island.getBoundingClientRect();
    island.style.width = `${now.width}px`;
    island.style.height = `${now.height}px`;
  } else {
    island.style.removeProperty('width');
    island.style.removeProperty('height');
  }
  // Reads happen where flip() has just measured (style and layout clean) and
  // writes inside its update, so go() forces no layout of its own (bar
  // WebKit's one read of where the island is going).
  let slomo = 0;
  const moves = flip([...island.children] as Array<HTMLElement>, () => {
    slomo = parseFloat(getComputedStyle(island).getPropertyValue('--slomo')) || 0;
    // The cascade runs from the far end on the way back to a smaller home.
    island.dataset.going = ISLAND_HOMES.indexOf(to) === 1 ? 'out' : 'in';
    // Its own tween runs only for the journey (and the rail slot's growth);
    // at rest it follows its station exactly. The longest leg is 0.8s.
    island.dataset.moving = '';
    island.dataset.state = to;
    island.setAttribute('data-⚓️-to', `--home-${to}`);
    document.documentElement.dataset.island = to;
    if (station) {
      const end = station.getBoundingClientRect();
      island.style.width = `${end.width}px`;
      island.style.height = `${end.height}px`;
    }
  });
  window.clearTimeout(settling);
  settling = window.setTimeout(() => {
    delete island.dataset.moving;
    island.style.removeProperty('width');
    island.style.removeProperty('height');
    syncPage();
  }, 900 * slomo + 50);
  // Parts at rest take their delay from CSS (sibling-index()); parts already
  // in flight keep the zero flip() gave them, so an interrupt never freezes.
  for (const move of moves) {
    if (!move.moving) {
      move.el.style.removeProperty('--flip-delay');
    }
  }
  islandHome.value = home;
  keepFocus(island, to);
}

/**
 * Focus moves with the choice, never into a part the new home has parked
 * (hidden): into the card it goes to the home control, so the next arrow
 * chooses again; anywhere else it stays on its control if that control still
 * shows, or else lands on the island's title, which every home has.
 */
function keepFocus(island: HTMLElement, to: IslandHome) {
  const focused = document.activeElement;
  if (!(focused instanceof HTMLElement) || !island.contains(focused)) {
    // The card is a dialog: opened from anywhere, focus goes into it, and
    // goes back to what opened it when it closes.
    if (to === 'card') {
      opener = focused instanceof HTMLElement && focused !== document.body ? focused : null;
      cardStart(island)?.focus({ preventScroll: true });
    }
    return;
  }
  if (to !== 'card' && opener?.isConnected) {
    const back = opener;
    opener = null;
    back.focus({ preventScroll: true });
    return;
  }
  opener = to === 'card' ? opener : null;
  const part = focused.closest<HTMLElement>('#player > *');
  const target =
    to === 'card' && !focused.closest('.island-queue')
      ? cardStart(island)
      : part && getComputedStyle(part).position === 'absolute'
        ? island.querySelector<HTMLElement>('.island-name')
        : null;
  target?.focus({ preventScroll: true });
}

/** What had focus outside the player when the card opened, for its close. */
let opener: HTMLElement | null = null;

/** The island's body toggles the card and the home it came from. */
export function toggleCard() {
  go(islandAt.value === 'card' ? islandBack.value : 'card');
}

/** The floating picture's own bar: what it is, where it goes, and how to leave it. */
function PipBar({ episode, href }: { episode: PlayableEpisode; href: string }) {
  const watching = activeMedium.value === 'watch';
  const next = NEXT_CORNER[pipCorner.value];
  // On phones closing it only puts the picture back in the player (closeMini).
  const close = phoneScreen.value
    ? watching
      ? 'Put the video back in the player'
      : 'Put the artwork back in the player'
    : watching
      ? 'Close video'
      : 'Close artwork';
  return (
    <div class="pip-bar">
      <div class="pip-bar-in relative box-border flex h-full items-center gap-0.5 rounded-full bg-surface py-0 pr-1 pl-3 shadow-soft">
        <a class="pip-title min-w-0 flex-1 truncate text-xs font-demibold text-ink no-underline decoration-auto hover:underline" href={href} title={episode.title}>
          {episode.title}
        </a>
        <button
          aria-label={`Move the picture to the ${CORNER_NAME[next]} corner`}
          class="mini-button"
          onClick={() => (pipCorner.value = next)}
          title={`Move to the ${CORNER_NAME[next]} corner`}
          type="button"
        >
          <PipIcon corner={next} size={16} />
        </button>
        {anchorPositioning.value && (
          <button
            aria-label="Open the now-playing card"
            class="mini-button"
            onClick={() => go('card')}
            title="Open the now-playing card"
            type="button"
          >
            <ChevronUpIcon size={16} />
          </button>
        )}
        {watching && (
          <button
            aria-label="Fullscreen"
            class="mini-button"
            data-shortcut="fullscreen"
            onClick={enterFullscreen}
            title="Fullscreen (F)"
            type="button"
          >
            <ExpandIcon size={15} />
          </button>
        )}
        <button
          aria-label={close}
          class="mini-button"
          onClick={() => {
            // The bar goes with the picture: focus moves to the island first.
            focusIsland('.player-pip');
            closeMini();
          }}
          title={close}
          type="button"
        >
          <CloseIcon size={15} />
        </button>
        <i aria-hidden="true" class="pip-bar-light absolute right-3 bottom-[3px] left-3" data-props-for="media-clock" />
      </div>
    </div>
  );
}

/**
 * A segmented radio with one indicator, anchored to the checked option, that
 * glides. The More popover holds a second one, its checked option filled.
 */
function Stations({ popover = false }: { popover?: boolean }) {
  const at = islandAt.value;
  // Without anchor positioning there is only the dock: nothing to choose.
  if (!anchorPositioning.value) {
    return null;
  }
  return (
    <div
      aria-label="Player home"
      class={`island-station relative inline-flex w-max cursor-default border border-line p-[3px] [--area:station] ${popover ? 'rounded-full' : 'PropFLIP [--r:999px]'}`}
      role="radiogroup"
      {...(popover ? {} : { 'data-⚓️-scope-name': '--home-on' })}
    >
      {!popover && (
        <i
          aria-hidden="true"
          class="island-station-on rounded-full bg-ink"
          {...{ 'data-⚓️-to': '--home-on', 'data-⚓️-fill': '', 'data-⚓️-transition': 'glide' }}
        />
      )}
      {ISLAND_HOMES.map((home, i) => (
        <label
          class={`relative z-1 cursor-pointer rounded-full px-3 py-1.5 font-(family-name:--font-ui) text-xs leading-none font-semibold normal-nums whitespace-nowrap text-muted [transition:color_var(--quick)] has-checked:text-on-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${popover ? 'has-checked:bg-ink' : 'has-checked:anchor-name-[--home-on]'}`}
          data-home={home}
          key={home}
        >
          <input
            aria-keyshortcuts={String(i + 1)}
            checked={at === home}
            class="pointer-events-none absolute opacity-0"
            name={popover ? 'island-home-more' : 'island-home'}
            onChange={() => go(home)}
            type="radio"
            value={home}
          />
          {HOME_NAME[home]}
        </label>
      ))}
    </div>
  );
}

function SpeedButton() {
  return (
    <button
      aria-label={`Playback speed ${playbackRate.value}×, change`}
      class="text-button island-speed"
      data-props-for="pointer-local"
      onClick={() => setRate(RATES[(RATES.indexOf(playbackRate.value) + 1) % RATES.length]!)}
      type="button"
    >
      {playbackRate.value}×
    </button>
  );
}

function MuteButton() {
  return (
    <button
      aria-keyshortcuts="M"
      aria-label={isMuted.value ? 'Unmute' : 'Mute'}
      aria-pressed={isMuted.value}
      class="icon-button island-mute"
      data-shortcut="mute"
      onClick={() => (isMuted.value = !isMuted.value)}
      title={`${isMuted.value ? 'Unmute' : 'Mute'} (M)`}
      type="button"
    >
      <VolumeIcon muted={isMuted.value} size={20} />
    </button>
  );
}

function PipButton({ docked }: { docked: boolean }) {
  return (
    <button
      aria-label="Picture-in-picture"
      aria-pressed={!docked}
      class="icon-button player-pip"
      onClick={() => {
        miniClosed.value = false;
        dockPicture(!docked);
      }}
      title={docked ? 'Float the picture' : 'Keep the picture in the player'}
      type="button"
    >
      <PipIcon corner={pipCorner.value} size={20} />
    </button>
  );
}

/** The player's homes: a window with the dock along its foot. */
const MoveIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="15" rx="2.5" width="17" x="3.5" y="4.5" />
    <path d="M7.5 15.5h9" />
  </Svg>
);

/**
 * What a narrow dock does not show, one button away: the home control
 * ("Move player"), and as the dock narrows, speed and mute, the switch and
 * the picture button, the times and Play next. Anchored to its button, it
 * opens above the dock, or below where there is no room, its caret turning
 * with it. Which rows show follows the dock's form (data-fit).
 */
function More({ docked, episode, following }: { docked: boolean; episode: PlayableEpisode; following?: PlayableEpisode }) {
  const next = skipLabel(following);
  return (
    <div class="island-more PropFLIP">
      <button
        aria-label="Move player"
        class="icon-button island-more-button anchor-name-[--island-more]"
        popovertarget="island-more"
        title="Move player"
        type="button"
      >
        <MoveIcon class="island-more-move" size={20} />
        <MoreIcon class="island-more-dots" size={20} />
      </button>
      <div class="island-more-pop" id="island-more" popover="auto">
        <div class="island-more-in relative grid justify-items-start gap-3 rounded-tray border border-(--hairline) bg-surface p-3 text-ink shadow-float">
          <p class="island-more-times m-0 ml-1 gap-2 text-xs text-muted tabular-nums">
            <span>{elapsed}</span>
            <span>{remaining}</span>
          </p>
          <Stations popover />
          <div class="island-more-row island-more-sound items-center gap-1.5">
            <SpeedButton />
            <MuteButton />
          </div>
          <div class="island-more-row island-more-picture items-center gap-1.5">
            {episode.video && <MediumSwitch compact />}
            <PipButton docked={docked} />
          </div>
          <button class="text-button island-more-next max-w-70 items-center gap-2" disabled={!following} onClick={() => following && playEpisode(following)} type="button">
            <NextIcon size={18} />
            <span class="truncate">{next}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * What the skip button says: Up next's first is what plays next (and plays on
 * its own when this one ends); without one, the shelf's first is only where
 * a skip goes.
 */
function skipLabel(following?: PlayableEpisode) {
  if (!following) {
    return 'Nothing to play next';
  }
  return queue.value[0]?.id === following.id ? `Play next: ${following.title}` : `Skip to ${following.title}`;
}

/** The card's close, pointing down to where it goes. */
const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
);

/**
 * Phones: the card follows a finger down from its top strip (the grabber's),
 * and goes home when let go a third of the way down or flicked, springing
 * back otherwise; a tap on the strip closes it too. The island rides its own
 * translate, so letting go anywhere continues from the pixels it is on.
 */
function swipeToClose(strip: HTMLElement) {
  let from: { y: number; t: number; id: number } | null = null;
  let dy = 0;
  const island = () => document.getElementById('player');
  const down = (event: PointerEvent) => {
    if (event.button || islandAt.value !== 'card') {
      return;
    }
    from = { y: event.clientY, t: event.timeStamp, id: event.pointerId };
    dy = 0;
    strip.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    const el = island();
    if (!from || event.pointerId !== from.id || !el) {
      return;
    }
    dy = Math.max(0, event.clientY - from.y);
    el.style.transition = 'none';
    el.style.translate = `0 ${dy}px`;
  };
  const up = (event: PointerEvent) => {
    const el = island();
    if (!from || event.pointerId !== from.id || !el) {
      return;
    }
    const speed = dy / Math.max(1, event.timeStamp - from.t);
    from = null;
    el.style.removeProperty('transition');
    if (event.type === 'pointerup' && (dy < 6 || dy > innerHeight / 3 || speed > 0.6)) {
      go(islandBack.value);
    }
    el.style.removeProperty('translate');
  };
  strip.addEventListener('pointerdown', down);
  strip.addEventListener('pointermove', move);
  strip.addEventListener('pointerup', up);
  strip.addEventListener('pointercancel', up);
  return () => {
    strip.removeEventListener('pointerdown', down);
    strip.removeEventListener('pointermove', move);
    strip.removeEventListener('pointerup', up);
    strip.removeEventListener('pointercancel', up);
    // Closed mid-swipe (Escape under the finger): the card lets go of it.
    if (from) {
      if (strip.hasPointerCapture(from.id)) {
        strip.releasePointerCapture(from.id);
      }
      from = null;
      const el = island();
      el?.style.removeProperty('transition');
      el?.style.removeProperty('translate');
    }
  };
}

type Watcher = { onclose: (() => void) | null; destroy: () => void };
const CloseWatcherType = (globalThis as { CloseWatcher?: new () => Watcher }).CloseWatcher;

/**
 * Phones: the system's back gesture closes the card (a close watcher, where
 * there is one: Android). It adds no history entry, so back and forward
 * still move between pages exactly as before.
 */
function closeOnBack() {
  if (!CloseWatcherType) {
    return () => {};
  }
  const watcher = new CloseWatcherType();
  watcher.onclose = () => {
    if (islandAt.value === 'card') {
      go(islandBack.value);
    }
  };
  return () => watcher.destroy();
}

const typing = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) &&
  !(target instanceof HTMLInputElement && (target.type === 'radio' || target.type === 'range'));

/**
 * The player: one island with four homes (pill, dock, card, rail), the
 * floating picture's bar, and the scrim behind the card. Lives in the
 * layout's dock block and survives client-side navigation.
 */
export default function Island() {
  // Layout effects throughout the player: WebKit runs passive ones only after
  // a painted frame, which a page sitting still may not produce, and these
  // start the engine, register keys and move UI in answer to the visitor.
  useLayoutEffect(() => {
    startEngine();
  }, []);

  const episode = currentEpisode.value;
  const hasEpisode = Boolean(episode);
  const queueHost = useRef<HTMLDivElement>(null);

  // The art part is a home for the picture: once it exists, re-home it; and
  // tell the page where the island is.
  useLayoutEffect(() => {
    markHome();
    if (hasEpisode) {
      placeMedia();
    }
  }, [hasEpisode]);
  useLayoutEffect(markHome, [islandAt.value]);
  // A navigation swaps in the new page's <html> attributes.
  useLayoutEffect(() => {
    document.addEventListener('astro:after-swap', markHome);
    return () => document.removeEventListener('astro:after-swap', markHome);
  }, []);

  // The queue board is drawn imperatively (its covers never move in the DOM).
  useLayoutEffect(() => {
    if (!queueHost.current) {
      return;
    }
    board = mountBoard(queueHost.current);
    return () => {
      board?.stop();
      board = null;
    };
  }, [hasEpisode]);

  // Tapping the floating picture opens its episode, where it returns to the stage.
  const target = episode ? `/${episode.slug ?? episode.episodeNumber}` : null;
  useLayoutEffect(() => {
    const picture = document.querySelector<HTMLElement>('[data-player-media] > *');
    if (!picture || !target) {
      return;
    }
    const open = () => mediaStation.value === 'corner' && void navigate(target);
    picture.addEventListener('click', open);
    return () => picture.removeEventListener('click', open);
  }, [target]);

  // The dock re-forms by its station's width (and the art's, which grows
  // while watching).
  const medium = activeMedium.value;
  useLayoutEffect(() => {
    const island = document.getElementById('player');
    const station = document.querySelector(".island-home[data-home='dock']");
    if (!island || !station) {
      return;
    }
    refit(island, station.getBoundingClientRect().width);
    const watch = new ResizeObserver(([entry]) => {
      refit(island, entry!.borderBoxSize?.[0]?.inlineSize ?? entry!.contentRect.width);
    });
    watch.observe(station);
    return () => watch.disconnect();
  }, [hasEpisode, medium]);

  // 1 to 4 choose a home, as in the demo; Escape closes the card.
  useLayoutEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!currentEpisode.value || event.metaKey || event.ctrlKey || event.altKey || typing(event.target)) {
        return;
      }
      const home = ISLAND_HOMES[Number(event.key) - 1];
      if (home && homeOnScreen(home) === home) {
        go(home);
      } else if (event.key === 'Escape' && islandAt.value === 'card') {
        go(islandBack.value);
      } else {
        return;
      }
      // Handled here, so nothing else acts on it (the explorer's close-up
      // behind the card, say): listened for first, on the window's capture.
      event.preventDefault();
      event.stopPropagation();
    };
    addEventListener('keydown', onKey, true);
    addEventListener('keydown', trapTab, true);
    document.addEventListener('focusin', keepFocusIn, true);
    return () => {
      removeEventListener('keydown', onKey, true);
      removeEventListener('keydown', trapTab, true);
      document.removeEventListener('focusin', keepFocusIn, true);
    };
  }, []);

  // Phones: the card's grabber strip and the back gesture close it.
  const grab = useRef<HTMLDivElement>(null);
  const phone = phoneScreen.value;
  const cardOpen = islandAt.value === 'card';
  useLayoutEffect(() => {
    if (!cardOpen || !phone || !grab.current) {
      return;
    }
    const stops = [swipeToClose(grab.current), closeOnBack()];
    return () => stops.forEach((stop) => stop());
  }, [cardOpen, phone, hasEpisode]);

  if (!episode) {
    return null;
  }

  const href = `/${episode.slug ?? episode.episodeNumber}`;
  const at = islandAt.value;
  const docked = miniClosed.value || pictureDocked.value;
  const floating = mediaStation.value === 'corner' && !docked;
  const following = nextEpisode();
  const watching = activeMedium.value === 'watch';
  const name = (
    <>
      <b class="truncate font-(family-name:--font-display) text-[length:var(--title-size,14px)] leading-[1.15] font-demibold tracking-snug normal-nums">
        {episode.title}
      </b>
      <span class="truncate font-(family-name:--font-ui) text-xs leading-tight font-medium text-muted tabular-nums">
        {episode.episodeNumber !== 'Bonus' ? `Ep ${episode.episodeNumber}` : 'Bonus'}
        {' · '}
        {watching ? 'Watching' : 'Listening'}
      </span>
    </>
  );

  // The bar is anchored to the picture, so it has to come after it.
  const barHost = document.querySelector('[data-pip-bar-host]');
  const bar = floating && at !== 'card' && <PipBar episode={episode} href={href} />;

  // Clicking the island's body (not one of its controls) opens or closes the card.
  const onBody = (event: MouseEvent) => {
    const hit = event.target as Element;
    if (!hit.closest('button, a, input, label, select, .island-scrub, .island-queue, .island-station, .island-more, .island-grab')) {
      toggleCard();
    }
  };

  return (
    <>
      {barHost ? createPortal(bar, barHost) : bar}
      <div
        aria-hidden="true"
        class="player-scrim invisible fixed inset-0 z-44 bg-media-shade/50 opacity-0 [transition:opacity_calc(0.4s*var(--slomo))_var(--ease-out),visibility_0s_calc(0.4s*var(--slomo))]"
        onClick={() => go(islandBack.value)} />
      <section
        aria-label={at === 'card' ? `Now playing: ${episode.title}` : 'Player'}
        aria-modal={at === 'card' ? 'true' : undefined}
        class="island dock-controls pointer-events-auto z-45 grid cursor-pointer place-content-start items-center overflow-clip rounded-(--r) bg-[color-mix(in_oklch,var(--live-img-accent,transparent)_16%,color-mix(in_oklch,var(--surface)_80%,transparent))] text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--ink)_11%,transparent),0_30px_60px_-30px_color-mix(in_oklch,var(--media-shade)_60%,transparent)] backdrop-blur-haze backdrop-saturate-150 vt-name-[player-island] [position-visibility:always]"
        data-medium={activeMedium.value}
        data-state={at}
        id="player"
        onClick={onBody}
        role={at === 'card' ? 'dialog' : undefined}
        tabIndex={-1}
        {...{ 'data-⚓️-to': `--home-${at}`, 'data-⚓️-fill': '' }}
      >
        {/* Phones: the card's way out, a grabber strip to swipe it down by and
            a close, standing in for the home control (phones offer only the
            dock and the card). Other screens never render them. */}
        {phone && (
          <div aria-hidden="true" class="island-grab hidden" ref={grab}>
            <i class="h-[5px] w-10 rounded-full bg-ink/28" />
          </div>
        )}
        {phone && (
          <div class="island-close PropFLIP hidden">
            <button
              aria-label="Close the now-playing card"
              class="icon-button"
              onClick={() => go(islandBack.value)}
              title="Close"
              type="button"
            >
              <ChevronDownIcon size={24} />
            </button>
          </div>
        )}

        <div
          class="island-art PropFLIP fix-kids relative h-(--art-h) w-(--art-w) overflow-clip bg-media-ground [--area:art] [--r:var(--r-thumb)] data-hot:outline-2 data-hot:outline-offset-2 data-hot:outline-accent"
          data-pip-zone="dock"
        >
          <div class="absolute inset-0">
            {/* The artwork's palette, for the whole page to take its accent
                from (--live-img, --live-img-accent, … on <html>; once per episode). */}
            {episode.image && (
              <img
                alt=""
                class="absolute inset-0 block size-full object-cover"
                crossOrigin="anonymous"
                data-props-for="img-color"
                data-props-to="html"
                height={56}
                src={episode.image}
                width={56}
              />
            )}
            <div class="player-cell-media" data-media-cell />
          </div>
        </div>

        <div class="island-title PropFLIP grid w-(--title-w,170px) min-w-0 content-center gap-1.5 [--area:title]">
          {anchorPositioning.value ? (
            <button
              aria-controls="player"
              aria-expanded={at === 'card'}
              aria-label={`${episode.title}. ${at === 'card' ? 'Close' : 'Open'} the now-playing card`}
              class="island-name grid min-w-0 cursor-pointer gap-1 border-0 bg-transparent p-0 text-start text-inherit [font:inherit] focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              onClick={toggleCard}
              type="button"
            >
              {name}
            </button>
          ) : (
            // No card to open without anchor positioning: the name goes to its episode.
            <a class="island-name grid min-w-0 cursor-pointer gap-1 border-0 bg-transparent p-0 text-start text-inherit [font:inherit] focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href={href}>
              {name}
            </a>
          )}
          <a
            class="island-open hidden w-max items-center gap-1.5 text-sm font-semibold text-muted no-underline decoration-auto [transition:color_var(--quick)] hover:text-ink"
            href={href}
          >
            Open the episode
            <ArrowOutIcon size={14} />
          </a>
          <i aria-hidden="true" class="island-light" data-props-for="media-clock" />
        </div>

        <div aria-hidden="true" class="island-eq PropFLIP flex h-4 w-4.5 items-end gap-[3px] [--area:eq]">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div class="island-scrub PropFLIP flex min-w-0 items-center gap-2 [--area:scrub]" data-props-for="media-clock">
          <span class="dock-time block w-[6.5ch] flex-none text-center text-xs tabular-nums text-muted">
            <span class="block h-lh whitespace-nowrap contain-strict">{elapsed}</span>
          </span>
          <span class="island-track relative block min-w-0 flex-1">
            <LiveScrubber episode={episode} />
          </span>
          <span class="dock-time block w-[6.5ch] flex-none text-center text-xs tabular-nums text-muted">
            <span class="block h-lh whitespace-nowrap contain-strict">{remaining}</span>
          </span>
        </div>

        {/* Each control sits in its own part: the part flies, the control
            inside keeps its own press and hover transitions. */}
        <div class="island-prev PropFLIP grid size-[var(--key,40px)] place-items-center [--area:prev]">
          <button
            aria-keyshortcuts="J"
            aria-label="Back 15 seconds"
            class="icon-button"
            data-shortcut="back"
            onClick={() => skip(-15)}
            title="Back 15 seconds (J)"
            type="button"
          >
            <BackIcon size={22} />
          </button>
        </div>
        <div class="island-play PropFLIP grid size-[var(--play,40px)] place-items-center [--area:play] [--key:40px]">
          <PlayToggle class="dock-play" shortcut size={20} />
        </div>
        <div class="island-next PropFLIP grid size-[var(--key,40px)] place-items-center [--area:next]">
          <button
            aria-keyshortcuts="L"
            aria-label="Forward 30 seconds"
            class="icon-button"
            data-shortcut="forward"
            onClick={() => skip(30)}
            title="Forward 30 seconds (L)"
            type="button"
          >
            <ForwardIcon size={22} />
          </button>
        </div>
        <div class="island-skip PropFLIP grid size-[var(--key,40px)] place-items-center [--area:skip]">
          <button
            aria-label={skipLabel(following)}
            class="icon-button"
            disabled={!following}
            onClick={() => following && playEpisode(following)}
            title={skipLabel(following)}
            type="button"
          >
            <NextIcon size={20} />
          </button>
        </div>

        <div class="island-tools PropFLIP flex w-max items-center gap-1.5 [--area:tools]">
          {episode.video && <MediumSwitch compact shortcut />}
          <SpeedButton />
          <MuteButton />
          <PipButton docked={docked} />
        </div>

        <Stations />

        <More docked={docked} episode={episode} following={following} />

        <div class="island-queue PropFLIP pointer-events-none relative z-1 [--area:queue]" ref={queueHost} {...{ 'data-⚓️-scope': 'all' }} />
      </section>
    </>
  );
}
