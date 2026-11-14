import type { RefObject } from 'preact';

import { currentEpisode, isBuffering, isPlaying, playEpisode, type PlayableEpisode } from '../state';
import PlayGlyph from './PlayGlyph';

type Props = {
  /** The look: `dock-play`, `stage-play`, `row-play`. */
  class: string;
  /** Plays this episode (or toggles it if it's loaded). Omit to toggle whatever is loaded. */
  episode?: PlayableEpisode;
  /** Accessible name; defaults to "Play" / "Pause". */
  labelFor?: (playing: boolean) => string;
  /** Live level bars while playing (archive rows). */
  onAir?: boolean;
  buttonRef?: RefObject<HTMLButtonElement>;
  /** Advertise the K / space shortcut (the dock's transport). */
  shortcut?: boolean;
  size: number;
};

/**
 * The one play/pause button. Every play control (dock, stage, archive rows)
 * renders this, so they read the same signals during render and always agree:
 * playing or paused, and buffering, shown as a ring that spins around the
 * button only while it is trying to play and waiting on data.
 */
export default function PlayToggle({
  buttonRef,
  class: className,
  episode,
  labelFor = (playing) => (playing ? 'Pause' : 'Play'),
  onAir = false,
  shortcut = false,
  size
}: Props) {
  const loaded = currentEpisode.value;
  const isCurrent = Boolean(loaded) && (!episode || episode.id === loaded!.id);
  const playing = isCurrent && isPlaying.value;
  const buffering = playing && isBuffering.value;
  const label = labelFor(playing);

  return (
    <button
      aria-keyshortcuts={shortcut ? 'K' : undefined}
      aria-label={label}
      class={`play-toggle ${className}`}
      data-buffering={buffering ? '' : undefined}
      data-shortcut={shortcut ? 'play' : undefined}
      onClick={() => (episode ? playEpisode(episode) : (isPlaying.value = !isPlaying.value))}
      ref={buttonRef}
      title={shortcut ? `${label} (K or space)` : undefined}
      type="button"
    >
      <PlayGlyph onAir={onAir} playing={playing} size={size} />
    </button>
  );
}
