import { describe, expect, it } from 'vitest';

import rehypeTranscriptTimestamps, {
  LONG_TURN,
  TURNS_PER_GROUP
} from 'starpod/src/lib/rehype-transcript-timestamps.mjs';
import { SEEK_CHIP_CLASS } from 'starpod/src/lib/seek-chip.mjs';

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Array<HastNode>;
};

function run(tree: HastNode) {
  rehypeTranscriptTimestamps()(tree);
  return tree;
}

function paragraph(...children: Array<HastNode>): HastNode {
  return { type: 'root', children: [{ type: 'element', tagName: 'p', children }] };
}

function text(value: string): HastNode {
  return { type: 'text', value };
}

function buttonsIn(tree: HastNode): Array<HastNode> {
  const found: Array<HastNode> = [];
  const walk = (node: HastNode) => {
    if (node.tagName === 'button') found.push(node);
    node.children?.forEach(walk);
  };
  walk(tree);
  return found;
}

describe('rehypeTranscriptTimestamps', () => {
  it('converts an [HH:MM:SS] timestamp into a seek button with the right offset', () => {
    const tree = run(paragraph(text('[00:01:23] hello')));
    const [button] = buttonsIn(tree);

    expect(button.tagName).toBe('button');
    expect(button.properties?.['data-seek']).toBe('83');
    expect(button.properties?.['aria-label']).toBe('Play from 1:23');
    // The shared seek chip: same class and clock label as show notes and
    // feed transcripts.
    expect(button.properties?.className).toEqual([SEEK_CHIP_CLASS]);
    expect(button.children?.[0]?.value).toBe('00:01:23');
  });

  it('converts an [MM:SS] timestamp (no hours) into the right offset', () => {
    const tree = run(paragraph(text('[04:12] hello')));
    const [button] = buttonsIn(tree);

    expect(button.properties?.['data-seek']).toBe('252');
    expect(button.children?.[0]?.value).toBe('00:04:12');
  });

  it('makes a paragraph that opens with a timestamp a turn: the chip and speaker head it', () => {
    const tree = run(
      paragraph(
        text('\u200b[00:00:15] '),
        { type: 'element', tagName: 'strong', children: [text('Chuck:')] },
        text(' welcome')
      )
    );

    const p = tree.children![0];
    expect(p.properties?.className).toEqual(['ep-turn']);
    const [head, words] = p.children!;
    expect(head.properties).toEqual({ className: ['ep-turn-head'], dataSpeaker: 'Chuck' });
    expect(head.children?.map((c) => c.tagName)).toEqual(['button', 'strong']);
    // In the gutter the name stands alone, without its colon.
    expect(head.children?.[1]?.children?.[0]?.value).toBe('Chuck');
    expect(words.properties).toEqual({ className: ['ep-turn-text'] });
    expect(words.children?.map((c) => c.value)).toEqual([' welcome']);
  });

  it('heads a turn with the chip alone when no bold speaker follows it', () => {
    const tree = run(paragraph(text('[00:00:15] Chuck: welcome')));

    const [head, words] = tree.children![0].children!;
    expect(head.children?.map((c) => c.tagName)).toEqual(['button']);
    expect(head.properties?.dataSpeaker).toBeUndefined();
    expect(words.children?.[0]?.value).toBe(' Chuck: welcome');
  });

  it('marks a turn long enough for its head to stick', () => {
    const long = run(paragraph(text(`[00:00:15] ${'word '.repeat(LONG_TURN / 5 + 1)}`)));
    const short = run(paragraph(text('[00:00:15] a few words')));

    expect(long.children![0].properties?.dataLong).toBe('');
    expect(short.children![0].properties?.dataLong).toBeUndefined();
  });

  it('groups a long transcript into runs of turns', () => {
    const lines = Array.from({ length: TURNS_PER_GROUP + 2 }, (_, index) => ({
      type: 'element',
      tagName: 'p',
      children: [text(`[00:00:${String(index % 60).padStart(2, '0')}] line ${index}`)]
    }));
    const tree = run({ type: 'root', children: lines });

    expect(tree.children!.map((group) => group.properties?.className)).toEqual([
      ['ep-turns'],
      ['ep-turns']
    ]);
    expect(tree.children!.map((group) => group.children!.length)).toEqual([TURNS_PER_GROUP, 2]);
    // A short transcript is left as it is.
    expect(run(paragraph(text('[00:00:01] hi'))).children![0].tagName).toBe('p');
  });

  it('leaves a timestamp in the middle of a paragraph inline', () => {
    const tree = run(paragraph(text('and then [00:00:15] welcome')));

    const p = tree.children![0];
    expect(p.properties?.className).toBeUndefined();
    expect(p.children?.map((c) => c.tagName ?? c.type)).toEqual(['text', 'button', 'text']);
  });

  it('converts every timestamp within a single text node', () => {
    const tree = run(paragraph(text('[00:00:01] a [00:00:05] b')));
    const buttons = buttonsIn(tree);

    expect(buttons.map((b) => b.properties?.['data-seek'])).toEqual(['1', '5']);
  });

  it('converts timestamps across sibling text nodes (no regex state leaks between them)', () => {
    const tree = run(
      paragraph(text('[00:00:01] first'), text('[00:00:05] second'))
    );
    const buttons = buttonsIn(tree);

    expect(buttons.map((b) => b.properties?.['data-seek'])).toEqual(['1', '5']);
  });

  it('leaves text without timestamps untouched', () => {
    const tree = run(paragraph(text('no timestamps here')));

    expect(buttonsIn(tree)).toHaveLength(0);
    expect(tree.children![0].children?.[0]?.value).toBe('no timestamps here');
  });

  it('labels every chip HH:MM:SS, so they line up', () => {
    const tree = run({
      type: 'root',
      children: ['[00:00:04] start', '[00:14:12] middle', '[01:02:03] end'].map((line) => ({
        type: 'element',
        tagName: 'p',
        children: [text(line)]
      }))
    });
    expect(buttonsIn(tree).map((b) => b.children?.[0]?.value)).toEqual([
      '00:00:04',
      '00:14:12',
      '01:02:03'
    ]);
  });

  it('keeps a turn\'s &, <, > and quotes as text, for the page to escape once', () => {
    const tree = run(
      paragraph(text('[00:01:05] '), {
        type: 'element',
        tagName: 'strong',
        children: [text('Jev:')]
      }, text(' Web & Whatnot says <b> > "bold" & \'87%\''))
    );
    const values: Array<string> = [];
    const walk = (node: HastNode) => {
      if (node.type === 'raw') throw new Error('raw HTML in a turn');
      if (node.type === 'text' && node.value) values.push(node.value);
      node.children?.forEach(walk);
    };
    walk(tree);
    expect(values.join('')).toContain(' Web & Whatnot says <b> > "bold" & \'87%\'');
  });
});
