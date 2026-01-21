import type { APIRoute } from 'astro';

import { generateAboutMarkdown } from '../lib/llms';
import { getShowInfo } from '../lib/rss';
import starpodConfig from '../../starpod.config';

export const GET: APIRoute = async () => {
  const show = await getShowInfo();

  const markdown = generateAboutMarkdown(show, starpodConfig);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
