import type { APIRoute } from 'astro';

import { generateLlmsTxt } from '../lib/llms';
import { getAllEpisodes, getShowInfo } from '../lib/rss';
import starpodConfig from '../../starpod.config';

export const GET: APIRoute = async ({ site }) => {
  const show = await getShowInfo();
  const episodes = await getAllEpisodes();

  // Get top 10 most recent episodes for highlighting
  const recentEpisodes = episodes.slice(0, 10);

  // Generate llms.txt content following spec
  const content = generateLlmsTxt(show, recentEpisodes, starpodConfig, site);

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
