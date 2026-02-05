import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import Slider from '../../src/components/player/Slider';
import { createRef } from 'preact';

// Mock audio element
const mockAudioElement = {
  currentTime: 60,
  duration: 180
};

describe('Slider', () => {
  let audioPlayerRef: any;

  beforeEach(() => {
    mockAudioElement.currentTime = 60;
    mockAudioElement.duration = 180;
    audioPlayerRef = createRef();
    audioPlayerRef.current = mockAudioElement;
  });

  it('renders slider with correct attributes', () => {
    render(<Slider audioPlayer={audioPlayerRef} currentTime={60} />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-label', 'audio timeline');
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('max', '180');
  });

  it('displays correct aria values', () => {
    render(<Slider audioPlayer={audioPlayerRef} currentTime={60} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '180');
    expect(slider).toHaveAttribute('aria-valuenow', '60');
    expect(slider).toHaveAttribute('aria-valuetext', '60 seconds');
  });

  it('updates current time when slider is moved', () => {
    render(<Slider audioPlayer={audioPlayerRef} currentTime={60} />);

    const slider = screen.getByRole('slider') as HTMLInputElement;

    // Simulate moving slider to 90 seconds
    fireEvent.input(slider, { target: { value: '90' } });

    expect(mockAudioElement.currentTime).toBe(90);
  });

  it('handles null audio player gracefully', () => {
    const nullRef = createRef();
    nullRef.current = null;

    render(<Slider audioPlayer={nullRef} currentTime={0} />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuemax', '0');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });

  it('displays time information on desktop', () => {
    const { container } = render(
      <Slider audioPlayer={audioPlayerRef} currentTime={60} />
    );

    // Time display should be present (but may be hidden on mobile)
    const timeSpan = container.querySelector('span.text-sm');
    expect(timeSpan).toBeInTheDocument();
    expect(timeSpan?.textContent).toContain('01:00');
    expect(timeSpan?.textContent).toContain('03:00');
  });

  it('handles zero duration gracefully', () => {
    mockAudioElement.duration = 0;
    mockAudioElement.currentTime = 0;

    render(<Slider audioPlayer={audioPlayerRef} currentTime={0} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemax', '0');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });

  it('formats time correctly for different durations', () => {
    // Test with hours
    mockAudioElement.currentTime = 3661; // 1:01:01
    mockAudioElement.duration = 7200; // 2:00:00

    const { container } = render(
      <Slider audioPlayer={audioPlayerRef} currentTime={3661} />
    );

    // Check that time is formatted correctly with hours
    const timeSpan = container.querySelector('span.text-sm');
    expect(timeSpan?.textContent).toContain('01:01:01');
    expect(timeSpan?.textContent).toContain('02:00:00');
  });

  it('formats time without leading zeros appropriately', () => {
    mockAudioElement.currentTime = 65; // 1:05
    mockAudioElement.duration = 600; // 10:00

    const { container } = render(
      <Slider audioPlayer={audioPlayerRef} currentTime={65} />
    );

    // Check that time is formatted without unnecessary leading zeros
    const timeSpan = container.querySelector('span.text-sm');
    expect(timeSpan?.textContent).toContain('01:05');
    expect(timeSpan?.textContent).toContain('10:00');
  });

  it('renders particle animation elements', () => {
    render(<Slider audioPlayer={audioPlayerRef} currentTime={60} />);

    const particles = document.querySelector('.ship-particles');
    expect(particles).toBeInTheDocument();

    // Should have 5 particle dots
    const dots = particles?.querySelectorAll('.rounded-full');
    expect(dots).toHaveLength(5);
  });

  it('calculates seek position correctly for different time values', () => {
    render(<Slider audioPlayer={audioPlayerRef} currentTime={0} />);

    const slider = screen.getByRole('slider') as HTMLInputElement;

    // Test seeking to 0 seconds
    fireEvent.input(slider, { target: { value: '0' } });
    expect(mockAudioElement.currentTime).toBe(0);

    // Test seeking to 180 seconds (end of track)
    fireEvent.input(slider, { target: { value: '180' } });
    expect(mockAudioElement.currentTime).toBe(180);

    // Test seeking to 45 seconds
    fireEvent.input(slider, { target: { value: '45' } });
    expect(mockAudioElement.currentTime).toBe(45);
  });
});
