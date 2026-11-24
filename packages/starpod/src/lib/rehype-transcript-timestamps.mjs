// Rehype plugin that turns bracketed transcript timestamps like `[00:01:23]`
// or `[04:12]` into clickable buttons that seek the audio player. Only the
// markdown transcripts in `src/content/transcripts` contain this pattern, so
// this plugin effectively only affects them.
//
// Each timestamp becomes the shared seek chip (`seek-chip.mjs`), the same
// one show notes and feed transcripts use; the client-side markdown
// transcript island reads `data-seek` to drive the player. A paragraph that
// opens with one becomes a turn (`.ep-turn`: a head and its words).
import { seekChipAttributes } from './seek-chip.mjs';

const TIMESTAMP = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g;

/** A turn with more characters than this is long enough for its head to stick. */
export const LONG_TURN = 280;

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

const isBlank = (child) =>
  child.type === 'text' && !child.value.replace(/\u200b/g, '').trim();
const isChip = (child) =>
  child?.tagName === 'button' && 'data-seek' in (child.properties ?? {});
const isSpeaker = (child) =>
  child?.tagName === 'strong' || child?.tagName === 'b';
const textOf = (node) =>
  node.value ?? (node.children ?? []).map(textOf).join('');

// A paragraph that opens with a timestamp is one speaker's turn: the time
// (and the bold speaker name right after it, when there is one) become its
// head, which the episode page sets in a sticky gutter beside the words.
function toTurn(paragraph) {
  const children = paragraph.children.filter(
    (child, index) => index > 0 || !isBlank(child)
  );
  if (!isChip(children[0])) {
    return;
  }
  const head = [children[0]];
  const headProperties = { className: ['ep-turn-head'] };
  const next = children.findIndex(
    (child, index) => index > 0 && !isBlank(child)
  );
  if (isSpeaker(children[next])) {
    const speaker = children[next];
    // In the gutter the name stands alone: drop its trailing colon.
    const last = speaker.children?.at(-1);
    if (last?.type === 'text') {
      last.value = last.value.replace(/:\s*$/, '');
    }
    head.push(speaker);
    // The name, for pages to set each speaker in their voice.
    headProperties.dataSpeaker = textOf(speaker).trim();
  }
  const words = children.slice(head.length === 2 ? next + 1 : 1);
  paragraph.properties = {
    ...paragraph.properties,
    className: ['ep-turn'],
    dataLong: words.map(textOf).join('').length > LONG_TURN ? '' : undefined
  };
  paragraph.children = [
    {
      type: 'element',
      tagName: 'span',
      properties: headProperties,
      children: head
    },
    {
      type: 'element',
      tagName: 'span',
      properties: { className: ['ep-turn-text'] },
      children: words
    }
  ];
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
  if (node.tagName === 'p') {
    toTurn(node);
  }
}

/** Turns per group in a long transcript. */
export const TURNS_PER_GROUP = 20;

const isTurn = (node) => node.properties?.className?.includes('ep-turn');

// A long transcript's top-level blocks go into groups of TURNS_PER_GROUP
// turns (`.ep-turns`), so the page can skip rendering whole groups that are
// off screen rather than tracking thousands of turns one by one.
function group(tree) {
  if (tree.children.filter(isTurn).length <= TURNS_PER_GROUP) {
    return;
  }
  const groups = [];
  let current = null;
  let turns = 0;
  for (const child of tree.children) {
    if (!current || (isTurn(child) && turns === TURNS_PER_GROUP)) {
      // Past the first group the preview shows none of it: out of the tab
      // order and the accessibility tree until the transcript is opened, yet
      // findable in the page (`until-found` opens it).
      current = {
        type: 'element',
        tagName: 'div',
        properties: groups.length
          ? { className: ['ep-turns'], hidden: 'until-found' }
          : { className: ['ep-turns'] },
        children: []
      };
      groups.push(current);
      turns = 0;
    }
    current.children.push(child);
    turns += isTurn(child) ? 1 : 0;
  }
  tree.children = groups;
}

/**
 * Is this file a transcript (under a `transcripts` directory, as
 * `transcriptsLoader` keeps them)? Only a transcript is grouped: its later
 * groups are hidden until the episode page opens them, and no other page
 * has the script that does.
 */
function isTranscript(file) {
  const path = file?.path ?? file?.history?.[0];
  return !path || /[\\/]transcripts[\\/]/.test(path);
}

export default function rehypeTranscriptTimestamps() {
  return (tree, file) => {
    transform(tree);
    if (isTranscript(file)) {
      group(tree);
    }
  };
}
