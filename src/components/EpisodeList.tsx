import type { JSX } from 'preact/jsx-runtime';
import { currentEpisode, isPlaying } from '@components/state';
import type { Episode } from '@lib/rss';

type Props = {
  episodes: Array<Episode>;
};

const playIcon = (
  <svg
    class="h-9 w-9"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clip-rule="evenodd"
    />
  </svg>
);

const pauseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="h-9 w-9"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill-rule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75H9zm5.25 0a.75.75 0 00-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-.75z"
      clip-rule="evenodd"
    />
  </svg>
);

function renderIcon(icon: JSX.Element) {
  return <span>{icon}</span>;
}

export default function EpisodeList({ episodes }: Props) {
  return (
    <ul aria-label="EpisodeList">
      {episodes.map((episode, index) => {
        const isCurrentEpisode = episode.id == currentEpisode.value?.id;

        return (
          <li class="dark:border-dark-border border-b">
            <div class="w-full py-12" aria-current={isCurrentEpisode}>
              <h2 class="mb-2 text-lg font-bold dark:text-white">
                {episode.episodeNumber}: {episode.title}
              </h2>

              <div class="flex items-center gap-6">
                <button
                  class="dark:bg-dark-button bg-white text-light-text-heading flex items-center rounded-full p-2 pr-4 font-bold dark:text-white"
                  onClick={() => {
                    currentEpisode.value = {
                      ...episode
                    };

                    isPlaying.value = isCurrentEpisode
                      ? !isPlaying.value
                      : true;
                  }}
                >
                  <span class="text-light-text-heading mr-3 w-8 dark:text-white">
                    {isCurrentEpisode && isPlaying.value
                      ? renderIcon(pauseIcon)
                      : renderIcon(playIcon)}
                  </span>
                  Play Episode
                  <span class="sr-only">
                    (press to{' '}
                    {isCurrentEpisode && isPlaying.value ? 'pause)' : 'play)'}
                  </span>
                </button>

                <a
                  class="text-light-text-heading font-bold dark:text-white"
                  href={`/${episode.episodeSlug}`}
                >
                  Show notes
                </a>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
