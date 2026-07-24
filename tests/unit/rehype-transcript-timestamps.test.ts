import { describe, expect, it } from 'vitest';

import rehypeTranscriptTimestamps from '../../src/lib/rehype-transcript-timestamps.mjs';

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
    expect(button.properties?.['aria-label']).toBe('Play from [00:01:23]');
    // The visible label keeps the original bracketed timestamp.
    expect(button.children?.[0]?.value).toBe('[00:01:23]');
  });

  it('converts an [MM:SS] timestamp (no hours) into the right offset', () => {
    const tree = run(paragraph(text('[04:12] hello')));
    const [button] = buttonsIn(tree);

    expect(button.properties?.['data-seek']).toBe('252');
    expect(button.children?.[0]?.value).toBe('[04:12]');
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
});
