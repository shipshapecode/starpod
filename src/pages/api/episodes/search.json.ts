import type { APIRoute } from 'astro';
import { getAllEpisodes } from '../../../lib/rss';

export const prerender = true;

export const GET: APIRoute = async () => {
  const allEpisodes = await getAllEpisodes();

  // Return a simplified list of episodes optimized for search
  const searchableEpisodes = allEpisodes.map((episode) => ({
    id: episode.id,
    title: episode.title,
    description: episode.description,
    episodeNumber: episode.episodeNumber,
    episodeSlug: episode.episodeSlug,
    episodeThumbnail: episode.episodeThumbnail
  }));

  return new Response(JSON.stringify(searchableEpisodes), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
