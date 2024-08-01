import type { JSX } from 'preact/jsx-runtime';

import type { Episode } from '../lib/rss';
import { currentEpisode, isPlaying } from './state';

type Props = {
  episode: Episode;
};

const PlayIcon = (
  <svg
    class="ml-[2px] h-2 w-2"
    fill="none"
    height="14"
    viewBox="0 0 13 14"
    width="13"
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
    class="h-2 w-2"
    fill="none"
    height="18"
    viewBox="0 0 14 18"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <rect height="16.8" rx="1.07692" width="5.6" y=".799805" />
      <rect height="16.8" rx="1.07692" width="5.6" x="8.40039" y=".799805" />
    </g>
  </svg>
);

function renderIcon(icon: JSX.Element) {
  return <span>{icon}</span>;
}

export default function FullPlayButton({ episode }: Props) {
  const isCurrentEpisode = episode.id == currentEpisode.value?.id;

  return (
    <button
      class="btn"
      onClick={() => {
        currentEpisode.value = {
          ...episode
        };

        isPlaying.value = isCurrentEpisode ? !isPlaying.value : true;
      }}
    >
      <span class="flex w-full items-center rounded-full p-2 pr-4 text-light-text-heading dark:text-white">
        <span class="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-light-text-heading text-white dark:bg-white dark:text-dark-button">
          {isCurrentEpisode && isPlaying.value
            ? renderIcon(PauseIcon)
            : renderIcon(PlayIcon)}
        </span>
        {isCurrentEpisode && isPlaying.value ? 'Pause' : 'Play'} Episode
        <span class="sr-only">
          (press to {isCurrentEpisode && isPlaying.value ? 'pause)' : 'play)'}
        </span>
      </span>
    </button>
  );
}
