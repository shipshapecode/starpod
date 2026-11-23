import type { ComponentChildren, JSX } from 'preact';
import { useRef } from 'preact/hooks';

import { currentEpisode, seekToEpisode } from '../state';
import LiveTurn from './LiveTurn';
import SpeakerCard, { type Speaker } from './SpeakerCard';

type Props = {
  episode: NonNullable<(typeof currentEpisode)['value']>;
  children: ComponentChildren;
  /** The episode's people, by the name the transcript gives them. */
  speakers?: Record<string, Speaker>;
};

/**
 * Wraps a server-rendered markdown transcript and makes its timestamp buttons
 * (injected by the `rehype-transcript-timestamps` plugin) seek the player.
 *
 * The markdown HTML is rendered by Astro and passed in as children, so a single
 * delegated click handler on the container drives every `[data-seek]` button
 * rather than hydrating each one.
 */
export default function MarkdownTranscript({
  episode,
  children,
  speakers = {}
}: Props) {
  const root = useRef<HTMLElement>(null);

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
      class="transcript text-[1.0625rem] leading-[1.75] wrap-anywhere text-text"
      data-clamped
      data-props-for="truncated"
      data-props-to=".transcript-section"
      onClick={handleClick}
      ref={root}
    >
      {children}
      <LiveTurn episode={episode} root={root} />
      {Object.keys(speakers).length > 0 && (
        <SpeakerCard root={root} speakers={speakers} />
      )}
    </article>
  );
}
