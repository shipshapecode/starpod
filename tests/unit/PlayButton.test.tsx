import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import PlayButton from '../../src/components/player/PlayButton';
import { currentEpisode, isPlaying } from '../../src/components/state';

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

describe('PlayButton', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    isPlaying.value = false;
  });

  it('renders play icon when not playing', () => {
    render(<PlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  it('renders pause icon when playing current episode', () => {
    currentEpisode.value = mockEpisode;
    isPlaying.value = true;

    render(<PlayButton episode={mockEpisode} />);

    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('starts playing when clicked on a new episode', () => {
    render(<PlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(currentEpisode.value).toEqual(mockEpisode);
    expect(isPlaying.value).toBe(true);
  });

  it('toggles play/pause when clicked on current episode', () => {
    currentEpisode.value = mockEpisode;
    isPlaying.value = true;

    render(<PlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(currentEpisode.value).toEqual(mockEpisode);
    expect(isPlaying.value).toBe(false);
  });

  it('switches to new episode when clicked while another episode is playing', () => {
    currentEpisode.value = mockEpisode;
    isPlaying.value = true;

    render(<PlayButton episode={mockEpisode2} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(currentEpisode.value).toEqual(mockEpisode2);
    expect(isPlaying.value).toBe(true);
  });

  it('renders without episode prop and shows play/pause based on global state', () => {
    isPlaying.value = false;

    render(<PlayButton />);

    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  it('toggles global playing state when no episode provided', () => {
    isPlaying.value = false;

    render(<PlayButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(isPlaying.value).toBe(true);
    expect(currentEpisode.value).toBeNull();
  });

  it('shows pause icon when no episode provided but globally playing', () => {
    isPlaying.value = true;

    render(<PlayButton />);

    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Play')).toBeInTheDocument();
  });
});
