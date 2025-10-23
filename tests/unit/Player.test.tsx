import { render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Player from '../../src/components/Player';
import { currentEpisode, isPlaying, isMuted } from '../../src/components/state';

const mockEpisode = {
  id: 'test-episode-1',
  title: 'Test Episode',
  audio: { src: 'test.mp3', type: 'audio/mpeg' },
  episodeNumber: '1'
};

// Mock audio element
class MockAudio {
  src = '';
  currentTime = 0;
  duration = 180;
  playbackRate = 1;
  paused = true;
  muted = false;

  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();

  constructor() {
    Object.defineProperty(this, 'duration', {
      get: () => this.duration,
      set: (value) => {
        this.duration = value;
      }
    });
  }
}

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});
global.cancelAnimationFrame = vi.fn();

// Mock querySelector for DOM manipulation
const mockSlider = {
  clientWidth: 400,
  style: {
    setProperty: vi.fn()
  }
};

const mockParticles = {
  style: {
    setProperty: vi.fn()
  }
};

global.document.querySelector = vi.fn((selector) => {
  if (selector === '.slider') return mockSlider;
  if (selector === '.ship-particles') return mockParticles;
  return null;
});

describe('Player', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    isPlaying.value = false;
    isMuted.value = false;
    vi.clearAllMocks();

    // Mock HTMLAudioElement
    global.HTMLAudioElement = MockAudio as any;
  });

  it('returns early when no current episode', () => {
    currentEpisode.value = null;

    const result = render(<Player />);
    expect(result.container.firstChild).toBeNull();
  });

  it('renders player with current episode', () => {
    currentEpisode.value = mockEpisode;

    render(<Player />);

    expect(screen.getByText('Test Episode')).toBeInTheDocument();
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('displays episode link with correct href', () => {
    currentEpisode.value = mockEpisode;

    render(<Player />);

    const link = screen.getByRole('link', { name: 'Test Episode' });
    expect(link).toHaveAttribute('href', '/1');
  });

  it('renders all player controls', () => {
    currentEpisode.value = mockEpisode;

    render(<Player />);

    // Should have play buttons (one hidden on desktop, one hidden on mobile)
    const playButtons = screen.getAllByLabelText(/play|pause/i);
    expect(playButtons.length).toBeGreaterThan(0);

    // Should have forward and rewind buttons
    expect(
      screen.getByLabelText('Fast-forward 10 seconds')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Rewind 10 seconds')).toBeInTheDocument();

    // Should have mute buttons (one hidden on desktop, one hidden on mobile)
    const muteButtons = screen.getAllByLabelText(/mute|unmute/i);
    expect(muteButtons.length).toBeGreaterThan(0);

    // Should have playback rate button
    expect(screen.getByLabelText('Playback rate')).toBeInTheDocument();

    // Should have slider
    expect(screen.getByLabelText('audio timeline')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    currentEpisode.value = mockEpisode;

    render(<Player />);

    const player = screen.getByRole('region');
    expect(player).toBeInTheDocument();

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(slider).toHaveAttribute('aria-label', 'audio timeline');
  });

  it('renders audio element', () => {
    currentEpisode.value = mockEpisode;

    const { container } = render(<Player />);

    // Audio element should exist in the component tree
    const audioElement = container.querySelector('audio');
    expect(audioElement).toBeTruthy();
  });

  it('applies view transition name for animations', () => {
    currentEpisode.value = mockEpisode;

    render(<Player />);

    const playerContainer = screen.getByRole('region');
    expect(playerContainer).toHaveStyle({ viewTransitionName: 'player' });
  });

  it('truncates long episode titles', () => {
    const longTitleEpisode = {
      ...mockEpisode,
      title:
        'This is a very long episode title that should be truncated when displayed in the player'
    };
    currentEpisode.value = longTitleEpisode;

    render(<Player />);

    const titleLink = screen.getByRole('link');
    expect(titleLink).toHaveClass('truncate');
    expect(titleLink).toHaveAttribute('title', longTitleEpisode.title);
  });
});
