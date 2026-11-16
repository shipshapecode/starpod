import { useLayoutEffect, useState } from 'preact/hooks';

import PlayToggle from '../media/PlayToggle';
import { currentEpisode, type PlayableEpisode } from '../state';

type Props = { episode: PlayableEpisode };

/**
 * The episode bar's play button. While this episode is the one loaded, the
 * ring around it reads the media clock (`data-props-for="media-clock"`:
 * `--live-progress` and `--live-paused`, written on the ring alone) and
 * fills with playback, so the bar shows how far in you are without a
 * scrubber.
 *
 * The server never knows what is playing, so the first render matches its
 * markup and the real state follows right after mount (hydration keeps the
 * server's attributes).
 */
export default function BarPlay({ episode }: Props) {
  const [mounted, setMounted] = useState(false);
  // Settled as hydration completes, not after the next frame: a still page
  // in WebKit may not paint one for a while.
  useLayoutEffect(() => setMounted(true), []);
  const current = mounted && currentEpisode.value?.id === episode.id;

  return (
    <span
      class="ep-bar-ring"
      data-current={current ? '' : undefined}
      data-props-for={current ? 'media-clock' : undefined}
    >
      <PlayToggle
        class="ep-bar-play"
        episode={episode}
        labelFor={(playing) =>
          `${mounted && playing ? 'Pause' : 'Play'} this episode`
        }
        size={16}
      />
    </span>
  );
}
