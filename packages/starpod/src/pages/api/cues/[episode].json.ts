import type { APIRoute, GetStaticPaths } from 'astro';

import { getEpisodeCues } from '../../../lib/episode-cues';
import { getAllEpisodes, type Episode } from '../../../lib/rss';

/**
 * Timed transcript lines for one episode, fetched lazily by the stage's
 * live transcript. Episodes without a transcript return an empty list.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const episodes = await getAllEpisodes();
  return episodes.map((episode) => ({
    params: { episode: episode.episodeSlug },
    props: { episode }
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const cues = await getEpisodeCues(props.episode as Episode);
  return new Response(JSON.stringify(cues ?? []), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
};
