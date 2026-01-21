import type { APIRoute } from 'astro';

import { generateEpisodesIndex } from '../lib/llms';
import { getAllEpisodes, getShowInfo } from '../lib/rss';

export const GET: APIRoute = async ({ site }) => {
  const show = await getShowInfo();
  const episodes = await getAllEpisodes();

  const markdown = generateEpisodesIndex(show, episodes, site);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
