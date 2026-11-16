import { useLayoutEffect, useRef, useState } from 'preact/hooks';

import { startEngine } from './media/engine';
import PlayGlyph from './media/PlayGlyph';
import PlayToggle from './media/PlayToggle';
import { readPosition } from './media/position';
import { formatClock } from '../utils/playable';
import {
  currentEpisode,
  isPlaying,
  playEpisode,
  type PlayableEpisode
} from './state';

type Props = {
  episode: PlayableEpisode | null;
  /**
   * `row`: the round play disc on an episode card. `disc`: the large disc
   * over featured media. `pill`: a labelled primary button that offers to
   * resume where the visitor left off.
   */
  look?: 'row' | 'disc' | 'pill';
};

/**
 * A play control for one episode. Marks its card (`[data-episode-row]`) as
 * current (the lit room / the speaking line) while that episode is loaded,
 * and as playing while it plays.
 */
export default function FullPlayButton({ episode, look = 'row' }: Props) {
  const button = useRef<HTMLButtonElement>(null);
  const [resumeAt, setResumeAt] = useState(0);

  useLayoutEffect(() => {
    startEngine();
    if (episode && look === 'pill') {
      setResumeAt(readPosition(episode.id));
    }
  }, [episode, look]);

  const isCurrent =
    Boolean(episode) && episode!.id === currentEpisode.value?.id;
  const playing = isCurrent && isPlaying.value;

  useLayoutEffect(() => {
    const row = button.current?.closest<HTMLElement>('[data-episode-row]');
    row?.toggleAttribute('data-current', isCurrent);
    row?.toggleAttribute('data-playing', playing);
  });

  if (!episode) {
    return null;
  }

  if (look === 'pill') {
    const resume = !isCurrent && resumeAt >= 30;
    return (
      <button
        class="button-primary"
        onClick={() => playEpisode(episode)}
        ref={button}
        type="button"
      >
        <PlayGlyph playing={playing} size={18} />
        <span>
          {playing
            ? 'Pause episode'
            : resume
              ? `Resume at ${formatClock(resumeAt)}`
              : 'Play episode'}
        </span>
      </button>
    );
  }

  return (
    <PlayToggle
      buttonRef={button}
      class={look === 'disc' ? 'stage-play' : 'row-play halo'}
      episode={episode}
      labelFor={(on) =>
        `${on ? 'Pause' : 'Play'} episode ${episode.episodeNumber}: ${episode.title}`
      }
      onAir={look === 'row'}
      size={look === 'disc' ? 30 : 18}
    />
  );
}
