// Rehype plugin that turns bracketed transcript timestamps like `[00:01:23]`
// or `[04:12]` into clickable buttons that seek the audio player. Only the
// markdown transcripts in `src/content/transcripts` contain this pattern, so
// this plugin effectively only affects them.
//
// Each timestamp becomes the shared seek chip (`seek-chip.mjs`), the same
// one show notes and feed transcripts use; the client-side markdown
// transcript island reads `data-seek` to drive the player.
import { seekChipAttributes } from './seek-chip.mjs';

const TIMESTAMP = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g;

function toSeconds(hours, minutes, seconds) {
  // `[MM:SS]` arrives as (minutes, seconds) with `seconds` undefined.
  return seconds === undefined
    ? Number(hours) * 60 + Number(minutes)
    : Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function timestampButton(seconds) {
  const { label, class: className, ...attributes } = seekChipAttributes(seconds);
  return {
    type: 'element',
    tagName: 'button',
    properties: { ...attributes, className: [className] },
    children: [{ type: 'text', value: label }]
  };
}

function splitTextNode(value) {
  const nodes = [];
  let lastIndex = 0;
  let match;

  TIMESTAMP.lastIndex = 0;
  while ((match = TIMESTAMP.exec(value)) !== null) {
    const [label, a, b, c] = match;
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
    }
    nodes.push(timestampButton(toSeconds(a, b, c)));
    lastIndex = match.index + label.length;
  }

  if (lastIndex < value.length) {
    nodes.push({ type: 'text', value: value.slice(lastIndex) });
  }

  return nodes;
}

function transform(node) {
  if (!node.children || node.children.length === 0) {
    return;
  }

  const nextChildren = [];
  for (const child of node.children) {
    if (
      child.type === 'text' &&
      // Cheap guard so we only rebuild text nodes that actually contain a
      // timestamp.
      child.value.includes('[') &&
      TIMESTAMP.test(child.value)
    ) {
      nextChildren.push(...splitTextNode(child.value));
    } else {
      transform(child);
      nextChildren.push(child);
    }
  }

  node.children = nextChildren;
}

export default function rehypeTranscriptTimestamps() {
  return (tree) => {
    transform(tree);
  };
}
