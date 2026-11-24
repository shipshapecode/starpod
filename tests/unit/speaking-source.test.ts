import { describe, expect, it, vi } from 'vitest';

vi.mock('starpod/src/components/media/cue-cache', async (original) => ({
  ...(await original<object>()),
  loadCues: () =>
    Promise.resolve([
      { s: 10, t: 'Welcome', n: 'Robbie Wagner' },
      { s: 20, t: 'Thanks', n: 'Chuck Carpenter' }
    ])
}));

import 'starpod/src/components/episode/speaking-source';
import { speakingNow } from 'starpod/src/components/episode/speaking';
import { currentEpisode, currentTime, isPlaying } from 'starpod/src/components/state';

describe('who is speaking', () => {
  it('is no one before the first line starts, then its speaker', async () => {
    currentEpisode.value = {
      id: 'ep',
      slug: 'ep',
      title: 'ep',
      audio: { src: 'https://cdn.example/ep.mp3', type: 'audio/mpeg' },
      episodeNumber: '1'
    } as never;
    isPlaying.value = true;
    currentTime.value = 3;
    // Let the cues land.
    await new Promise((resolve) => setTimeout(resolve));
    expect(speakingNow.value).toBeUndefined();

    currentTime.value = 9.8; // within the quarter-second lead
    expect(speakingNow.value).toBe('Robbie Wagner');
    currentTime.value = 21;
    expect(speakingNow.value).toBe('Chuck Carpenter');
  });
});
