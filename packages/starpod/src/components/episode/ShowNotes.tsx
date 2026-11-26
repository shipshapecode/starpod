import type { ComponentChildren, JSX } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';

import { seekChipAttributes } from '../../lib/seek-chip.mjs';
import { seekToEpisode, type PlayableEpisode } from '../state';

type Props = {
  episode: PlayableEpisode;
  children: ComponentChildren;
};

// A timestamp, optionally wrapped in brackets as older notes wrote them:
// `12:34`, `(12:34)`, `[1:02:03]`.
const TIMESTAMP = /([([]\s*)?\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b(\s*[)\]])?/g;
const PAIRS: Record<string, string> = { '(': ')', '[': ']' };

/**
 * Server-rendered show notes, with any chapter timestamps written in them
 * turned into buttons that start the episode at that moment.
 */
export default function ShowNotes({ episode, children }: Props) {
  const root = useRef<HTMLDivElement>(null);

  // The chips are made as hydration completes, not after the next frame
  // (a still page in WebKit may not paint one for a while).
  useLayoutEffect(() => {
    const container = root.current;
    if (!container) {
      return;
    }
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes: Array<Text> = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      // Not in a link or button, nor in code, where 10:30 is code.
      if (TIMESTAMP.test(node.data) && !node.parentElement?.closest('a, button, code, pre')) {
        nodes.push(node);
      }
      TIMESTAMP.lastIndex = 0;
    }
    const toSeconds = (h: string | undefined, m: string, sec: string) =>
      Number(h ?? 0) * 3600 + Number(m) * 60 + Number(sec);
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      let last = 0;
      for (const match of node.data.matchAll(TIMESTAMP)) {
        const [text, open, h, m, s, close] = match;
        const seconds = toSeconds(h, m, s);
        if (seconds > (episode.duration ?? Infinity)) {
          continue;
        }
        // The chip replaces a matched pair of brackets along with the time;
        // a lone bracket belongs to the surrounding prose and stays.
        const paired = Boolean(open && close && PAIRS[open.trim()] === close.trim());
        fragment.append(node.data.slice(last, match.index));
        if (open && !paired) {
          fragment.append(open);
        }
        const { label, ...attributes } = seekChipAttributes(seconds);
        const button = document.createElement('button');
        for (const [name, value] of Object.entries(attributes)) {
          button.setAttribute(name, value);
        }
        button.textContent = label;
        fragment.append(button);
        if (close && !paired) {
          fragment.append(close);
        }
        last = match.index! + text.length;
      }
      fragment.append(node.data.slice(last));
      node.replaceWith(fragment);
    }
  }, []);

  function handleClick(event: JSX.TargetedMouseEvent<HTMLDivElement>) {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-seek]');
    if (button) {
      seekToEpisode(episode, Number(button.dataset.seek));
    }
  }

  return (
    <div
      class="prose prose-blockquote:not-italic mb-5 max-w-notes wrap-anywhere [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-md [&>h2]:leading-7 [&>h2]:font-medium [&>h2]:text-ink [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-aqua-200 [&>h2:nth-of-type(3n)]:before:bg-iris-200 [&>h2:nth-of-type(3n+2)]:before:bg-iris-300 [&>ul]:mt-6 [&>ul]:pl-5 [&_li>p]:m-0"
      onClick={handleClick}
      ref={root}
    >
      {children}
    </div>
  );
}
