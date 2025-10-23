import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import ForwardButton from '../../src/components/player/ForwardButton';
import { createRef } from 'preact';

// Mock audio element
const mockAudioElement = {
  currentTime: 0,
  duration: 180
};

describe('ForwardButton', () => {
  let audioPlayerRef: any;

  beforeEach(() => {
    mockAudioElement.currentTime = 0;
    audioPlayerRef = createRef();
    audioPlayerRef.current = mockAudioElement;
  });

  it('renders forward button with correct label', () => {
    render(<ForwardButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Fast-forward 10 seconds');
  });

  it('advances audio by 10 seconds when clicked', () => {
    render(<ForwardButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    expect(mockAudioElement.currentTime).toBe(0);

    fireEvent.click(button);
    expect(mockAudioElement.currentTime).toBe(10);

    fireEvent.click(button);
    expect(mockAudioElement.currentTime).toBe(20);
  });

  it('handles null audio player gracefully', () => {
    const nullRef = createRef();
    nullRef.current = null;

    render(<ForwardButton audioPlayer={nullRef} />);

    const button = screen.getByRole('button');

    // Should render without crashing
    expect(button).toBeInTheDocument();

    // Clicking should not crash when audio player is null
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('has proper styling classes', () => {
    render(<ForwardButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('forward-button');
    expect(button).toHaveClass('gradient-icon');
    expect(button).toHaveClass('relative');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('focus:outline-hidden');
  });

  it('allows forwarding from any current position', () => {
    mockAudioElement.currentTime = 45;

    render(<ForwardButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockAudioElement.currentTime).toBe(55);
  });

  it('adds 10 seconds even near track end (browser handles clamping)', () => {
    mockAudioElement.currentTime = 175; // Near end of 180 second track

    render(<ForwardButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    // Current implementation just adds 10 seconds without bounds checking
    // In a real browser, the audio element would clamp this to duration
    expect(mockAudioElement.currentTime).toBe(185);
  });
});
