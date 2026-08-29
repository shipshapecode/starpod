import type { APIRoute } from 'astro';
import { generatePublicationWellKnown } from '@bryanguffey/astro-standard-site';

export const GET: APIRoute = () => {
  const did = import.meta.env.STANDARD_SITE_DID;
  const publicationRkey = import.meta.env.STANDARD_SITE_PUBLICATION_RKEY;

  if (!did || !publicationRkey) {
    return new Response('standard.site not configured', { status: 404 });
  }

  return new Response(
    generatePublicationWellKnown({ did, publicationRkey }),
    { headers: { 'Content-Type': 'text/plain' } }
  );
};
