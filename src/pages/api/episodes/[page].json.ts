import type { APIRoute } from 'astro';
import { optimizeEpisodeImage } from '../../../lib/optimize-episode-image';
import { getAllEpisodes } from '../../../lib/rss';
import type { Episode } from '../../../lib/rss';

const episodesPerPage = 15;

export async function getStaticPaths({ paginate }: { paginate: any }) {
  let allEpisodes = await getAllEpisodes();
  allEpisodes = await Promise.all(
    allEpisodes.map(async (episode: Episode) => {
      episode.episodeThumbnail = await optimizeEpisodeImage(
        episode.episodeImage
      );
      return episode;
    })
  );

  const paginated = paginate(allEpisodes, { pageSize: episodesPerPage });

  console.log('**********PAGINATED HERE:************');
  for (const page of paginated) {
    for (const episode of page.props.page.data) {
      console.log(episode.episodeThumbnail);
    }
  }

  return paginated;
}

export const GET: APIRoute = async ({ props }) => {
  const canLoadMore = props.page.currentPage < props.page.lastPage;
  return new Response(JSON.stringify({ canLoadMore, episodes: props.page }));
};
