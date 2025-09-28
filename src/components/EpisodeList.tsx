import FormattedDate from '../components/FormattedDate';
import FullPlayButton from '../components/FullPlayButton';
import { currentEpisode } from '../components/state';
import type { Episode, Show } from '../lib/rss';
import { dasherize } from '../utils/dasherize';

type Props = {
  episodes: Array<Episode>;
  show: Show;
};

export default function EpisodeList({ episodes, show }: Props) {
  return (
    <ul aria-label="EpisodeList">
      {episodes.map((episode) => {
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
                src={episode.episodeThumbnail ?? show.image}
                width={80}
                loading="lazy"
              />

              <div class="flex flex-col">
                <FormattedDate date={new Date(episode.published)} />

                <h2 class="text-light-text-heading my-2 text-lg font-bold dark:text-white">
                  <a
                    href={`/${episode.episodeSlug}`}
                    style={
                      'view-transition-name: var(--should-vt); --vt-name: vt-' + dasherize(episode.title)
                    }
                  >
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
  );
}
