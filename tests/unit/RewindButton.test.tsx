import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import RewindButton from '../../src/components/player/RewindButton';
import { createRef } from 'preact';

// Mock audio element
const mockAudioElement = {
  currentTime: 60,
  duration: 180
};

describe('RewindButton', () => {
  let audioPlayerRef: any;

  beforeEach(() => {
    mockAudioElement.currentTime = 60;
    audioPlayerRef = createRef();
    audioPlayerRef.current = mockAudioElement;
  });

  it('renders rewind button with correct label', () => {
    render(<RewindButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Rewind 10 seconds');
  });

  it('rewinds audio by 10 seconds when clicked', () => {
    render(<RewindButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    expect(mockAudioElement.currentTime).toBe(60);

    fireEvent.click(button);
    expect(mockAudioElement.currentTime).toBe(50);

    fireEvent.click(button);
    expect(mockAudioElement.currentTime).toBe(40);
  });

  it('handles null audio player gracefully', () => {
    const nullRef = createRef();
    nullRef.current = null;

    render(<RewindButton audioPlayer={nullRef} />);

    const button = screen.getByRole('button');

    // Should render without crashing
    expect(button).toBeInTheDocument();

    // Clicking should not crash when audio player is null
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('has proper styling classes', () => {
    render(<RewindButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('rewind-button');
    expect(button).toHaveClass('gradient-icon');
    expect(button).toHaveClass('relative');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('focus:outline-hidden');
  });

  it('subtracts 10 seconds even near track beginning (browser handles clamping)', () => {
    mockAudioElement.currentTime = 5; // Near beginning

    render(<RewindButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    // Current implementation just subtracts 10 seconds without bounds checking
    // In a real browser, the audio element would clamp this to 0
    expect(mockAudioElement.currentTime).toBe(-5);
  });

  it('allows rewinding from any current position', () => {
    mockAudioElement.currentTime = 120;

    render(<RewindButton audioPlayer={audioPlayerRef} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockAudioElement.currentTime).toBe(110);
  });
});
