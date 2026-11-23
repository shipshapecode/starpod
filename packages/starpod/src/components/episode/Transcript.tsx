import { useRef } from 'preact/hooks';

import {
  LONG_TURN,
  TURNS_PER_GROUP
} from '../../lib/rehype-transcript-timestamps.mjs';
import { currentEpisode, seekToEpisode } from '../state';
import type { TranscriptParagraph } from '../../lib/transcript';
import LiveTurn from './LiveTurn';
import SeekChip from './SeekChip';

type Props = {
  episode: NonNullable<(typeof currentEpisode)['value']>;
  paragraphs: Array<TranscriptParagraph>;
};

/**
 * Renders an RSS-sourced transcript as turns, each headed by a clickable
 * timestamp that jumps the audio player to that moment (starting the
 * episode first if it isn't the one currently loaded). Long transcripts come
 * in groups of turns, as markdown ones do (see the rehype plugin).
 */
export default function Transcript({ episode, paragraphs }: Props) {
  const root = useRef<HTMLElement>(null);

  function jumpTo(start: number) {
    seekToEpisode(episode, start);
  }

  const turn = (paragraph: TranscriptParagraph, index: number) =>
    paragraph.start === undefined ? (
      <p key={index}>{paragraph.text}</p>
    ) : (
      <p
        class="ep-turn"
        data-long={paragraph.text.length > LONG_TURN ? '' : undefined}
        key={index}
      >
        <span class="ep-turn-head">
          <SeekChip onSeek={jumpTo} seconds={paragraph.start} />
        </span>
        <span class="ep-turn-text">{paragraph.text}</span>
      </p>
    );
  const groups = Array.from(
    { length: Math.ceil(paragraphs.length / TURNS_PER_GROUP) },
    (_, index) => index * TURNS_PER_GROUP
  );

  return (
    <article
      class="transcript text-[1.0625rem] leading-[1.75] wrap-anywhere text-text"
      data-clamped
      data-props-for="truncated"
      data-props-to=".transcript-section"
      ref={root}
      style="--ep-gutter: 5.5rem"
    >
      {paragraphs.length > TURNS_PER_GROUP
        ? groups.map((from) => (
            // Past the first group the preview shows none of it (see
            // rehype-transcript-timestamps): hidden until found or opened.
            <div
              class="ep-turns"
              key={from}
              {...(from ? { hidden: 'until-found' } : {})}
            >
              {paragraphs
                .slice(from, from + TURNS_PER_GROUP)
                .map((paragraph, index) => turn(paragraph, from + index))}
            </div>
          ))
        : paragraphs.map(turn)}
      <LiveTurn episode={episode} root={root} />
    </article>
  );
}
