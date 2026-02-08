import type { APIRoute } from 'astro';
import { getAllEpisodes } from '../../../lib/rss';

export const prerender = true;

export const GET: APIRoute = async () => {
  const allEpisodes = await getAllEpisodes();

  return new Response(JSON.stringify(allEpisodes), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
