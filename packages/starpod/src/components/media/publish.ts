/**
 * The media's state as `--live-*` custom properties (prop-for-that), written
 * only where it is read, and never gated: the values keep moving wherever the
 * picture is (stage, corner, player, closed) and across navigations.
 *
 * `media-clock` writes `--live-progress` (0–1), `--live-current-time` (s),
 * `--live-paused` (1/0), `--live-duration` (s) and `--live-volume` (0–1) on
 * every element that declares `data-props-for="media-clock"`, exactly, four
 * times a second: only the few that show the clock (the island's scrubber,
 * on-air bars and title, the picture's bar), so a tick restyles only them.
 * Never on `<html>`: a custom property changing on the root restyles every
 * element, which on the longest transcript page (17,000 elements) is a 50–80ms
 * frame each time. On a small element it is a fraction of a millisecond.
 * The source is registered as this module loads (Layout imports it ahead of
 * prop-for-that's auto entry), so declarations in the page's own markup bind
 * without a warning and start writing once there is media.
 *
 * `video-tone` writes `--live-video` and `--live-video-accent` (the names the
 * library's `video-color` uses) on the floating picture's glow while a
 * video plays and floats in a corner (the glow is the only thing that shows
 * it): sampled once a second from a 16×16 frame made asynchronously and read
 * back in a worker, then eased and stepped coarsely, so it writes only when
 * the scene changes.
 * `video-color` itself reads the frame back synchronously, which stalled the
 * main thread 24–41ms per sample here (once 900ms).
 *
 * The artwork's palette (`img-color`, `--live-img*` on `<html>`) is bound by
 * the Island (Island.tsx) on its art's image: once per episode.
 */
import { propsFor, register, type Source } from 'prop-for-that';

const CLOCK_EVENTS = [
  'timeupdate',
  'seeking',
  'seeked',
  'durationchange',
  'loadedmetadata',
  'play',
  'pause',
  'volumechange',
  'emptied'
];

/** The bindings waiting for the media element, which is made on first play. */
const waiting = new Set<(media: HTMLMediaElement) => void>();
let current: HTMLMediaElement | undefined;

export const clock: Source = {
  key: 'media-clock',
  scope: 'element',
  gate: false,
  start(ctx) {
    let media: HTMLMediaElement | undefined;
    const write = () => {
      if (!media) {
        return;
      }
      const duration = Number.isFinite(media.duration) ? media.duration : 0;
      ctx.write('progress', duration > 0 ? +(media.currentTime / duration).toFixed(4) : 0);
      ctx.write('current-time', +media.currentTime.toFixed(2));
      ctx.write('duration', Math.round(duration));
      ctx.write('paused', media.paused ? 1 : 0);
      ctx.write('volume', media.muted ? 0 : media.volume);
    };
    const attach = (element: HTMLMediaElement) => {
      media = element;
      write();
      CLOCK_EVENTS.forEach((type) => element.addEventListener(type, write));
    };
    if (current) {
      attach(current);
    } else {
      waiting.add(attach);
    }
    return () => {
      waiting.delete(attach);
      CLOCK_EVENTS.forEach((type) => media?.removeEventListener(type, write));
    };
  }
};

register(clock);

type Tones = { video: string; 'video-accent': string };

type Rgb = Array<number>;

// Coarse enough that a glow only changes with the scene, not the noise.
const STEP = 16;

/** Halfway from the last colour to the new one, in coarse steps, so
    the colour drifts rather than flickers and small changes write nothing. */
export function ease(from: Rgb | undefined, to: Rgb): Rgb {
  return to.map((c, i) => Math.round((from ? (from[i] + c) / 2 : c) / STEP) * STEP);
}

const css = (c: Rgb) => `rgb(${c.join(' ')})`;

export function toneSource(media: HTMLVideoElement): Source {
  const listeners = new Set<(tones: Tones) => void>();
  let worker: Worker | undefined;
  let waiting = false;
  let timer = 0;
  let eased: { video?: Rgb; accent?: Rgb; css?: string } = {};
  const found = ({ data }: MessageEvent<{ video: Rgb; accent: Rgb } | null>) => {
    waiting = false;
    if (!data) {
      return;
    }
    const video = ease(eased.video, data.video);
    const accent = ease(eased.accent, data.accent);
    const next = { video: css(video), 'video-accent': css(accent) };
    if (`${next.video}${next['video-accent']}` !== eased.css) {
      eased = { video, accent, css: `${next.video}${next['video-accent']}` };
      listeners.forEach((listen) => listen(next));
    }
  };
  // The frame is made smaller here, off the main thread, and read back in a
  // worker (tone-worker.ts), so nothing on this thread waits for the GPU.
  // Only the floating picture's glow shows this colour, so it is sampled only
  // while the picture floats in a corner.
  const floating = () => {
    const box = document.querySelector<HTMLElement>('[data-player-media]');
    return box?.dataset.station === 'corner' && box.dataset.parked === undefined;
  };
  const sample = async () => {
    if (
      waiting ||
      media.paused ||
      document.hidden ||
      !media.videoWidth ||
      media.readyState < 2 ||
      !floating()
    ) {
      return;
    }
    waiting = true;
    const frame = await createImageBitmap(media, {
      resizeHeight: 16,
      resizeQuality: 'low',
      resizeWidth: 16
    }).catch(() => null);
    if (!frame) {
      waiting = false;
      return;
    }
    if (!worker) {
      worker = new Worker(new URL('./tone-worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = found;
      worker.onerror = () => (waiting = false);
    }
    worker.postMessage(frame, [frame]);
  };
  return {
    key: 'video-tone',
    scope: 'element',
    gate: false,
    props: {
      video: { syntax: '<color>', initial: 'transparent' },
      'video-accent': { syntax: '<color>', initial: 'transparent' }
    },
    start(ctx) {
      const listen = (found: Tones) => {
        ctx.write('video', found.video);
        ctx.write('video-accent', found['video-accent']);
      };
      listeners.add(listen);
      if (eased.css) {
        listen({ video: css(eased.video!), 'video-accent': css(eased.accent!) });
      }
      timer ||= window.setInterval(sample, 1000);
      return () => {
        listeners.delete(listen);
        if (!listeners.size) {
          window.clearInterval(timer);
          timer = 0;
          eased = {};
        }
      };
    }
  };
}

export function publish(media: HTMLVideoElement) {
  current = media;
  waiting.forEach((attach) => attach(media));
  waiting.clear();
  register(toneSource(media));
  // The picture's colour lights only the floating picture's glow.
  for (const glow of document.querySelectorAll<HTMLElement>('.player-glow')) {
    propsFor(glow, ['video-tone']);
  }
}
