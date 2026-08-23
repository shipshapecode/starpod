import type { APIRoute } from 'astro';

import { generateHomeMarkdown } from '../lib/llms';
import { getAllEpisodes, getShowInfo } from '../lib/rss';
import starpodConfig from '../../starpod.config';

export const GET: APIRoute = async ({ site }) => {
  const show = await getShowInfo();
  const episodes = await getAllEpisodes();

  const markdown = generateHomeMarkdown(
    show,
    episodes.slice(0, 10),
    starpodConfig,
    site
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
