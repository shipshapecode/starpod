/**
 * The media engine: one <video> element for the whole visit.
 *
 * It plays the episode's HLS video when the visitor is watching and the MP3
 * enclosure when they are listening (a <video> element plays audio just as
 * well, and keeps one element to persist). The element physically moves
 * between an episode page's stage slot (`[data-media-slot]`) and the
 * persistent dock (`[data-media-dock]`); moving a media element in the DOM
 * does not interrupt playback, and the View Transitions API morphs it between
 * the two homes on navigation because it carries a stable
 * `view-transition-name`.
 *
 * Client-only. Import it from islands, never from server code.
 */
import { effect, signal } from '@preact/signals';
import type Hls from 'hls.js';

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
  playbackRate,
  seekTo,
  type Medium,
  type PlayableEpisode
} from '../state';
import { installShortcuts } from './shortcuts';
import { startStageLight } from './stage-light';

let element: HTMLVideoElement | null = null;

/**
 * True while the current episode's stage is scrolled mostly out of view. A
 * playing video then floats into the dock (picture-in-picture on the page)
 * and drops back into the stage when the visitor scrolls up again.
 */
export const stageOutOfView = signal(false);
let hls: Hls | null = null;
let loaded: { id: string; medium: Medium } | null = null;
let started = false;

const POSITION_PREFIX = 'starpod:pos:';
const RESUME_MIN_SECONDS = 30;

function savePosition(id: string, seconds: number) {
  try {
    localStorage.setItem(POSITION_PREFIX + id, String(Math.floor(seconds)));
  } catch {
    // Storage unavailable: resuming is a nicety, never a requirement.
  }
}

export function readPosition(id: string): number {
  try {
    return Number(localStorage.getItem(POSITION_PREFIX + id)) || 0;
  } catch {
    return 0;
  }
}

/** play() returns a promise in modern browsers and nothing in older ones. */
function safePlay(media: HTMLMediaElement) {
  try {
    const attempt = media.play() as Promise<void> | undefined;
    attempt?.catch?.(() => (isPlaying.value = false));
  } catch {
    isPlaying.value = false;
  }
}

function createElement(): HTMLVideoElement {
  const video = document.createElement('video');
  video.className = 'starpod-media';
  video.playsInline = true;
  video.preload = 'metadata';
  video.crossOrigin = 'anonymous';
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-label', 'Episode video');

  let lastSaved = 0;
  video.addEventListener('timeupdate', () => {
    currentTime.value = video.currentTime;
    const id = currentEpisode.value?.id;
    if (id && Math.abs(video.currentTime - lastSaved) > 5) {
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
  video.addEventListener('durationchange', () => {
    mediaDuration.value = Number.isFinite(video.duration) ? video.duration : 0;
  });
  video.addEventListener('play', () => (isPlaying.value = true));
  video.addEventListener('pause', () => (isPlaying.value = false));
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

async function loadSource(episode: PlayableEpisode, medium: Medium) {
  const video = element!;
  const sameEpisode = loaded?.id === episode.id;
  // Switching medium mid-episode keeps the visitor's place; a new episode
  // resumes where they left it last time.
  const startAt = sameEpisode
    ? video.currentTime
    : readPosition(episode.id) > RESUME_MIN_SECONDS
      ? readPosition(episode.id)
      : 0;
  const wasPlaying = isPlaying.value;

  hls?.destroy();
  hls = null;
  loaded = { id: episode.id, medium };
  video.poster = episode.image ?? '';
  video.dataset.medium = medium;

  if (medium === 'watch' && episode.video) {
    const isHls = /mpegurl/i.test(episode.video.type);
    if (!isHls || canPlayHlsNatively(video)) {
      video.src = episode.video.src;
    } else {
      const { default: HlsClass } = await import('hls.js');
      if (HlsClass.isSupported()) {
        hls = new HlsClass({ startPosition: startAt });
        hls.loadSource(episode.video.src);
        hls.attachMedia(video);
      } else {
        // No MSE: fall back to audio rather than a black frame.
        video.src = episode.audio.src;
        video.dataset.medium = 'listen';
      }
    }
  } else {
    video.src = episode.audio.src;
  }

  const begin = () => {
    if (startAt > 0 && Math.abs(video.currentTime - startAt) > 1) {
      video.currentTime = startAt;
    }
    if (wasPlaying || isPlaying.value) {
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
}

/**
 * Put the element where it belongs: the stage slot for the current episode if
 * this page has one, otherwise the dock.
 */
export function placeMedia() {
  // Moving an element out of its parent ends fullscreen; stay put until the
  // visitor leaves it.
  if (!element || isFullscreen()) {
    return;
  }
  const id = currentEpisode.value?.id;
  const slot = id
    ? document.querySelector(`[data-media-slot][data-episode-id="${CSS.escape(id)}"]`)
    : null;
  const float =
    stageOutOfView.value && isPlaying.value && activeMedium.value === 'watch';
  if (slot && !float) {
    moveInto(slot);
    mediaHost.value = 'stage';
    return;
  }
  const dock = document.querySelector('[data-media-dock]');
  if (dock) {
    moveInto(dock);
  }
  mediaHost.value = 'dock';
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
}

function syncRootProgress() {
  const duration = mediaDuration.value;
  const progress = duration > 0 ? currentTime.value / duration : 0;
  document.documentElement.style.setProperty(
    '--playback-progress',
    progress.toFixed(4)
  );
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
      placeMedia();
    }
  });
  startStageLight(() => element);

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
    placeMedia();
  });

  effect(() => {
    if (!element || !currentEpisode.value) {
      return;
    }
    if (isPlaying.value) {
      safePlay(element);
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

  // Mirror playback state onto <html> so pure CSS (the stage light,
  // the live line, the dock) can respond without hydrating anything.
  effect(syncRootState);
  effect(syncRootProgress);

  effect(() => {
    const target = seekTo.value;
    if (target === null || !element) {
      return;
    }
    const video = element;
    const apply = () => {
      video.currentTime = target;
      seekTo.value = null;
      isPlaying.value = true;
    };
    if (video.readyState >= 1) {
      apply();
    } else {
      video.addEventListener('loadedmetadata', apply, { once: true });
    }
  });

  // Client-side navigation: rescue the element into the persistent dock
  // before the old page is swapped out, then re-home it once the new page is
  // in. Both run inside the view transition's update callback, so the old
  // and new snapshots see the element in its stage and its new home.
  document.addEventListener('astro:before-swap', () => {
    const dock = document.querySelector('[data-media-dock]');
    if (element && dock && element.parentElement?.closest('[data-media-slot]')) {
      moveInto(dock);
      mediaHost.value = 'dock';
    }
  });
  document.addEventListener('astro:after-swap', () => {
    // The swap replaces <html> attributes with the new document's.
    syncRootState();
    syncRootProgress();
    placeMedia();
  });
}

export function getMediaElement() {
  return element;
}
