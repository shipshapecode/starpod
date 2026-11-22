import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// A stand-in hls.js that attaches a stream to the element it is given.
vi.mock('../../packages/starpod/node_modules/hls.js', () => {
  class FakeHls {
    static Events = { ERROR: 'hlsError' };
    static isSupported = () => true;
    on() {}
    loadSource() {}
    attachMedia(media: HTMLMediaElement) {
      media.setAttribute('src', 'blob:stream');
    }
    destroy() {}
  }
  return { default: FakeHls };
});

import { setRate, startEngine } from 'starpod/src/components/media/engine';
import { POSITION_PREFIX } from 'starpod/src/components/media/position';
import { currentEpisode, isPlaying, seekTo, setMedium } from 'starpod/src/components/state';

const episode = (id: string, video: false | 'hls' | 'mp4' | true = false) => ({
  id,
  title: id,
  audio: { src: `https://cdn.example/${id}.mp3`, type: 'audio/mpeg' },
  ...(video === 'mp4'
    ? { video: { src: `https://cdn.example/${id}.mp4`, type: 'video/mp4' } }
    : video
      ? { video: { src: `https://cdn.example/${id}.m3u8`, type: 'application/x-mpegURL' } }
      : {}),
  episodeNumber: '1'
});

// The OS media controls (lock screen, Control Center), as the engine registers them.
const sessionActions = new Map<string, (details: { seekTime?: number }) => void>();

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
  Object.defineProperty(navigator, 'mediaSession', {
    configurable: true,
    value: {
      metadata: null,
      setActionHandler: (action: string, handler: (details: { seekTime?: number }) => void) =>
        sessionActions.set(action, handler),
      setPositionState: () => {}
    }
  });
  vi.stubGlobal(
    'MediaMetadata',
    class {
      constructor(init: object) {
        Object.assign(this, init);
      }
    }
  );
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

beforeEach(() => {
  setMedium('listen');
  isPlaying.value = false;
});

function arrive() {
  ready = 1;
  video.dispatchEvent(new Event('loadedmetadata'));
}

function fail() {
  failure = { code: 4 };
  video.dispatchEvent(new Event('error'));
}

describe('the engine', () => {
  it('plays an MP3 without asking for CORS, and a video with it', async () => {
    currentEpisode.value = episode('cors-audio');
    expect(video.getAttribute('src')).toBe('https://cdn.example/cors-audio.mp3');
    expect(video.hasAttribute('crossorigin')).toBe(false);

    setMedium('watch');
    currentEpisode.value = episode('cors-video', true);
    await vi.waitFor(() => expect(video.getAttribute('src')).toBe('blob:stream'));
    expect(video.crossOrigin).toBe('anonymous');
  });

  it('loads a source that ran out of retries again on the next Play, where it stopped', () => {
    currentEpisode.value = episode('retry');
    isPlaying.value = true;
    arrive();
    time = 64;
    fail();
    time = 0;
    arrive();
    expect(time).toBe(64);
    fail();
    expect(isPlaying.value).toBe(false);

    const loads = load.mock.calls.length;
    isPlaying.value = true;
    expect(load.mock.calls.length).toBe(loads + 1);
    expect(video.getAttribute('src')).toBe('https://cdn.example/retry.mp3');
    arrive();
    expect(time).toBe(64);
    expect(isPlaying.value).toBe(true);
  });

  it('holds a Pause made while the next source loads', () => {
    currentEpisode.value = episode('pause-a');
    isPlaying.value = true;
    arrive();
    currentEpisode.value = episode('pause-b');
    isPlaying.value = false;
    const plays = play.mock.calls.length;
    arrive();
    expect(play.mock.calls.length).toBe(plays);
    expect(isPlaying.value).toBe(false);
  });

  it("doesn't save a source being reset as the next episode's progress", () => {
    localStorage.setItem(POSITION_PREFIX + 'resume-b', '754');
    currentEpisode.value = episode('resume-a');
    isPlaying.value = true;
    arrive();
    time = 120;
    video.dispatchEvent(new Event('timeupdate'));

    currentEpisode.value = episode('resume-b');
    time = 0;
    video.dispatchEvent(new Event('timeupdate'));
    expect(localStorage.getItem(POSITION_PREFIX + 'resume-b')).toBe('754');
    arrive();
    expect(time).toBe(754);
  });

  it("drops a seek for one episode when another is chosen before it's ready", () => {
    currentEpisode.value = episode('seek-a');
    seekTo.value = 300;
    currentEpisode.value = episode('seek-b');
    time = 0;
    arrive();
    expect(time).toBe(0);
    expect(seekTo.value).toBe(null);
  });

  it('applies a seek once its own episode is ready', () => {
    currentEpisode.value = episode('seek-c');
    seekTo.value = 95;
    expect(time).not.toBe(95);
    arrive();
    expect(time).toBe(95);
    expect(isPlaying.value).toBe(true);
  });

  it('plays a video from a host without CORS by asking again without it', () => {
    setMedium('watch');
    currentEpisode.value = episode('no-cors', 'mp4');
    isPlaying.value = true;
    expect(video.crossOrigin).toBe('anonymous');
    fail();
    expect(video.getAttribute('src')).toBe('https://cdn.example/no-cors.mp4');
    expect(video.hasAttribute('crossorigin')).toBe(false);
    expect(isPlaying.value).toBe(true);
    // The retry is still there for a real failure after that.
    arrive();
    fail();
    expect(video.getAttribute('src')).toBe('https://cdn.example/no-cors.mp4');
    expect(isPlaying.value).toBe(true);
  });

  it('keeps the chosen speed through a new source', () => {
    setRate(1.5);
    expect(video.defaultPlaybackRate).toBe(1.5);
    expect(video.playbackRate).toBe(1.5);
    setRate(1);
  });

  it('seeks from the lock screen without pressing Play', () => {
    currentEpisode.value = episode('lock-seek');
    arrive();
    sessionActions.get('seekto')!({ seekTime: 42 });
    expect(time).toBe(42);
    expect(isPlaying.value).toBe(false);
  });

  it('holds a retry through the reload, after earlier episode switches', () => {
    currentEpisode.value = episode('swap-a');
    isPlaying.value = true;
    arrive();
    currentEpisode.value = episode('swap-b');
    arrive();
    fail();
    // A new source clears the error; the reload's pause is not the visitor's.
    failure = null;
    video.dispatchEvent(new Event('pause'));
    expect(isPlaying.value).toBe(true);
  });

  it('saves the place at once on pause', () => {
    currentEpisode.value = episode('pause-save');
    isPlaying.value = true;
    arrive();
    time = 103;
    video.dispatchEvent(new Event('pause'));
    expect(localStorage.getItem(POSITION_PREFIX + 'pause-save')).toBe('103');
  });
});
