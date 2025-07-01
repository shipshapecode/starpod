import type { APIRoute } from 'astro';
import { optimizeEpisodeImage } from '../../../lib/optimize-episode-image';
import { getAllEpisodes } from '../../../lib/rss';
import type { Episode } from '../../../lib/rss';

const episodesPerPage = 15;
const allEpisodes = await getAllEpisodes();

export async function getStaticPaths({ paginate }: { paginate: any }) {
  return paginate(allEpisodes, { pageSize: episodesPerPage });
}

export const GET: APIRoute = async ({ props }) => {
  const canLoadMore = props.page.currentPage < props.page.lastPage;
  return new Response(JSON.stringify({ canLoadMore, episodes: props.page }));
};
