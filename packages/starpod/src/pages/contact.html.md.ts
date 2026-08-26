import type { APIRoute } from 'astro';

import { generateContactMarkdown } from '../lib/llms';
import { getShowInfo } from '../lib/rss';
import starpodConfig from 'virtual:starpod/config';

export const GET: APIRoute = async ({ site }) => {
  const show = await getShowInfo();

  const markdown = generateContactMarkdown(show, starpodConfig, site);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
