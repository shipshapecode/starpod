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
  isMuted,
  islandAt,
  islandBack,
  islandHome,
  ISLAND_HOMES,
  mediaDuration,
  miniClosed,
  pipCorner,
  pipDocked,
  playbackRate,
  playEpisode,
  queue,
  wideScreen,
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
  island.querySelector<HTMLElement>('.island-station input:checked')?.focus({ preventScroll: true });
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
  const to: IslandHome = home === 'rail' && !wideScreen.value ? 'dock' : home;
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
    // The card is a dialog: opened from anywhere, focus goes into it.
    if (to === 'card') {
      island.querySelector<HTMLElement>('.island-station input[value="card"]')?.focus({ preventScroll: true });
    }
    return;
  }
  const part = focused.closest<HTMLElement>('#player > *');
  const target =
    to === 'card' && !focused.closest('.island-queue')
      ? island.querySelector<HTMLElement>('.island-station input[value="card"]')
      : part && getComputedStyle(part).position === 'absolute'
        ? island.querySelector<HTMLElement>('.island-name')
        : null;
  target?.focus({ preventScroll: true });
}

/** The island's body toggles the card and the home it came from. */
export function toggleCard() {
  go(islandAt.value === 'card' ? islandBack.value : 'card');
}

/** The floating picture's own bar: what it is, where it goes, and how to leave it. */
function PipBar({ episode, href }: { episode: PlayableEpisode; href: string }) {
  const watching = activeMedium.value === 'watch';
  const next = NEXT_CORNER[pipCorner.value];
  return (
    <div class="pip-bar">
      <div class="pip-bar-in">
        <a class="pip-title" href={href} title={episode.title}>
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
        <button
          aria-label="Open the now-playing card"
          class="mini-button"
          onClick={() => go('card')}
          title="Open the now-playing card"
          type="button"
        >
          <ChevronUpIcon size={16} />
        </button>
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
          aria-label={watching ? 'Close video' : 'Close artwork'}
          class="mini-button"
          onClick={() => {
            // The bar goes with the picture: focus moves to the island first.
            focusIsland('.player-pip');
            closeMini();
          }}
          title={watching ? 'Close video' : 'Close artwork'}
          type="button"
        >
          <CloseIcon size={15} />
        </button>
        <i aria-hidden="true" class="pip-bar-light" data-props-for="media-clock" />
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
  return (
    <div
      aria-label="Player home"
      class={popover ? 'island-station' : 'island-station PropFLIP'}
      role="radiogroup"
      {...(popover ? {} : { 'data-⚓️-scope-name': '--home-on' })}
    >
      {!popover && (
        <i
          aria-hidden="true"
          class="island-station-on"
          {...{ 'data-⚓️-to': '--home-on', 'data-⚓️-fill': '', 'data-⚓️-transition': 'glide' }}
        />
      )}
      {ISLAND_HOMES.map((home, i) => (
        <label data-home={home} key={home}>
          <input
            aria-keyshortcuts={String(i + 1)}
            checked={at === home}
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
        class="icon-button island-more-button"
        popovertarget="island-more"
        title="Move player"
        type="button"
      >
        <MoveIcon class="island-more-move" size={20} />
        <MoreIcon class="island-more-dots" size={20} />
      </button>
      <div class="island-more-pop" id="island-more" popover="auto">
        <div class="island-more-in">
          <p class="island-more-times">
            <span>{elapsed}</span>
            <span>{remaining}</span>
          </p>
          <Stations popover />
          <div class="island-more-row island-more-sound">
            <SpeedButton />
            <MuteButton />
          </div>
          <div class="island-more-row island-more-picture">
            {episode.video && <MediumSwitch compact />}
            <PipButton docked={docked} />
          </div>
          <button class="text-button island-more-next" disabled={!following} onClick={() => following && playEpisode(following)} type="button">
            <NextIcon size={18} />
            <span>{next}</span>
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
      if (home && (home !== 'rail' || wideScreen.value)) {
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

  if (!episode) {
    return null;
  }

  const href = `/${episode.slug ?? episode.episodeNumber}`;
  const at = islandAt.value;
  const docked = miniClosed.value || pipDocked.value[activeMedium.value];
  const floating = mediaStation.value === 'corner' && !docked;
  const following = nextEpisode();
  const watching = activeMedium.value === 'watch';

  // The bar is anchored to the picture, so it has to come after it.
  const barHost = document.querySelector('[data-pip-bar-host]');
  const bar = floating && at !== 'card' && <PipBar episode={episode} href={href} />;

  // Clicking the island's body (not one of its controls) opens or closes the card.
  const onBody = (event: MouseEvent) => {
    const hit = event.target as Element;
    if (!hit.closest('button, a, input, label, select, .island-scrub, .island-queue, .island-station, .island-more')) {
      toggleCard();
    }
  };

  return (
    <>
      {barHost ? createPortal(bar, barHost) : bar}
      <div aria-hidden="true" class="player-scrim" onClick={() => go(islandBack.value)} />
      <section
        aria-label={at === 'card' ? `Now playing: ${episode.title}` : 'Player'}
        aria-modal={at === 'card' ? 'true' : undefined}
        class="island dock-controls"
        data-medium={activeMedium.value}
        data-state={at}
        id="player"
        onClick={onBody}
        role={at === 'card' ? 'dialog' : undefined}
        tabIndex={-1}
        {...{ 'data-⚓️-to': `--home-${at}`, 'data-⚓️-fill': '' }}
      >
        <div class="island-art PropFLIP fix-kids" data-pip-zone="dock">
          <div class="island-art-in">
            {/* The artwork's palette, for the whole page to take its accent
                from (--live-img, --live-img-accent, … on <html>; once per episode). */}
            {episode.image && (
              <img
                alt=""
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

        <div class="island-title PropFLIP">
          <button
            aria-controls="player"
            aria-expanded={at === 'card'}
            aria-label={`${episode.title}. ${at === 'card' ? 'Close' : 'Open'} the now-playing card`}
            class="island-name"
            onClick={toggleCard}
            type="button"
          >
            <b>{episode.title}</b>
            <span>
              {episode.episodeNumber !== 'Bonus' ? `Ep ${episode.episodeNumber}` : 'Bonus'}
              {' · '}
              {watching ? 'Watching' : 'Listening'}
            </span>
          </button>
          <a class="island-open" href={href}>
            Open the episode
            <ArrowOutIcon size={14} />
          </a>
          <i aria-hidden="true" class="island-light" data-props-for="media-clock" />
        </div>

        <div aria-hidden="true" class="island-eq PropFLIP">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div class="island-scrub PropFLIP" data-props-for="media-clock">
          <span class="dock-time">
            <span>{elapsed}</span>
          </span>
          <span class="island-track">
            <LiveScrubber episode={episode} />
          </span>
          <span class="dock-time">
            <span>{remaining}</span>
          </span>
        </div>

        {/* Each control sits in its own part: the part flies, the control
            inside keeps its own press and hover transitions. */}
        <div class="island-prev PropFLIP">
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
        <div class="island-play PropFLIP">
          <PlayToggle class="dock-play" shortcut size={20} />
        </div>
        <div class="island-next PropFLIP">
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
        <div class="island-skip PropFLIP">
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

        <div class="island-tools PropFLIP">
          {episode.video && <MediumSwitch compact shortcut />}
          <SpeedButton />
          <MuteButton />
          <PipButton docked={docked} />
        </div>

        <Stations />

        <More docked={docked} episode={episode} following={following} />

        <div class="island-queue PropFLIP" ref={queueHost} {...{ 'data-⚓️-scope': 'all' }} />
      </section>
    </>
  );
}
