import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import MuteButton from '../../src/components/player/MuteButton';
import { isMuted } from '../../src/components/state';

describe('MuteButton', () => {
  beforeEach(() => {
    isMuted.value = false;
  });

  it('renders mute button when not muted', () => {
    render(<MuteButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Mute');
    expect(button).toHaveClass('mute-button');
    expect(button).not.toHaveClass('unmute-button');
  });

  it('renders unmute button when muted', () => {
    isMuted.value = true;

    render(<MuteButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Unmute');
    expect(button).toHaveClass('unmute-button');
    expect(button).not.toHaveClass('mute-button');
  });

  it('toggles mute state when clicked', () => {
    render(<MuteButton />);

    const button = screen.getByRole('button');

    expect(isMuted.value).toBe(false);
    expect(button).toHaveAttribute('aria-label', 'Mute');

    fireEvent.click(button);

    expect(isMuted.value).toBe(true);
    expect(button).toHaveAttribute('aria-label', 'Unmute');

    fireEvent.click(button);

    expect(isMuted.value).toBe(false);
    expect(button).toHaveAttribute('aria-label', 'Mute');
  });

  it('has proper styling classes', () => {
    render(<MuteButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('gradient-icon');
    expect(button).toHaveClass('group');
    expect(button).toHaveClass('relative');
  });

  it('updates class when mute state changes externally', () => {
    const { rerender } = render(<MuteButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('mute-button');

    // Change state externally
    isMuted.value = true;
    rerender(<MuteButton />);

    expect(button).toHaveClass('unmute-button');
    expect(button).not.toHaveClass('mute-button');
  });

  it('maintains proper button type', () => {
    render(<MuteButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
