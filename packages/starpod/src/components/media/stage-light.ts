import { effect } from '@preact/signals';

import { activeMedium, currentEpisode, isPlaying, mediaHost } from '../state';

const WIDTH = 32;
const HEIGHT = 18;
// Each frame blends a fraction of the new picture into the last, so the light
// drifts between shots instead of flickering with every cut.
const BLEND = 0.18;
const FRAME_MS = 120;
const CALM_FRAME_MS = 900;

/**
 * Stage light: while a video plays on its stage, the picture's light spills
 * into the room around the frame (the canvas behind it, blurred by CSS). The
 * canvas only ever draws; it never reads pixels back, so a cross-origin
 * stream is fine. Paused, listening, hidden, or floating in the dock, it
 * stops drawing and the episode artwork's glow holds the room instead.
 */
export function startStageLight(getVideo: () => HTMLVideoElement | null) {
  const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? { matches: false };
  let frame = 0;
  let timer = 0;
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;

  const stop = () => {
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    frame = 0;
  };

  const draw = () => {
    const video = getVideo();
    if (!video || !canvas || !context || !canvas.isConnected) {
      stop();
      return;
    }
    if (video.readyState >= 2) {
      context.globalAlpha = canvas.dataset.lit ? BLEND : 1;
      context.drawImage(video, 0, 0, WIDTH, HEIGHT);
      if (!canvas.dataset.lit) {
        canvas.dataset.lit = '';
      }
    }
    timer = window.setTimeout(() => {
      frame = requestAnimationFrame(draw);
    }, calm.matches ? CALM_FRAME_MS : FRAME_MS);
  };

  const sync = () => {
    stop();
    const episode = currentEpisode.value;
    const lit =
      Boolean(episode?.video) &&
      isPlaying.value &&
      activeMedium.value === 'watch' &&
      mediaHost.value === 'stage' &&
      document.visibilityState === 'visible';
    if (!lit || !episode) {
      return;
    }
    const next = document.querySelector<HTMLCanvasElement>(
      `[data-stage-light][data-episode-id="${CSS.escape(episode.id)}"]`
    );
    if (!next) {
      return;
    }
    if (next !== canvas) {
      canvas = next;
      context = next.getContext('2d', { alpha: false });
    }
    draw();
  };

  effect(() => {
    void currentEpisode.value;
    void isPlaying.value;
    void activeMedium.value;
    void mediaHost.value;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('astro:after-swap', () => {
    canvas = null;
    sync();
  });
}
