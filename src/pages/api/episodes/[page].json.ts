import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getAllEpisodes } from '../../../lib/rss';
import { optimizeEpisodeImage } from '../../../lib/optimize-episode-image';

const episodesPerPage = 15;
const allEpisodes = await getAllEpisodes();

for (const episode of allEpisodes) {
  await optimizeEpisodeImage(episode);
}

export async function getStaticPaths({ paginate }: { paginate: any }) {
  return paginate(allEpisodes, { pageSize: episodesPerPage });
}

export const GET: APIRoute = async ({ props }) => {
  const page = props.page.currentPage;
  const canLoadMore = page * episodesPerPage < allEpisodes.length;
  return new Response(JSON.stringify({ canLoadMore, episodes: props.page }));
};
