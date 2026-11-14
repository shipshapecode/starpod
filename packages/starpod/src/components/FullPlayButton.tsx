import { useEffect, useRef } from 'preact/hooks';

import { startEngine } from './media/engine';
import PlayToggle from './media/PlayToggle';
import { currentEpisode, isPlaying, type PlayableEpisode } from './state';

type Props = {
  episode: PlayableEpisode | null;
};

/**
 * The play control on an episode row. Marks its row as current (the lit
 * room / the speaking line) while that episode is loaded.
 */
export default function FullPlayButton({ episode }: Props) {
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    startEngine();
  }, []);

  const isCurrent = Boolean(episode) && episode!.id === currentEpisode.value?.id;
  const playing = isCurrent && isPlaying.value;

  useEffect(() => {
    const row = button.current?.closest<HTMLElement>('[data-episode-row]');
    row?.toggleAttribute('data-current', isCurrent);
    row?.toggleAttribute('data-playing', playing);
  });

  if (!episode) {
    return null;
  }

  return (
    <PlayToggle
      buttonRef={button}
      class="row-play halo"
      episode={episode}
      labelFor={(on) =>
        `${on ? 'Pause' : 'Play'} episode ${episode.episodeNumber}: ${episode.title}`
      }
      onAir
      size={18}
    />
  );
}
