import { describe, expect, it } from 'vitest';

import rehypeTranscriptTimestamps from 'starpod/src/lib/rehype-transcript-timestamps.mjs';
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

  it('preserves surrounding text and sibling elements around the timestamp', () => {
    const tree = run(
      paragraph(
        text('[00:00:15] '),
        { type: 'element', tagName: 'strong', children: [text('Chuck:')] },
        text(' welcome')
      )
    );

    const p = tree.children![0];
    // button, " ", <strong>, " welcome"
    expect(p.children?.map((c) => c.tagName ?? c.type)).toEqual([
      'button',
      'text',
      'strong',
      'text'
    ]);
    expect(p.children?.[2]?.children?.[0]?.value).toBe('Chuck:');
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
});
