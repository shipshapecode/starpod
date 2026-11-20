import { act, fireEvent, render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';

const answers = new Map<string, (cues: Array<{ s: number; t: string; n?: string }>) => void>();
vi.mock('starpod/src/components/media/cue-cache', () => ({
  loadCues: vi.fn((slug: string) => new Promise((resolve) => answers.set(slug, resolve))),
  cueIndexAt: () => 0
}));
vi.mock('starpod/src/components/media/engine', () => ({ seek: vi.fn() }));

import Scrubber from 'starpod/src/components/media/Scrubber';

const episode = (slug: string) => ({
  id: slug,
  slug,
  title: `Episode ${slug}`,
  audio: { src: `${slug}.mp3`, type: 'audio/mpeg' },
  episodeNumber: '1'
});

/** Touch the track: on touch the preview follows the finger. */
function preview(input: HTMLInputElement) {
  input.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 10 }) as DOMRect;
  fireEvent.pointerDown(input, { pointerType: 'touch', clientX: 5 });
}

describe('Scrubber', () => {
  it("previews the line under the finger from the episode's transcript", async () => {
    const { container } = render(<Scrubber duration={100} episode={episode('a')} time={0} />);
    const input = container.querySelector('input')!;
    fireEvent.pointerEnter(input);
    await act(async () => answers.get('a')!([{ s: 0, t: 'A line from A', n: 'Host' }]));
    preview(input);
    expect(screen.getByText('A line from A')).toBeInTheDocument();
  });

  it("trails the original player's ship particles beside the track, hidden from assistive technology", () => {
    const { container } = render(<Scrubber duration={100} episode={episode('d')} time={40} />);
    const particles = container.querySelector('input + .ship-particles')!;
    expect(particles.getAttribute('aria-hidden')).toBe('true');
    expect(particles.children).toHaveLength(5);
  });

  it('drops cues that arrive after the episode has changed', async () => {
    const { container, rerender } = render(<Scrubber duration={100} episode={episode('b')} time={0} />);
    const input = container.querySelector('input')!;
    fireEvent.pointerEnter(input);
    rerender(<Scrubber duration={100} episode={episode('c')} time={0} />);
    await act(async () => answers.get('b')!([{ s: 0, t: 'A line from B', n: 'Host' }]));
    preview(input);
    expect(screen.queryByText('A line from B')).toBeNull();
  });
});
