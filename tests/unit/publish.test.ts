import { describe, expect, it } from 'vitest';
import { clock, ease, publish } from 'starpod/src/components/media/publish';

function fakeMedia(duration: number) {
  const media = document.createElement('video');
  Object.defineProperty(media, 'duration', { value: duration, configurable: true });
  let time = 0;
  let paused = false;
  Object.defineProperty(media, 'currentTime', { get: () => time, configurable: true });
  Object.defineProperty(media, 'paused', { get: () => paused, configurable: true });
  return {
    media,
    at(seconds: number) {
      time = seconds;
      media.dispatchEvent(new Event('timeupdate'));
    },
    pause() {
      paused = true;
      media.dispatchEvent(new Event('pause'));
    }
  };
}

function bind() {
  const writes: Record<string, string | number> = {};
  const stop = clock.start({
    target: document.createElement('div'),
    config: {} as never,
    write: (name, value) => (writes[name] = value)
  });
  return { writes, stop };
}

describe('the media clock', () => {
  it('binds before there is media, then follows it exactly, paused included', () => {
    const early = bind();
    expect(early.writes).toEqual({});

    const { media, at, pause } = fakeMedia(4000);
    publish(media);
    at(4);
    expect(early.writes.progress).toBe(0.001);
    expect(early.writes['current-time']).toBe(4);
    expect(early.writes.duration).toBe(4000);
    expect(early.writes.paused).toBe(0);
    pause();
    expect(early.writes.paused).toBe(1);

    const late = bind();
    expect(late.writes.progress).toBe(0.001);

    late.stop();
    at(1000);
    expect(late.writes.progress).toBe(0.001);
    expect(early.writes.progress).toBe(0.25);
  });
});

describe('the picture colour', () => {
  it('drifts halfway to each new sample in coarse steps, so noise writes nothing', () => {
    const first = ease(undefined, [200, 40, 100]);
    expect(first).toEqual([208, 48, 96]);
    expect(ease(first, [0, 40, 100])).toEqual([112, 48, 96]);
    expect(ease(first, [201, 41, 99])).toEqual(first);
  });
});
