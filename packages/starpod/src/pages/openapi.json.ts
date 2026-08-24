import type { APIRoute } from 'astro';

import { generateOpenApiSpec } from '../lib/openapi';
import { getShowInfo } from '../lib/rss';
import starpodConfig from 'virtual:starpod/config';

export const GET: APIRoute = async ({ site }) => {
  const show = await getShowInfo();

  const spec = generateOpenApiSpec(show, starpodConfig, site);

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
};
