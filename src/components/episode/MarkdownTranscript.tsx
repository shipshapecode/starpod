import type { ComponentChildren, JSX } from 'preact';

import { currentEpisode, seekToEpisode } from '../state';

type Props = {
  episode: NonNullable<(typeof currentEpisode)['value']>;
  children: ComponentChildren;
};

/**
 * Wraps a server-rendered markdown transcript and makes its timestamp buttons
 * (injected by the `rehype-transcript-timestamps` plugin) seek the player.
 *
 * The markdown HTML is rendered by Astro and passed in as children, so a single
 * delegated click handler on the container drives every `[data-seek]` button
 * rather than hydrating each one.
 */
export default function MarkdownTranscript({ episode, children }: Props) {
  function handleClick(event: JSX.TargetedMouseEvent<HTMLElement>) {
    const button = (event.target as HTMLElement).closest('[data-seek]');
    if (!button) {
      return;
    }

    const seconds = Number(button.getAttribute('data-seek'));
    if (Number.isFinite(seconds)) {
      seekToEpisode(episode, seconds);
    }
  }

  return (
    <article
      class="transcript prose prose-neutral dark:prose-invert line-clamp-4"
      onClick={handleClick}
    >
      {children}
    </article>
  );
}
