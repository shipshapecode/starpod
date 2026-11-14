import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import Dock from 'starpod/src/components/media/Dock';
import MediumSwitch from 'starpod/src/components/media/MediumSwitch';
import {
  activeMedium,
  currentEpisode,
  isPlaying,
  playEpisode,
  preferredMedium,
  setMedium
} from 'starpod/src/components/state';

const audioOnly = {
  id: 'ep-1',
  title: 'Audio Only Episode',
  audio: { src: 'a.mp3', type: 'audio/mpeg' },
  episodeNumber: '1',
  slug: 'audio-only-episode'
};

const withVideo = {
  ...audioOnly,
  id: 'ep-2',
  title: 'Video Episode',
  episodeNumber: '2',
  slug: 'video-episode',
  video: { src: 'v.m3u8', type: 'application/x-mpegURL' }
};

describe('Dock', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    isPlaying.value = false;
    setMedium('watch');
  });

  it('renders nothing until an episode is loaded', () => {
    const { container } = render(<Dock />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the loaded episode and toggles playback', () => {
    currentEpisode.value = audioOnly;
    render(<Dock />);

    expect(screen.getByText('Audio Only Episode')).toBeInTheDocument();
    expect(screen.getByText(/Listening/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(isPlaying.value).toBe(true);
  });

  it('offers Watch/Listen only for episodes with video', () => {
    currentEpisode.value = audioOnly;
    const { rerender } = render(<Dock />);
    expect(screen.queryByRole('radiogroup')).toBeNull();

    currentEpisode.value = withVideo;
    rerender(<Dock />);
    expect(screen.getByRole('radiogroup', { name: 'Watch or listen' })).toBeInTheDocument();
  });

  it('links to the episode page from the dock', () => {
    currentEpisode.value = withVideo;
    render(<Dock />);
    expect(screen.getByRole('link', { name: 'Open episode' })).toHaveAttribute(
      'href',
      '/video-episode'
    );
  });

  it('offers fullscreen on the floating video, not a switch to audio', () => {
    currentEpisode.value = withVideo;
    render(<Dock />);
    // The video floats because no stage holds it in this test.
    expect(screen.getByRole('button', { name: 'Fullscreen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Stop watching, keep listening' })).toBeNull();
  });
});

describe('medium preference', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    setMedium('watch');
  });

  it('plays audio for episodes without video, whatever the preference', () => {
    playEpisode(audioOnly);
    expect(activeMedium.value).toBe('listen');
  });

  it('follows the preference for episodes with video, and remembers it', () => {
    playEpisode(withVideo);
    expect(activeMedium.value).toBe('watch');

    render(<MediumSwitch />);
    fireEvent.click(screen.getByRole('radio', { name: 'Listen' }));
    expect(preferredMedium.value).toBe('listen');
    expect(activeMedium.value).toBe('listen');
    expect(localStorage.getItem('starpod:medium')).toBe('listen');
    expect(screen.getByRole('radio', { name: 'Listen' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });
});
