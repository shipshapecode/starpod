import type { JSX } from 'preact/jsx-runtime';
import { useEffect, useState } from 'preact/hooks';
import { currentEpisode, isPlaying } from '../components/state';
import type { Episode } from '../lib/rss';
import FormattedDate from '../components/FormattedDate';

type Props = {
  episodes: Array<Episode>;
  url: URL;
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

export default function EpisodeList({ episodes, url }: Props) {
  const [recentEpisodes, setRecentEpisodes] = useState(episodes);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // starting from page 2 due to static props fetch of page 1
  const [page, setPage] = useState(2);

  async function fetchMoreEpisodes() {
    if (canLoadMore) {
      setIsLoading(true);

      const episodeResponse = await fetch(`${url}api/episodes/${page}.json`);
      const { canLoadMore, episodes } = await episodeResponse.json();

      setIsLoading(false);
      setCanLoadMore(canLoadMore);

      setRecentEpisodes([...recentEpisodes, ...episodes.data]);
      setPage(page + 1);
    }
  }

  return (
    <>
      <ul aria-label="EpisodeList">
        {recentEpisodes.map((episode) => {
          const isCurrentEpisode = episode.id == currentEpisode.value?.id;

          return (
            <li class="border-b dark:border-dark-border">
              <div class="flex w-full py-12" aria-current={isCurrentEpisode}>
                <img
                  alt={`${episode.title} - episode art`}
                  aria-hidden="true"
                  class="mr-6 block h-20 w-20 rounded-md"
                  height={80}
                  src={episode.episodeImage ?? '/images/www.png'}
                  width={80}
                />

                <div>
                  <FormattedDate date={new Date(episode.published)} />

                  <h2 class="mb-2 text-lg font-bold text-light-text-heading dark:text-white">
                    {episode.episodeNumber}: {episode.title}
                  </h2>

                  <p class="mb-5">{episode.description}</p>

                  <div class="flex items-center gap-6">
                    <button
                      class="btn"
                      onClick={() => {
                        currentEpisode.value = {
                          ...episode
                        };

                        isPlaying.value = isCurrentEpisode
                          ? !isPlaying.value
                          : true;
                      }}
                    >
                      <span class="flex w-full items-center rounded-full p-2 pr-4 text-light-text-heading dark:text-white">
                        <span class="mr-3 w-8 text-light-text-heading dark:text-white">
                          {isCurrentEpisode && isPlaying.value
                            ? renderIcon(pauseIcon)
                            : renderIcon(playIcon)}
                        </span>
                        Play Episode
                        <span class="sr-only">
                          (press to{' '}
                          {isCurrentEpisode && isPlaying.value
                            ? 'pause)'
                            : 'play)'}
                        </span>
                      </span>
                    </button>

                    <a
                      class="font-bold text-light-text-heading dark:text-white"
                      href={`/${episode.episodeSlug}`}
                    >
                      Show notes
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {canLoadMore && (
        <div class="mt-8 flex justify-center pb-16">
          <button
            class="btn"
            onClick={fetchMoreEpisodes}
          >
            <span class="rounded-full px-8 py-4 text-center text-light-text-heading dark:text-white">
              More episodes
            </span>
          </button>
        </div>
      )}
    </>
  );
}
