import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import ShowNotes from 'starpod/src/components/episode/ShowNotes';
import Transcript from 'starpod/src/components/episode/Transcript';
import rehypeTranscriptTimestamps from 'starpod/src/lib/rehype-transcript-timestamps.mjs';
import { chipLabel, SEEK_CHIP_CLASS } from 'starpod/src/lib/seek-chip.mjs';

const episode = {
  id: 'ep-3',
  title: 'Chip Episode',
  audio: { src: 'a.mp3', type: 'audio/mpeg' },
  episodeNumber: '3',
  duration: 7200
};

function attributesOf(button: HTMLElement) {
  return {
    class: button.getAttribute('class'),
    seek: button.getAttribute('data-seek'),
    label: button.getAttribute('aria-label'),
    text: button.textContent
  };
}

describe('seek chips', () => {
  it('render identically from show notes, feed transcripts, and markdown transcripts', async () => {
    const expected = { class: SEEK_CHIP_CLASS, seek: '3723', label: 'Play from 1:02:03', text: '01:02:03' };

    const notes = render(
      <ShowNotes episode={episode}>
        <p>1:02:03 The good part</p>
      </ShowNotes>
    );
    const fromNotes = await screen.findByRole('button', { name: 'Play from 1:02:03' });
    expect(attributesOf(fromNotes)).toEqual(expected);
    notes.unmount();

    render(<Transcript episode={episode} paragraphs={[{ start: 3723, text: 'The good part' }]} />);
    expect(attributesOf(screen.getByRole('button', { name: 'Play from 1:02:03' }))).toEqual(expected);

    const tree = {
      type: 'root',
      children: [{ type: 'element', tagName: 'p', children: [{ type: 'text', value: '[01:02:03] The good part' }] }]
    };
    rehypeTranscriptTimestamps()(tree);
    // The chip heads the turn: p > span.ep-turn-head > button.
    const head = (tree.children[0] as unknown as { children: Array<{ children: Array<unknown> }> })
      .children[0];
    const button = head.children[0] as {
      properties: Record<string, unknown>;
      children: Array<{ value: string }>;
    };
    expect({
      class: (button.properties.className as Array<string>).join(' '),
      seek: button.properties['data-seek'],
      label: button.properties['aria-label'],
      text: button.children[0].value
    }).toEqual(expected);
  });

  it('labels every chip HH:MM:SS, whatever the time', () => {
    expect([0, 4, 852, 3723, 36000].map(chipLabel)).toEqual([
      '00:00:00',
      '00:00:04',
      '00:14:12',
      '01:02:03',
      '10:00:00'
    ]);
  });

  it('keeps the spoken label natural', async () => {
    render(<Transcript episode={episode} paragraphs={[{ start: 4, text: 'Hi' }]} />);
    const chip = screen.getByRole('button', { name: 'Play from 0:04' });
    expect(chip).toHaveTextContent('00:00:04');
    expect(chip.className).toContain('tabular-nums');
  });

  it('drops the brackets old show notes wrapped around chapter times', async () => {
    const { container } = render(
      <ShowNotes episode={episode}>
        <p>(00:00) Intro</p>
        <p>[01:02:03] Deep dive</p>
        <p>12:34 Bare time</p>
        <p>More on that (see 12:34 for details)</p>
        <p>Range (12:34 - 15:00) stays readable</p>
        <p>Mismatched (12:34] stays as written</p>
      </ShowNotes>
    );
    await screen.findAllByRole('button', { name: /^Play from/ });
    const lines = [...container.querySelectorAll('p')].map((p) =>
      [...p.childNodes]
        .map((node) => ((node as HTMLElement).tagName === 'BUTTON' ? '<chip>' : node.textContent))
        .join('')
    );
    expect(lines).toEqual([
      '<chip> Intro',
      '<chip> Deep dive',
      '<chip> Bare time',
      'More on that (see <chip> for details)',
      'Range (<chip> - <chip>) stays readable',
      'Mismatched (<chip>] stays as written'
    ]);
  });
});

