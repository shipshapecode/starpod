/**
 * The media engine: one <video> element for the whole visit.
 *
 * It plays the episode's HLS video when the visitor is watching and the MP3
 * enclosure when they are listening (a <video> element plays audio just as
 * well, and keeps one element to persist).
 *
 * The element has two homes in the page flow, an episode page's stage slot
 * (`[data-media-slot]`) and the player's cell (`[data-media-cell]`, docked in
 * the bar or large in the expanded player), and one in the air: the floating
 * box (`[data-player-media]`), which sits in a corner as picture-in-picture
 * and carries every journey between places. The box is anchored to wherever
 * it is going and flies there with PropFLIP from the pixels the picture was
 * on, so a journey can turn around mid-flight. Moving a media element in the
 * DOM does not interrupt playback, and the View Transitions API morphs it on
 * navigation because it carries a stable `view-transition-name`.
 *
 * Client-only. Import it from islands, never from server code.
 */
import { effect, signal } from '@preact/signals';
import type Hls from 'hls.js';

import { flipFrom, registerFlipTargets } from '../../motion/propflip';
import {
  activeMedium,
  currentEpisode,
  currentTime,
  isBuffering,
  isMuted,
  isPlaying,
  mediaDuration,
  mediaHost,
  miniClosed,
  phoneScreen,
  pictureDocked,
  pipCorner,
  playbackRate,
  playerExpanded,
  playNext,
  seekTo,
  type Medium,
  type PlayableEpisode
} from '../state';
import { POSITION_PREFIX, readPosition, resumePoint } from './position';
import { startPip } from './pip';
import { publish } from './publish';
import { installShortcuts } from './shortcuts';
import { startStageLight } from './stage-light';

let element: HTMLVideoElement | null = null;
/** The playhead last saved, for the episode that owns it. */
let lastSaved = 0;

/**
 * True while the current episode's stage is scrolled mostly out of view. A
 * playing episode then leaves the stage for its picture-in-picture place and
 * comes back when the visitor scrolls up again.
 */
export const stageOutOfView = signal(false);

/**
 * Where the picture is, or is flying to: its stage, a corner of the screen
 * (picture-in-picture), or the player's cell.
 */
export type Station = 'stage' | 'corner' | 'cell';
export const mediaStation = signal<Station>('corner');
let hls: Hls | null = null;
let loaded: { id: string; medium: Medium } | null = null;
let started = false;
/**
 * Between one episode's source and the next. Plays asked for meanwhile are
 * left to begin() (in loadSource), and a play the swap cuts short, or a
 * pause it causes, says nothing about what the visitor wants.
 */
let swapping = false;

/** A failed source is reloaded once; another failure this soon stays stopped. */
const RETRY_WINDOW_MS = 10_000;
let recovered: { id: string; at: number } | null = null;
/** Counts sources loaded, so a failure is handled once for the source it hit. */
let generation = 0;
/** Where a source that ran out of retries stopped, for the next Play. */
let stoppedAt = 0;
/** The episode whose playhead the element holds, once its source is ready. */
let playhead: string | null = null;
/** Fired on the element when a source is ready and its playhead placed. */
const READY = 'starpod:ready';

/**
 * The source failed (the element's error, or a fatal hls.js error): reload
 * it once where it stopped, playing again if it was playing. A second
 * failure inside the retry window is left stopped rather than looping.
 * Either way nothing waits on a spinner. The same failure reported twice
 * (hls.js and the element both) is handled once: the reload moves on to a
 * new source, and a report for the old one is dropped.
 */
function recover(source = generation) {
  const video = element;
  const episode = currentEpisode.value;
  isBuffering.value = false;
  if (!video || !episode || source !== generation) {
    return;
  }
  const now = Date.now();
  if (recovered?.id === episode.id && now - recovered.at < RETRY_WINDOW_MS) {
    // Stopped, and the failed source forgotten: the next Play loads it
    // again (a failed element refuses play() until a new load).
    swapping = false;
    loaded = null;
    stoppedAt = video.currentTime > 0 ? video.currentTime : readPosition(episode.id);
    isPlaying.value = false;
    return;
  }
  recovered = { id: episode.id, at: now };
  const at = video.currentTime > 0 ? video.currentTime : readPosition(episode.id);
  // The failure's own pause or refused play is not the visitor's choice.
  const resume = isPlaying.value;
  loaded = null;
  void loadSource(episode, activeMedium.value, { at, resume });
}

function savePosition(id: string, seconds: number) {
  try {
    localStorage.setItem(POSITION_PREFIX + id, String(Math.floor(seconds)));
  } catch {
    // Storage unavailable: resuming is a nicety, never a requirement.
  }
}


/** play() returns a promise in modern browsers and nothing in older ones. */
function safePlay(media: HTMLMediaElement) {
  const refused = (error?: unknown) => {
    if (!swapping && (error as Error | undefined)?.name !== 'AbortError') {
      isPlaying.value = false;
    }
  };
  try {
    const attempt = media.play() as Promise<void> | undefined;
    attempt?.catch?.(refused);
  } catch (error) {
    refused(error);
  }
}

function createElement(): HTMLVideoElement {
  const video = document.createElement('video');
  video.className = 'starpod-media';
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-label', 'Episode video');
  // Playback as --live-* custom properties, for CSS to follow (publish.ts).
  publish(video);

  video.addEventListener('timeupdate', () => {
    currentTime.value = video.currentTime;
    // Only the episode whose source is ready owns the playhead: a source
    // being reset reads 0, which is no one's progress.
    const id = currentEpisode.value?.id;
    if (id && id === playhead && Math.abs(video.currentTime - lastSaved) > 5) {
      lastSaved = video.currentTime;
      savePosition(id, video.currentTime);
    }
    updatePositionState();
  });
  // A seek (skip, scrubber, transcript line) can take a moment to land on a
  // far-off HLS segment, and browsers hold timeupdate until it does. Publish
  // the destination at once so the live transcript and the scrubber follow
  // the visitor, not the network.
  video.addEventListener('seeking', () => {
    currentTime.value = video.currentTime;
  });
  // Ready once it has a frame to show: until then an episode's stage keeps
  // its artwork (stage.css). loadSource() takes the mark away.
  video.addEventListener('loadeddata', () => (video.dataset.ready = ''));
  video.addEventListener('durationchange', () => {
    mediaDuration.value = Number.isFinite(video.duration) ? video.duration : 0;
  });
  video.addEventListener('play', () => (isPlaying.value = true));
  video.addEventListener('pause', () => {
    // A pause from a failed source is not the visitor's (recover() decides).
    if (!swapping && !video.error) {
      isPlaying.value = false;
    }
  });
  video.addEventListener('error', () => {
    // Aborted means a new source replaced this one: nothing failed.
    if (video.error && video.error.code !== 1 /* MEDIA_ERR_ABORTED */) {
      recover();
    }
  });
  video.addEventListener('waiting', () => (isBuffering.value = true));
  video.addEventListener('playing', () => (isBuffering.value = false));
  video.addEventListener('canplay', () => (isBuffering.value = false));
  video.addEventListener('ratechange', () => {
    playbackRate.value = video.playbackRate;
  });
  video.addEventListener('ended', () => {
    const id = currentEpisode.value?.id;
    if (id) {
      savePosition(id, 0);
    }
    isPlaying.value = false;
    playNext();
  });

  return video;
}

function updatePositionState() {
  if (!element || !('mediaSession' in navigator)) {
    return;
  }
  const duration = element.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    return;
  }
  try {
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: element.playbackRate,
      position: Math.min(element.currentTime, duration)
    });
  } catch {
    // Some browsers reject position state mid-load; the next tick retries.
  }
}

function canPlayHlsNatively(video: HTMLVideoElement) {
  return Boolean(video.canPlayType('application/vnd.apple.mpegurl'));
}

async function loadSource(
  episode: PlayableEpisode,
  medium: Medium,
  retry?: { at: number; resume: boolean }
) {
  const video = element!;
  const source = ++generation;
  const sameEpisode = loaded?.id === episode.id;
  // Switching medium mid-episode keeps the visitor's place; a new episode
  // resumes where they left it last time; a retry, where it stopped.
  const startAt =
    retry?.at ??
    (sameEpisode ? video.currentTime : resumePoint(episode.id));
  if (retry) {
    isPlaying.value = retry.resume;
  }

  hls?.destroy();
  hls = null;
  loaded = { id: episode.id, medium };
  playhead = null;
  delete video.dataset.ready;
  if (video.currentSrc) {
    // The old source's pause on the way out is not the visitor's.
    swapping = true;
  }
  if (!sameEpisode && video.currentSrc) {
    // Let go of the last episode before anything waits (hls.js is imported
    // on first use): left attached, a play asked for meanwhile would replay
    // it from the start, and a seek would land in it.
    swapping = true;
    video.removeAttribute('src');
    video.load();
    video.addEventListener('error', () => (swapping = false), { once: true });
  }
  video.poster = episode.image ?? '';
  video.dataset.medium = medium;

  // Audio as the feed serves it: an enclosure needn't send CORS headers.
  const playAudio = () => {
    video.removeAttribute('crossorigin');
    video.src = episode.audio.src;
  };
  if (medium === 'watch' && episode.video) {
    // Video frames are sampled for the stage's light (publish.ts), which
    // needs a CORS-clean picture.
    video.crossOrigin = 'anonymous';
    const isHls = /mpegurl/i.test(episode.video.type);
    if (!isHls || canPlayHlsNatively(video)) {
      video.src = episode.video.src;
    } else {
      const HlsClass = await import('hls.js').then(
        (module) => module.default,
        () => null
      );
      // Another source may have been chosen while it loaded.
      if (source !== generation) {
        return;
      }
      if (HlsClass?.isSupported()) {
        hls = new HlsClass({ startPosition: startAt });
        hls.on(HlsClass.Events.ERROR, (_event, data) => data.fatal && recover(source));
        hls.loadSource(episode.video.src);
        hls.attachMedia(video);
      } else {
        // No MSE, or hls.js failed to load: audio rather than a black frame.
        playAudio();
        video.dataset.medium = 'listen';
      }
    }
  } else {
    playAudio();
  }

  const begin = () => {
    if (source !== generation) {
      return;
    }
    swapping = false;
    if (startAt > 0 && Math.abs(video.currentTime - startAt) > 1) {
      video.currentTime = startAt;
    }
    playhead = episode.id;
    lastSaved = video.currentTime;
    // For a seek waiting on this source (seekTo's effect).
    video.dispatchEvent(new Event(READY));
    // What the visitor wants now: a Pause while it loaded holds.
    if (isPlaying.value) {
      safePlay(video);
    }
  };
  if (video.readyState >= 1) {
    begin();
  } else {
    video.addEventListener('loadedmetadata', begin, { once: true });
  }

  setMediaSession(episode);
}

function setMediaSession(episode: PlayableEpisode) {
  if (!('mediaSession' in navigator)) {
    return;
  }
  navigator.mediaSession.metadata = new MediaMetadata({
    title: episode.title,
    artist: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ?? '',
    artwork: episode.image
      ? [{ src: new URL(episode.image, location.href).href, sizes: '512x512' }]
      : []
  });
  const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
    ['play', () => (isPlaying.value = true)],
    ['pause', () => (isPlaying.value = false)],
    ['seekbackward', (d) => skip(-(d.seekOffset ?? 15))],
    ['seekforward', (d) => skip(d.seekOffset ?? 30)],
    ['seekto', (d) => d.seekTime !== undefined && (seekTo.value = d.seekTime)]
  ];
  for (const [action, handler] of handlers) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // Unsupported action on this browser.
    }
  }
}

export function skip(seconds: number) {
  if (!element) {
    return;
  }
  const max = Number.isFinite(element.duration) ? element.duration : Infinity;
  element.currentTime = Math.max(0, Math.min(max, element.currentTime + seconds));
  currentTime.value = element.currentTime;
}

/** Seek without changing play/pause (the scrubber). */
export function seek(seconds: number) {
  if (element) {
    element.currentTime = seconds;
    currentTime.value = seconds;
  }
}

/** Is the media element (or its container) showing fullscreen right now? */
function isFullscreen() {
  return Boolean(element) && document.fullscreenElement === element;
}

/**
 * Real fullscreen for the video, through the browser's own API. iPhone Safari
 * only offers `webkitEnterFullscreen` on the video element itself, so that is
 * the fallback. The element has no native controls while it lives on the
 * page; they come on for fullscreen so the visitor can pause or leave.
 */
export function enterFullscreen() {
  const video = element as
    | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
    | null;
  if (!video) {
    return;
  }
  if (typeof video.requestFullscreen === 'function') {
    video.controls = true;
    void video.requestFullscreen().catch(() => {
      video.controls = false;
    });
  } else if (typeof video.webkitEnterFullscreen === 'function') {
    video.webkitEnterFullscreen();
  }
}

export function setRate(rate: number) {
  if (element) {
    element.playbackRate = rate;
  }
}

/** Move the element into a container without interrupting playback. */
function moveInto(container: Element) {
  if (!element || element.parentElement === container) {
    return;
  }
  const target = container as Element & {
    moveBefore?: (node: Node, child: Node | null) => void;
  };
  if (typeof target.moveBefore === 'function' && element.isConnected) {
    target.moveBefore(element, null);
  } else {
    container.appendChild(element);
  }
  mediaHost.value = container.closest('[data-media-slot]') ? 'stage' : 'dock';
}

const box = () => document.querySelector<HTMLElement>('[data-player-media]');
const flyer = (outer: HTMLElement) => outer.firstElementChild as HTMLElement;

/** The in-page home for a station: the current episode's stage slot, or the player's cell. */
function homeOf(station: Station) {
  if (station === 'corner') {
    return null;
  }
  const id = currentEpisode.value?.id;
  const selector =
    station === 'cell'
      ? '[data-media-cell]'
      : id && `[data-media-slot][data-episode-id="${CSS.escape(id)}"]`;
  return selector ? document.querySelector<HTMLElement>(selector) : null;
}

/** Half or more of a stage's picture is on screen. */
function halfInView(frame: Element) {
  const rect = frame.getBoundingClientRect();
  const shown = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
  return rect.height > 0 && shown / rect.height >= 0.5;
}

/** `fresh`: the episode has just changed, so its stage (if any) is not watched yet. */
function decideStation(fresh = false): Station {
  const slot = homeOf('stage');
  const hasCell = Boolean(homeOf('cell'));
  if (playerExpanded.value && hasCell) {
    return 'cell';
  }
  // A paused picture stays on its stage when the page scrolls past it; a
  // playing one leaves for its picture-in-picture place. A stage this play
  // has only just made current is watched once its island renders (watchStage):
  // until then, where it is on screen decides.
  const away = slot && fresh ? !halfInView(slot) : stageOutOfView.value;
  const resting = element?.parentElement === slot && !isPlaying.value;
  if (slot && (!away || resting)) {
    return 'stage';
  }
  return hasCell && (miniClosed.value || pictureDocked.value)
    ? 'cell'
    : 'corner';
}

// Flights and anchors need anchor positioning to target a home that scrolls.
const canAnchor = () => globalThis.CSS?.supports?.('anchor-name: --a') ?? false;
let flight = 0;
// Where the picture was on the page being navigated away from.
let departure: DOMRect | null = null;
// The artwork of the episode row last played from, where a first picture starts.
let launch: DOMRect | null = null;
// The episode whose picture is on screen (the one last placed).
let shown: string | null = null;

/** The box waits, invisible, on the home the element lives in. */
function park(outer: HTMLElement, station: Station) {
  outer.dataset.station = station;
  outer.dataset.parked = '';
}

/**
 * Put the element where it belongs and fly it there. A journey from an in-page
 * home starts with the element stepping into the box, which is parked exactly
 * over it; a journey to one ends with the box landing on it and handing the
 * element over. `again` flies even when nothing changed (a drag let go over
 * the corner it came from, or fullscreen closing).
 */
export function placeMedia(mode?: 'again') {
  const outer = box();
  // Moving an element out of its parent ends fullscreen; stay put until the
  // visitor leaves it.
  if (!element || !outer || isFullscreen()) {
    return;
  }
  if (!currentEpisode.value) {
    park(outer, 'corner');
    return;
  }
  const holder = outer.querySelector('[data-media-dock]')!;
  const own = shown === currentEpisode.value.id;
  shown = currentEpisode.value.id;
  const station = decideStation(!own);
  const home = homeOf(station);
  mediaStation.value = station;
  // The stage's slot is the picture's anchor only once its stage is marked
  // current, which the stage's own island does after it hydrates. Mark it
  // here, before measuring: after a navigation this runs first.
  if (station === 'stage') {
    home?.closest('[data-stage]')?.setAttribute('data-current', '');
  }
  const unchanged =
    outer.dataset.station === station &&
    outer.dataset.corner === pipCorner.value &&
    element.parentElement === (outer.dataset.parked === undefined ? holder : home);
  if (unchanged && !mode) {
    return;
  }
  // First: the pixels the picture is on now (or was on, on the page just
  // left; or, the first time, the artwork of the row it was played from),
  // before anything moves. Another episode's picture is not where this one
  // comes from: a new episode starts from its row's artwork, or else from
  // nowhere (played from its own stage, say), and goes straight home.
  const from = departure ?? (own && element.isConnected ? element.getBoundingClientRect() : launch);
  if (from && from === launch) {
    // Start the box at the artwork's size, so its size tweens from there.
    outer.style.width = `${from.width}px`;
    outer.style.height = `${from.height}px`;
    outer.getBoundingClientRect();
  }
  departure = launch = null;
  outer.style.width = outer.style.height = '';
  outer.dataset.corner = pipCorner.value;
  ++flight;

  if (home && element.parentElement === home) {
    park(outer, station);
    return;
  }
  // With nowhere to fly from, the box would only grow on its new home from
  // the size it was parked at.
  if (home && (!canAnchor() || !from?.width)) {
    moveInto(home);
    park(outer, station);
    return;
  }
  moveInto(holder);
  outer.dataset.station = station;
  delete outer.dataset.parked;
  if (from?.width) {
    flipFrom(flyer(outer), from);
  }
  if (home) {
    land(outer, home, station);
  }
}

/**
 * Hand the element to its home once the flight is over. A home that moves
 * while the picture flies to it (the cell, as the sheet grows) retargets the
 * box's size transition, so wait until nothing is running any more.
 */
function land(outer: HTMLElement, home: HTMLElement, station: Station) {
  const ticket = flight;
  const settle = () => {
    // A newer journey has taken over.
    if (ticket !== flight) {
      return;
    }
    const flying = [...outer.getAnimations(), ...flyer(outer).getAnimations()];
    if (flying.length) {
      void Promise.allSettled(flying.map((animation) => animation.finished)).then(settle);
    } else if (home.isConnected && !isFullscreen()) {
      moveInto(home);
      park(outer, station);
    }
  };
  settle();
}

/**
 * Follow whether a stage is in view. Where CSS scroll-triggered animations
 * exist, the stage's own `timeline-trigger` decides (player.css), and a 1ms
 * sentinel animation it plays tells the engine which way it went; elsewhere an
 * IntersectionObserver does, with the same hysteresis. Returns the stop.
 */
export function watchStage(room: HTMLElement) {
  const frame = room.querySelector('[data-stage-frame]')!;
  // Seed from geometry: on a page that just arrived the trigger has not run.
  stageOutOfView.value = !halfInView(frame);

  if (CSS.supports('timeline-trigger', '--t view()')) {
    const onTrigger = (event: AnimationEvent) => {
      if (event.target !== room || event.animationName !== 'player-stage-sentinel') {
        return;
      }
      const sentinel = room
        .getAnimations()
        .find((animation) => (animation as CSSAnimation).animationName === 'player-stage-sentinel');
      stageOutOfView.value = !sentinel || sentinel.playbackRate < 0;
    };
    room.addEventListener('animationstart', onTrigger);
    room.addEventListener('animationend', onTrigger);
    return () => {
      room.removeEventListener('animationstart', onTrigger);
      room.removeEventListener('animationend', onTrigger);
      stageOutOfView.value = false;
    };
  }

  if (!('IntersectionObserver' in window)) {
    return () => {};
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio >= 0.5) {
        stageOutOfView.value = false;
      } else if (entry.intersectionRatio < 0.25) {
        stageOutOfView.value = true;
      }
    },
    { threshold: [0, 0.25, 0.5, 0.75] }
  );
  observer.observe(frame);
  return () => {
    observer.disconnect();
    stageOutOfView.value = false;
  };
}

function syncRootState() {
  const root = document.documentElement.dataset;
  const episode = currentEpisode.value;
  root.episode = episode?.id ?? '';
  root.playing = String(isPlaying.value);
  root.medium = activeMedium.value;
  root.host = mediaHost.value;
  root.hasVideo = String(Boolean(episode?.video));
  root.mini = miniClosed.value ? 'closed' : 'open';
  // Where the picture is (a phone makes room under a floating one).
  root.picture = episode ? mediaStation.value : '';
  // A phone's screen (state.ts's one phone query), for the player's styles.
  document.documentElement.toggleAttribute('data-phone', phoneScreen.value);
}

/** Start the engine once; safe to call from every island. */
export function startEngine() {
  if (started || typeof window === 'undefined') {
    return;
  }
  started = true;
  element = createElement();
  installShortcuts();
  document.addEventListener('fullscreenchange', () => {
    if (element && !isFullscreen()) {
      element.controls = false;
      placeMedia('again');
    }
  });
  startStageLight(() => element);
  const outer = box();
  if (outer) {
    startPip(outer, placeMedia);
  }
  document.addEventListener(
    'click',
    (event) => {
      const art = (event.target as Element)
        .closest?.('.play-toggle')
        ?.closest('[data-episode-row]')
        ?.querySelector('img');
      launch = art?.getBoundingClientRect() ?? null;
    },
    true
  );
  // A shell layout change (the sidebar folding) carries the picture and the
  // stage it plays on to their new places.
  registerFlipTargets(() => [
    outer && outer.dataset.parked === undefined ? flyer(outer) : null,
    document.querySelector<HTMLElement>('.stage[data-current] [data-stage-frame]')
  ]);

  effect(() => {
    const episode = currentEpisode.value;
    const medium = activeMedium.value;
    if (!episode) {
      return;
    }
    if (loaded?.id !== episode.id || loaded.medium !== medium) {
      void loadSource(episode, medium);
    }
  });

  // Re-home whenever anything that decides the home changes.
  effect(() => {
    void currentEpisode.value;
    void activeMedium.value;
    void stageOutOfView.value;
    void isPlaying.value;
    void miniClosed.value;
    void pipCorner.value;
    void pictureDocked.value;
    void playerExpanded.value;
    placeMedia();
  });

  // The artwork stands in for the picture whenever there is none to show.
  effect(() => {
    const image = currentEpisode.value?.image;
    box()?.style.setProperty('--art', image ? `url(${JSON.stringify(image)})` : 'none');
  });

  effect(() => {
    if (!element || !currentEpisode.value) {
      return;
    }
    if (isPlaying.value) {
      const episode = currentEpisode.value;
      if (!loaded) {
        // Its source ran out of retries: Play loads it again.
        void loadSource(episode, activeMedium.peek(), { at: stoppedAt, resume: true });
      } else if (!swapping) {
        // Mid-swap, begin() plays the new source once it is ready.
        safePlay(element);
      }
    } else {
      element.pause();
    }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying.value ? 'playing' : 'paused';
    }
  });

  effect(() => {
    if (element) {
      element.muted = isMuted.value;
    }
  });

  // Mirror which episode and how it plays onto <html> (it changes rarely), so
  // pure CSS can respond without hydrating anything. The clock itself is
  // published by publish.ts.
  effect(syncRootState);

  effect(() => {
    const target = seekTo.value;
    if (target === null || !element) {
      return;
    }
    const video = element;
    // The seek is for the episode chosen with it; another episode's source
    // getting ready first must not take it.
    const id = currentEpisode.peek()?.id;
    const ready = () => playhead === id && video.readyState >= 1;
    const apply = () => {
      if (currentEpisode.peek()?.id !== id) {
        seekTo.value = null;
        return;
      }
      if (!ready()) {
        return;
      }
      video.removeEventListener(READY, apply);
      video.currentTime = target;
      seekTo.value = null;
      isPlaying.value = true;
    };
    if (ready()) {
      apply();
      return;
    }
    video.addEventListener(READY, apply);
    // A newer seek, or a new episode, replaces this one.
    return () => video.removeEventListener(READY, apply);
  });

  // Client-side navigation. The box persists, and its view transition group
  // shows it live, so the picture flies across the page change like any
  // other journey. Before the swap, a picture on the old page's stage steps
  // into the box (keeping it in the document, so it keeps playing) at the
  // size it had; the flight starts once the new page is in, as rendering
  // resumes, from where it was on the old page.
  document.addEventListener('astro:before-swap', () => {
    launch = null;
    const outer = box();
    if (outer && element?.parentElement?.closest('[data-media-slot]')) {
      departure = element.getBoundingClientRect();
      outer.style.width = `${departure.width}px`;
      outer.style.height = `${departure.height}px`;
      moveInto(outer.querySelector('[data-media-dock]')!);
    }
  });
  document.addEventListener('astro:after-swap', () => {
    // The swap replaces <html> attributes with the new document's.
    syncRootState();
    placeMedia();
  });
}

