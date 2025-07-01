import { useState } from 'preact/hooks';
import FormattedDate from '../components/FormattedDate';
import FullPlayButton from '../components/FullPlayButton';
import { currentEpisode } from '../components/state';
import type { Episode } from '../lib/rss';

type Props = {
  episodes: Array<Episode>;
  url: URL;
};

export default function EpisodeList({ episodes, url }: Props) {
  const [recentEpisodes, setRecentEpisodes] = useState(episodes);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // starting from page 2 due to static props fetch of page 1
  const [page, setPage] = useState(2);

  async function fetchMoreEpisodes() {
    if (canLoadMore) {
      setIsLoading(true);

      const episodeResponse = await fetch(`/api/episodes/${page}.json`);
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
            <li class="dark:border-dark-border border-b">
              <div
                class="flex w-full flex-col py-12 lg:flex-row"
                aria-current={isCurrentEpisode}
              >
                <img
                  alt={`${episode.title} - episode art`}
                  aria-hidden="true"
                  class="mb-3 block h-20 w-20 rounded-md lg:mr-6"
                  height={80}
                  src={episode.episodeThumbnail ?? '/images/www.png'}
                  width={80}
                  loading="lazy"
                />

                <div class="flex flex-col">
                  <FormattedDate date={new Date(episode.published)} />

                  <h2 class="text-light-text-heading my-2 text-lg font-bold dark:text-white">
                    <a href={`/${episode.episodeSlug}`}>
                      {episode.episodeNumber}: {episode.title}
                    </a>
                  </h2>

                  <p class="mb-5">{episode.description}</p>

                  <div class="flex items-center gap-6 text-sm">
                    <FullPlayButton episode={episode} />

                    <a
                      class="text-light-text-heading font-bold dark:text-white"
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
          <button class="btn" onClick={fetchMoreEpisodes}>
            <span class="text-light-text-heading rounded-full px-8 py-4 text-center text-sm dark:text-white">
              More episodes
            </span>
          </button>
        </div>
      )}
    </>
  );
}
