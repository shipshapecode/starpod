import type { APIRoute } from 'astro';
import { getAllEpisodes } from '@lib/episodes';

export async function getStaticPaths({ paginate }) {
  const allEpisodes = await getAllEpisodes();
  return paginate(allEpisodes, { pageSize: 15 });
}

export const GET: APIRoute = async ({ props }) => {
  return new Response(JSON.stringify(props.page));
};
