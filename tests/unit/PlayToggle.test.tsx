import { act, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import PlayToggle from 'starpod/src/components/media/PlayToggle';
import { currentEpisode, isBuffering, isPlaying } from 'starpod/src/components/state';

const episode = {
  id: 'ep-7',
  title: 'Toggle Episode',
  audio: { src: 'a.mp3', type: 'audio/mpeg' },
  episodeNumber: '7'
};

describe('PlayToggle', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    isPlaying.value = false;
    isBuffering.value = false;
  });

  it('shows the buffering ring on every play button while waiting, and clears it once data arrives', async () => {
    render(
      <>
        <PlayToggle class="dock-play" size={20} />
        <PlayToggle class="stage-play" episode={episode} labelFor={() => 'Stage'} size={30} />
      </>
    );
    const dock = () => document.querySelector('.dock-play')!;
    const stage = screen.getByRole('button', { name: 'Stage' });

    act(() => {
      currentEpisode.value = episode;
      isPlaying.value = true;
      isBuffering.value = true;
    });
    expect(dock()).toHaveAttribute('data-buffering');
    expect(stage).toHaveAttribute('data-buffering');

    act(() => {
      isBuffering.value = false;
    });
    expect(dock()).not.toHaveAttribute('data-buffering');
    expect(stage).not.toHaveAttribute('data-buffering');
  });

  it('never spins while paused, even if the element is still waiting', () => {
    render(<PlayToggle class="dock-play" size={20} />);
    act(() => {
      currentEpisode.value = episode;
      isBuffering.value = true;
    });
    expect(screen.getByRole('button', { name: 'Play' })).not.toHaveAttribute('data-buffering');
  });

  it('only reflects its own episode', () => {
    render(
      <PlayToggle class="row-play" episode={{ ...episode, id: 'other' }} labelFor={(on) => (on ? 'Pause other' : 'Play other')} size={18} />
    );
    act(() => {
      currentEpisode.value = episode;
      isPlaying.value = true;
      isBuffering.value = true;
    });
    const button = screen.getByRole('button', { name: 'Play other' });
    expect(button).not.toHaveAttribute('data-buffering');
  });
});
