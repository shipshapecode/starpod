import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadCues } from 'starpod/src/components/media/cue-cache';

afterEach(() => vi.unstubAllGlobals());

describe('loadCues', () => {
  it('asks again after a failure, and keeps an answer', async () => {
    const cues = [
      { s: 5, t: 'second' },
      { s: 1, t: 'first' }
    ];
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValue({ ok: true, json: async () => cues });
    vi.stubGlobal('fetch', fetch);

    expect(await loadCues('flaky')).toEqual([]);
    expect(await loadCues('flaky')).toEqual([]);
    expect(await loadCues('flaky')).toEqual([cues[1], cues[0]]);
    expect(await loadCues('flaky')).toEqual([cues[1], cues[0]]);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
