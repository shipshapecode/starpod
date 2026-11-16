import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import FullPlayButton from 'starpod/src/components/FullPlayButton';
import { currentEpisode, isPlaying } from 'starpod/src/components/state';

const mockEpisode = {
  id: 'test-episode-1',
  title: 'Test Episode',
  audio: { src: 'test.mp3', type: 'audio/mpeg' },
  episodeNumber: '1'
};

const mockEpisode2 = {
  id: 'test-episode-2',
  title: 'Test Episode 2',
  audio: { src: 'test2.mp3', type: 'audio/mpeg' },
  episodeNumber: '2'
};

describe('FullPlayButton', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    isPlaying.value = false;
  });

  it('renders nothing when episode is null', () => {
    const { container } = render(<FullPlayButton episode={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('names the episode it plays', () => {
    render(<FullPlayButton episode={mockEpisode} />);
    expect(
      screen.getByRole('button', { name: 'Play episode 1: Test Episode' })
    ).toBeInTheDocument();
  });

  it('starts the episode when clicked', () => {
    render(<FullPlayButton episode={mockEpisode} />);
    fireEvent.click(screen.getByRole('button'));

    expect(currentEpisode.value?.id).toBe('test-episode-1');
    expect(isPlaying.value).toBe(true);
  });

  it('pauses when the current episode is playing', () => {
    currentEpisode.value = mockEpisode;
    isPlaying.value = true;
    render(<FullPlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button', { name: /^Pause episode 1/ });
    fireEvent.click(button);
    expect(isPlaying.value).toBe(false);
  });

  it('switches to a different episode and plays it', () => {
    currentEpisode.value = mockEpisode;
    isPlaying.value = true;
    render(<FullPlayButton episode={mockEpisode2} />);

    fireEvent.click(screen.getByRole('button'));
    expect(currentEpisode.value?.id).toBe('test-episode-2');
    expect(isPlaying.value).toBe(true);
  });

  it('marks its row as current while its episode is loaded', () => {
    currentEpisode.value = mockEpisode;
    const { container } = render(
      <li data-episode-row>
        <FullPlayButton episode={mockEpisode} />
      </li>
    );
    expect(container.querySelector('li')).toHaveAttribute('data-current');
  });
});
