import type { APIRoute } from 'astro';
import { getAllEpisodes } from '@lib/episodes';

export const GET: APIRoute = async () => {
  const episodes = await getAllEpisodes();
  return new Response(JSON.stringify(episodes));
};
