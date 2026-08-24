// Rehype plugin that turns bracketed transcript timestamps like `[00:01:23]`
// or `[04:12]` into clickable buttons that seek the audio player. Only the
// markdown transcripts in `src/content/transcripts` contain this pattern, so
// this plugin effectively only affects them.
//
// The button keeps the original bracketed label as its text and carries the
// resolved offset (in seconds) in `data-seek`; the client-side markdown
// transcript island reads that attribute to drive the player. The class list
// mirrors the RSS transcript timestamps (`Transcript.tsx`) so both look the
// same. Those utilities are already emitted by Tailwind from that component,
// so listing them here adds no new CSS.
const TIMESTAMP = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g;

const TIMESTAMP_CLASS = [
  'transcript-timestamp',
  'mr-1',
  'align-baseline',
  'font-mono',
  'text-sm',
  'font-medium',
  'text-violet-600',
  'tabular-nums',
  'no-underline',
  'transition-colors',
  'hover:text-violet-500',
  'dark:text-cyan-400',
  'dark:hover:text-cyan-300'
];

function toSeconds(hours, minutes, seconds) {
  // `[MM:SS]` arrives as (minutes, seconds) with `seconds` undefined.
  return seconds === undefined
    ? Number(hours) * 60 + Number(minutes)
    : Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function timestampButton(label, seconds) {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      className: [...TIMESTAMP_CLASS],
      'data-seek': String(seconds),
      'aria-label': `Play from ${label}`
    },
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
    nodes.push(timestampButton(label, toSeconds(a, b, c)));
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
