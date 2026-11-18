import { currentEpisode, seekToEpisode } from '../state';
import type { TranscriptParagraph } from '../../lib/transcript';
import SeekChip from './SeekChip';

type Props = {
  episode: NonNullable<(typeof currentEpisode)['value']>;
  paragraphs: Array<TranscriptParagraph>;
};

/**
 * Renders an RSS-sourced transcript as paragraphs, each prefixed with a
 * clickable timestamp that jumps the audio player to that moment (starting the
 * episode first if it isn't the one currently loaded).
 */
export default function Transcript({ episode, paragraphs }: Props) {
  function jumpTo(start: number) {
    seekToEpisode(episode, start);
  }

  return (
    <article class="transcript line-clamp-4">
      {paragraphs.map((paragraph, index) => {
        const start = paragraph.start;

        return (
          <p key={index}>
            {start !== undefined && <SeekChip onSeek={jumpTo} seconds={start} />}
            {paragraph.text}
          </p>
        );
      })}
    </article>
  );
}
