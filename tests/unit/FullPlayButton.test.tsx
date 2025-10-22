import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import FullPlayButton from '../../src/components/FullPlayButton';
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

describe('FullPlayButton', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    isPlaying.value = false;
  });

  it('renders nothing when episode is null', () => {
    const { container } = render(<FullPlayButton episode={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders play button when not playing', () => {
    render(<FullPlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Play Episode')).toBeInTheDocument();
  });

  it('renders pause button when playing current episode', () => {
    currentEpisode.value = mockEpisode;
    isPlaying.value = true;

    render(<FullPlayButton episode={mockEpisode} />);

    expect(screen.getByText('Pause Episode')).toBeInTheDocument();
  });

  it('starts playing when clicked on a new episode', () => {
    render(<FullPlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(currentEpisode.value).toEqual({
      id: mockEpisode.id,
      title: mockEpisode.title,
      audio: mockEpisode.audio,
      episodeNumber: mockEpisode.episodeNumber
    });
    expect(isPlaying.value).toBe(true);
  });

  it('toggles play/pause when clicked on current episode', () => {
    currentEpisode.value = {
      id: mockEpisode.id,
      title: mockEpisode.title,
      audio: mockEpisode.audio,
      episodeNumber: mockEpisode.episodeNumber
    };
    isPlaying.value = true;

    render(<FullPlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(isPlaying.value).toBe(false);
  });

  it('switches to new episode when clicked while another episode is playing', () => {
    currentEpisode.value = {
      id: mockEpisode.id,
      title: mockEpisode.title,
      audio: mockEpisode.audio,
      episodeNumber: mockEpisode.episodeNumber
    };
    isPlaying.value = true;

    render(<FullPlayButton episode={mockEpisode2} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(currentEpisode.value).toEqual({
      id: mockEpisode2.id,
      title: mockEpisode2.title,
      audio: mockEpisode2.audio,
      episodeNumber: mockEpisode2.episodeNumber
    });
    expect(isPlaying.value).toBe(true);
  });

  it('has proper accessibility attributes', () => {
    render(<FullPlayButton episode={mockEpisode} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    const srOnly = screen.getByText('(press to play)');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveClass('sr-only');
  });

  it('updates accessibility text for pause state', () => {
    currentEpisode.value = {
      id: mockEpisode.id,
      title: mockEpisode.title,
      audio: mockEpisode.audio,
      episodeNumber: mockEpisode.episodeNumber
    };
    isPlaying.value = true;

    render(<FullPlayButton episode={mockEpisode} />);

    const srOnly = screen.getByText('(press to pause)');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveClass('sr-only');
  });

  it('sets currentEpisode with only required fields', () => {
    const episodeWithExtraFields = {
      ...mockEpisode,
      extraField: 'should not be included',
      published: 1234567890,
      description: 'Episode description'
    };

    render(<FullPlayButton episode={episodeWithExtraFields} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(currentEpisode.value).toEqual({
      id: mockEpisode.id,
      title: mockEpisode.title,
      audio: mockEpisode.audio,
      episodeNumber: mockEpisode.episodeNumber
    });
    expect(currentEpisode.value).not.toHaveProperty('extraField');
    expect(currentEpisode.value).not.toHaveProperty('published');
    expect(currentEpisode.value).not.toHaveProperty('description');
  });
});
