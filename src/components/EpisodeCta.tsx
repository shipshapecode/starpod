import type { JSX } from 'preact/jsx-runtime';

import { currentEpisode, isPlaying, isTheaterOpen, mediaMode } from './state';

type Props = {
  episode: (typeof currentEpisode)['value'];
  /**
   * Which stream to start. 'video' opens the theater; 'audio' plays in the
   * docked player.
   */
  mode: 'audio' | 'video';
  /**
   * Visible label for the labeled (pill) variant. Ignored when `round`.
   */
  label: string;
  /**
   * Render an icon-only circular button (used as the overlay on episode art).
   */
  round?: boolean;
};

const PlayIcon = (
  <svg
    class="h-4 w-4"
    fill="none"
    viewBox="0 0 11 14"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="m.367882.443158c0-.065142.07026-.106046.126866-.073861l11.541952 6.562623c.0573.03256.0573.11515 0 .14772l-11.541949 6.56266c-.056606.0321-.126865-.0088-.126865-.0739z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
);

const PauseIcon = (
  <svg
    class="h-4 w-4"
    fill="none"
    viewBox="0 0 14 18"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <rect height="16.8" rx="1.07692" width="5.6" y=".799805" />
      <rect height="16.8" rx="1.07692" width="5.6" x="8.40039" y=".799805" />
    </g>
  </svg>
);

const WatchIcon = (
  <svg
    class="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="2"
      stroke="currentColor"
      stroke-width="2"
    />
    <path d="M10 9.5v5l4-2.5z" fill="currentColor" />
  </svg>
);

export default function EpisodeCta({ episode, mode, label, round }: Props) {
  if (!episode) {
    return null;
  }

  const isCurrent = episode.id === currentEpisode.value?.id;
  const isVideo = mode === 'video';
  const showPause = isCurrent && isPlaying.value && mediaMode.value === mode;

  function start() {
    if (!episode) {
      return;
    }
    const becomingCurrent =
      !isCurrent || mediaMode.value !== mode || !isPlaying.value;

    currentEpisode.value = {
      audio: episode.audio,
      video: episode.video,
      episodeImage: episode.episodeImage,
      episodeNumber: episode.episodeNumber,
      id: episode.id,
      title: episode.title
    };
    mediaMode.value = mode;
    isPlaying.value = becomingCurrent ? true : false;

    if (isVideo) {
      isTheaterOpen.value = true;
    }
  }

  if (round) {
    return (
      <button
        type="button"
        onClick={start}
        aria-label={showPause ? 'Pause episode' : label}
        class="play-affordance flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:h-[4.5rem] hover:w-[4.5rem]"
      >
        <span key={showPause ? 'pause' : 'play'}>
          {(showPause ? PauseIcon : isVideo ? WatchIcon : PlayIcon) as JSX.Element}
        </span>
      </button>
    );
  }

  return (
    <button class="btn" type="button" onClick={start}>
      <span class="text-light-text-heading flex w-full items-center rounded-full p-2 pr-4 dark:text-white">
        <span class="bg-light-text-heading dark:text-dark-button mr-3 flex h-7 w-7 items-center justify-center rounded-full text-white dark:bg-white">
          {showPause ? PauseIcon : (isVideo ? WatchIcon : PlayIcon)}
        </span>
        {showPause ? 'Pause' : label}
      </span>
    </button>
  );
}
