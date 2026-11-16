import { describe, expect, it } from 'vitest';
import {
  jsonSegments,
  mergeIntoLines,
  parseMarkdownCues
} from 'starpod/src/lib/cues';

describe('parseMarkdownCues', () => {
  const markdown = [
    '[00:00:00] **Intro:** Welcome to the show. Pour a glass.',
    '[00:00:10] **Robbie Wagner:** Hey everybody. Good to be here.',
    '[00:00:20] **Adam Argyle:** Hi. I brought *the* whiskey.',
    '[00:00:30] **Robbie Wagner:** Great.',
    '[00:00:40] **Adam Argyle:** Cheers.'
  ].join('\n\n');
  const cues = parseMarkdownCues(markdown);

  it('reads Windows (CRLF) line endings the same way', () => {
    expect(parseMarkdownCues(markdown.replace(/\n/g, '\r\n'))).toEqual(cues);
  });

  it('reads bold speaker names and strips inline markdown', () => {
    expect(cues[0].n).toBe('Intro');
    expect(cues.find((cue) => cue.t.includes('brought'))?.t).toBe(
      'Hi. I brought the whiskey.'
    );
  });

  it('gives the two people who talk most the two signature voices', () => {
    const voiceOf = (name: string) => cues.find((cue) => cue.n === name)?.v;
    expect(voiceOf('Robbie Wagner')).toBe(0);
    expect(voiceOf('Adam Argyle')).toBe(1);
    expect(voiceOf('Intro')).toBe(2);
  });

  it('spreads sentences across their paragraph instead of stacking them', () => {
    const starts = cues.map((cue) => cue.s);
    expect(new Set(starts).size).toBe(starts.length);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});

describe('mergeIntoLines', () => {
  it('leaves voice unset for captions without speakers', () => {
    const lines = mergeIntoLines([
      { start: 0, text: 'Hello there.' },
      { start: 2, text: 'General Kenobi.' }
    ]);
    expect(lines.every((line) => line.v === undefined)).toBe(true);
  });

  it('starts a new line when the speaker changes', () => {
    const lines = mergeIntoLines([
      { start: 0, text: 'One', speaker: 'A' },
      { start: 1, text: 'two', speaker: 'A' },
      { start: 2, text: 'Three', speaker: 'B' }
    ]);
    expect(lines.map((line) => line.t)).toEqual(['One two', 'Three']);
  });
});

describe('jsonSegments', () => {
  it('reads the Podcast Namespace startTime/body fields', () => {
    expect(
      jsonSegments({ segments: [{ startTime: 0.5, body: ' Hello ', speaker: 'Alice' }] })
    ).toEqual([{ start: 0.5, text: 'Hello', speaker: 'Alice' }]);
  });

  it('also reads start/text, and drops segments without a time or text', () => {
    expect(
      jsonSegments({
        segments: [
          { start: 2, text: 'Hi' },
          { start: 3, text: '   ' },
          { text: 'No time' }
        ]
      })
    ).toEqual([{ start: 2, text: 'Hi', speaker: undefined }]);
  });
});
