import type { APIRoute } from 'astro';

import { generateForLlmsMarkdown } from '../lib/llms';
import { getAllEpisodes, getShowInfo } from '../lib/rss';
import starpodConfig from '../../starpod.config';

export const GET: APIRoute = async ({ site }) => {
  const show = await getShowInfo();
  const episodes = await getAllEpisodes();

  const markdown = generateForLlmsMarkdown(show, episodes, starpodConfig, site);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
