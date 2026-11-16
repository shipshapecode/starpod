import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// A stand-in hls.js: each instance is kept, with its options and handlers.
const made = vi.hoisted(() => [] as Array<{ startPosition: number; handlers: Record<string, (event: string, data: { fatal: boolean }) => void> }>);
// Resolved from the site's package, as the engine's own import of it is.
vi.mock('../../packages/starpod/node_modules/hls.js', () => {
  class FakeHls {
    static Events = { ERROR: 'hlsError' };
    static isSupported = () => true;
    handlers: Record<string, (event: string, data: { fatal: boolean }) => void> = {};
    constructor(options: { startPosition: number }) {
      made.push({ startPosition: options.startPosition, handlers: this.handlers });
    }
    on(event: string, handler: (event: string, data: { fatal: boolean }) => void) {
      this.handlers[event] = handler;
    }
    loadSource() {}
    attachMedia(media: HTMLMediaElement) {
      media.setAttribute('src', 'blob:stream');
    }
    destroy() {}
  }
  return { default: FakeHls };
});

import { startEngine } from 'starpod/src/components/media/engine';
import { currentEpisode, isBuffering, isPlaying, setMedium } from 'starpod/src/components/state';

const audioEpisode = {
  id: 'ep-audio',
  title: 'Audio',
  audio: { src: 'https://cdn.example/audio.mp3', type: 'audio/mpeg' },
  episodeNumber: '1'
};
const videoEpisode = {
  id: 'ep-video',
  title: 'Video',
  audio: { src: 'https://cdn.example/video-audio.mp3', type: 'audio/mpeg' },
  video: { src: 'https://cdn.example/stream.m3u8', type: 'application/x-mpegURL' },
  episodeNumber: '2'
};

// jsdom has no media pipeline: the element below plays along by hand.
let video: HTMLVideoElement;
let time = 0;
let ready = 0;
let failure: { code: number } | null = null;
const load = vi.fn(() => {
  failure = null;
  ready = 0;
});
const play = vi.fn(() => Promise.resolve());

beforeAll(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(load);
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  const make = document.createElement.bind(document);
  const spy = vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
    const element = make(tag, options);
    if (tag === 'video') {
      video = element as HTMLVideoElement;
      Object.defineProperties(video, {
        currentSrc: { get: () => video.getAttribute('src') ?? '' },
        currentTime: { get: () => time, set: (value: number) => (time = value) },
        readyState: { get: () => ready },
        error: { get: () => failure }
      });
    }
    return element;
  });
  startEngine();
  spy.mockRestore();
});

afterAll(() => vi.restoreAllMocks());

/** The source's metadata arrives: the engine seeks to its start and plays. */
function arrive() {
  ready = 1;
  video.dispatchEvent(new Event('loadedmetadata'));
}

function fail() {
  failure = { code: 4 };
  video.dispatchEvent(new Event('error'));
}

describe('a source that fails', () => {
  it('is reloaded once where it stopped, playing again; a second failure that soon stays stopped', () => {
    currentEpisode.value = audioEpisode;
    isPlaying.value = true;
    arrive();
    time = 17;
    isBuffering.value = true;
    const loadsBefore = load.mock.calls.length;
    const playsBefore = play.mock.calls.length;

    fail();
    // No spinner left behind; the source is let go and set again.
    expect(isBuffering.value).toBe(false);
    expect(load).toHaveBeenCalledTimes(loadsBefore + 1);
    expect(video.getAttribute('src')).toBe(audioEpisode.audio.src);
    time = 0;
    arrive();
    expect(time).toBe(17);
    expect(play.mock.calls.length).toBeGreaterThan(playsBefore);
    expect(isPlaying.value).toBe(true);

    // It fails again within the retry window: no second reload, stopped.
    fail();
    expect(load).toHaveBeenCalledTimes(loadsBefore + 1);
    expect(isPlaying.value).toBe(false);
    expect(isBuffering.value).toBe(false);
  });

  it('recovers from a fatal hls.js error the same way, at the place it stopped', async () => {
    setMedium('watch');
    currentEpisode.value = videoEpisode;
    isPlaying.value = true;
    await vi.waitFor(() => expect(made).toHaveLength(1));
    arrive();
    time = 42;

    made[0]!.handlers.hlsError!('hlsError', { fatal: false });
    expect(made).toHaveLength(1);
    made[0]!.handlers.hlsError!('hlsError', { fatal: true });
    await vi.waitFor(() => expect(made).toHaveLength(2));
    expect(made[1]!.startPosition).toBe(42);

    // The same failure reported again by the old instance is not a second one.
    made[0]!.handlers.hlsError!('hlsError', { fatal: true });
    arrive();
    expect(isPlaying.value).toBe(true);

    // The new stream fails too, within the window: it stays stopped.
    made[1]!.handlers.hlsError!('hlsError', { fatal: true });
    await new Promise((done) => setTimeout(done, 20));
    expect(made).toHaveLength(2);
    expect(isPlaying.value).toBe(false);
  });
});
