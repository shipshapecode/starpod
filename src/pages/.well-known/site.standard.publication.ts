import type { APIRoute } from 'astro';
import { generatePublicationWellKnown } from '@bryanguffey/astro-standard-site';
import starpodConfig from '../../../starpod.config';

export const GET: APIRoute = () => {
  const { standardSite } = starpodConfig;

  if (!standardSite) {
    return new Response('standard.site not configured', { status: 404 });
  }

  return new Response(
    generatePublicationWellKnown({
      did: standardSite.did,
      publicationRkey: standardSite.publicationRkey
    }),
    { headers: { 'Content-Type': 'text/plain' } }
  );
};
