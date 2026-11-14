import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dock from 'starpod/src/components/media/Dock';
import PlayGlyph from 'starpod/src/components/media/PlayGlyph';
import {
  activeMedium,
  currentEpisode,
  isMuted,
  isPlaying,
  setMedium
} from 'starpod/src/components/state';

const episode = {
  id: 'ep-9',
  title: 'Keyboard Episode',
  audio: { src: 'a.mp3', type: 'audio/mpeg' },
  episodeNumber: '9',
  slug: 'keyboard-episode',
  duration: 600,
  video: { src: 'v.m3u8', type: 'application/x-mpegURL' }
};

function press(key: string, target: EventTarget = document.body) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

describe('keyboard shortcuts', () => {
  beforeEach(() => {
    currentEpisode.value = episode;
    isPlaying.value = false;
    isMuted.value = false;
    setMedium('watch');
    // Rendering the dock (inside its layout wrapper) starts the engine,
    // which installs the shortcuts.
    render(
      <div class="dock">
        <Dock />
      </div>
    );
  });

  it('plays and pauses with K, and flashes the play control', async () => {
    press('k');
    expect(isPlaying.value).toBe(true);
    expect(await screen.findByRole('button', { name: 'Pause' })).toHaveAttribute('data-flash');
    press('k');
    expect(isPlaying.value).toBe(false);
  });

  it('mutes with M and switches to listening with W', () => {
    press('m');
    expect(isMuted.value).toBe(true);
    press('w');
    expect(activeMedium.value).toBe('listen');
  });

  it('leaves keys alone while typing', () => {
    const input = document.createElement('input');
    document.body.append(input);
    press('k', input);
    expect(isPlaying.value).toBe(false);
    input.remove();
  });

  it('labels the transport with its keys', () => {
    expect(screen.getByRole('button', { name: 'Forward 30 seconds' })).toHaveAttribute(
      'aria-keyshortcuts',
      'L'
    );
  });
});

describe('scrubber preview', () => {
  beforeEach(() => {
    currentEpisode.value = episode;
    isPlaying.value = false;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => [
          { s: 0, t: 'Welcome to the show.', v: 0, n: 'Robbie' },
          { s: 300, t: 'Halfway there.', v: 1, n: 'Adam' }
        ]
      }))
    );
  });

  it('shows the time and the line spoken under the pointer', async () => {
    render(<Dock />);
    const scrubber = screen.getByRole('slider', { name: 'Seek' });
    scrubber.getBoundingClientRect = () =>
      ({ left: 0, width: 600, top: 800, right: 600, bottom: 810, height: 10 }) as DOMRect;

    fireEvent.pointerEnter(scrubber, { pointerType: 'mouse' });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/cues/keyboard-episode.json'));
    fireEvent.pointerMove(scrubber, { clientX: 320, pointerType: 'mouse' });

    const preview = await vi.waitFor(() => {
      const element = document.querySelector('.scrub-preview[data-open]');
      expect(element).not.toBeNull();
      return element!;
    });
    await vi.waitFor(() => expect(preview.textContent).toContain('Halfway there.'));
    expect(preview.textContent).toContain('5:20');
    expect(preview.textContent).toContain('Adam');

    fireEvent.pointerLeave(scrubber, { pointerType: 'mouse' });
    expect(document.querySelector('.scrub-preview[data-open]')).toBeNull();
  });
});

describe('PlayGlyph', () => {
  it('springs only when the state changes, not on first paint', () => {
    const { container, rerender } = render(<PlayGlyph playing={false} size={18} />);
    expect(container.querySelector('.glyph')).not.toHaveAttribute('data-swap');
    rerender(<PlayGlyph playing size={18} />);
    expect(container.querySelector('.glyph')).toHaveAttribute('data-swap');
  });

  it('shows on-air levels while playing', () => {
    const { container } = render(<PlayGlyph onAir playing size={18} />);
    expect(container.querySelectorAll('.onair i')).toHaveLength(3);
  });
});
