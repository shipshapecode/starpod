import { useEffect, useState } from 'preact/hooks';
import type { JSX } from 'preact/jsx-runtime';

import type { Episode } from '../lib/rss';
import { currentEpisode, isPlaying } from './state';

type Props = {
  episode: Episode;
};

const PlayIcon = (
  <svg
    class="h-2 w-2"
    fill="none"
    height="14"
    viewBox="0 0 11 14"
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

function renderIcon(icon: JSX.Element, key?: string) {
  return <span key={key}>{icon}</span>;
}

export default function FullPlayButton({ episode }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isCurrentEpisode = episode.id === currentEpisode.value?.id;
  const showPauseIcon = isCurrentEpisode && isPlaying.value;

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
      <span class="text-light-text-heading flex w-full items-center rounded-full p-2 pr-4 dark:text-white">
        <span class="bg-light-text-heading dark:text-dark-button mr-3 flex h-7 w-7 items-center justify-center rounded-full text-white dark:bg-white">
          {hasMounted &&
            (showPauseIcon
              ? renderIcon(PauseIcon, 'pause')
              : renderIcon(PlayIcon, 'play'))}
        </span>
        {hasMounted && (showPauseIcon ? 'Pause' : 'Play')} Episode
        {hasMounted && (
          <span class="sr-only">
            (press to {showPauseIcon ? 'pause' : 'play'})
          </span>
        )}
      </span>
    </button>
  );
}
