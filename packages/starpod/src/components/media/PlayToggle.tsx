import type { RefObject } from 'preact';
import { useComputed } from '@preact/signals';
import { useLayoutEffect, useRef } from 'preact/hooks';

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

// The buffering ring spins only on a button that is on screen: one observer
// marks the buttons it is watching, and only while they are buffering.
let watcher: IntersectionObserver | undefined;
function watchOnScreen(el: Element) {
  watcher ??= new IntersectionObserver((entries) =>
    entries.forEach((entry) => entry.target.toggleAttribute('data-onscreen', entry.isIntersecting))
  );
  watcher.observe(el);
  return () => {
    watcher?.unobserve(el);
    el.removeAttribute('data-onscreen');
  };
}

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
  // Read through computed signals, so changing episode re-renders only the
  // buttons whose own state changes, not every play button on the page.
  const id = episode?.id;
  const current = useComputed(() => {
    const loaded = currentEpisode.value;
    return Boolean(loaded) && (!id || id === loaded!.id);
  });
  const playingNow = useComputed(() => current.value && isPlaying.value);
  const bufferingNow = useComputed(() => playingNow.value && isBuffering.value);
  const playing = playingNow.value;
  const buffering = bufferingNow.value;
  const label = labelFor(playing);
  const own = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    if (buffering && own.current && 'IntersectionObserver' in window) {
      return watchOnScreen(own.current);
    }
  }, [buffering]);

  return (
    <button
      aria-keyshortcuts={shortcut ? 'K' : undefined}
      aria-label={label}
      class={`play-toggle ${className}`}
      data-buffering={buffering ? '' : undefined}
      data-shortcut={shortcut ? 'play' : undefined}
      onClick={() => (episode ? playEpisode(episode) : (isPlaying.value = !isPlaying.value))}
      ref={(el) => {
        own.current = el;
        if (buttonRef) {
          (buttonRef as { current: HTMLButtonElement | null }).current = el;
        }
      }}
      title={shortcut ? `${label} (K or space)` : undefined}
      type="button"
    >
      <PlayGlyph onAir={onAir} playing={playing} size={size} />
    </button>
  );
}
