import { currentEpisode, seekToEpisode } from '../state';
import type { TranscriptParagraph } from '../../lib/transcript';

type Props = {
  episode: NonNullable<(typeof currentEpisode)['value']>;
  paragraphs: Array<TranscriptParagraph>;
};

function formatTimestamp(seconds: number): string {
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (value: number) => value.toString().padStart(2, '0');

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}

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
    <article class="transcript prose prose-neutral dark:prose-invert line-clamp-4">
      {paragraphs.map((paragraph, index) => {
        const start = paragraph.start;

        return (
          <p key={index}>
            {start !== undefined && (
              <button
                type="button"
                onClick={() => jumpTo(start)}
                class="mr-2 align-baseline font-mono text-sm font-medium text-violet-600 tabular-nums no-underline transition-colors hover:text-violet-500 dark:text-cyan-400 dark:hover:text-cyan-300"
                aria-label={`Play from ${formatTimestamp(start)}`}
              >
                {formatTimestamp(start)}
              </button>
            )}
            {paragraph.text}
          </p>
        );
      })}
    </article>
  );
}
