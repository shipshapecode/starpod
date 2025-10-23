import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import PlaybackRateButton from '../../src/components/player/PlaybackRateButton';
import { createRef } from 'preact';

// Mock audio element
const mockAudioElement = {
  playbackRate: 1,
  currentTime: 0,
  duration: 180
};

describe('PlaybackRateButton', () => {
  let audioPlayerRef: any;

  beforeEach(() => {
    mockAudioElement.playbackRate = 1;
    audioPlayerRef = createRef();
    audioPlayerRef.current = mockAudioElement;
  });

  it('renders with initial playback rate of 1x', () => {
    render(<PlaybackRateButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Playback rate');
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();
  });

  it('cycles through playback rates when clicked', () => {
    render(<PlaybackRateButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    // Initial state: 1x
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(mockAudioElement.playbackRate).toBe(1);

    // Click 1: should go to 1.2x
    fireEvent.click(button);
    expect(screen.getByText('1.2')).toBeInTheDocument();
    expect(mockAudioElement.playbackRate).toBe(1.2);

    // Click 2: should go to 1.5x
    fireEvent.click(button);
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(mockAudioElement.playbackRate).toBe(1.5);

    // Click 3: should go to 2x
    fireEvent.click(button);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(mockAudioElement.playbackRate).toBe(2);

    // Click 4: should cycle back to 1x
    fireEvent.click(button);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(mockAudioElement.playbackRate).toBe(1);
  });

  it('handles null audio player gracefully', () => {
    const nullRef = createRef();
    nullRef.current = null;

    render(<PlaybackRateButton audioPlayer={nullRef} />);

    const button = screen.getByRole('button');

    // Should render without crashing
    expect(button).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    // Clicking should not crash when audio player is null
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(screen.getByText('1.2')).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<PlaybackRateButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('gradient-icon');
    expect(button).toHaveClass('relative');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('focus:outline-hidden');
  });

  it('displays rate with x suffix correctly', () => {
    render(<PlaybackRateButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    // Test different rates maintain x suffix
    fireEvent.click(button); // 1.2x
    expect(screen.getByText('1.2')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();

    fireEvent.click(button); // 1.5x
    expect(screen.getByText('1.5')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();

    fireEvent.click(button); // 2x
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();
  });

  it('maintains state independently across renders', () => {
    const { rerender } = render(
      <PlaybackRateButton audioPlayer={audioPlayerRef} />
    );

    const button = screen.getByRole('button');

    // Change to 1.5x
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.getByText('1.5')).toBeInTheDocument();

    // Rerender should maintain the same state
    rerender(<PlaybackRateButton audioPlayer={audioPlayerRef} />);
    expect(screen.getByText('1.5')).toBeInTheDocument();
  });
});
