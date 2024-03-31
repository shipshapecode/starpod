import type { APIRoute } from 'astro';
import { getAllEpisodes } from '../../../lib/rss';

const episodesPerPage = 15;
const allEpisodes = await getAllEpisodes();

export async function getStaticPaths({ paginate }: { paginate: any }) {
  return paginate(allEpisodes, { pageSize: episodesPerPage });
}

export const GET: APIRoute = async ({ props }) => {
  const page = props.page.currentPage;
  const canLoadMore = page * episodesPerPage < allEpisodes.length;
  return new Response(JSON.stringify({ canLoadMore, episodes: props.page }));
};
