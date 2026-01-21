import { getEntry } from 'astro:content';
import type { APIRoute } from 'astro';

import { cleanTranscript, generateEpisodeMarkdown } from '../lib/llms';
import { getAllEpisodes, getShowInfo } from '../lib/rss';
import starpodConfig from '../../starpod.config';

export async function getStaticPaths() {
  const allEpisodes = await getAllEpisodes();

  return allEpisodes.flatMap((episode) => {
    return [
      {
        params: { episode: episode.episodeNumber },
        props: { episode }
      },
      {
        params: { episode: episode.episodeSlug },
        props: { episode }
      }
    ];
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { episode } = props;
  const show = await getShowInfo();

  // Check for transcript (same logic as [episode].astro)
  let transcriptContent = '';
  if (episode.episodeNumber && episode.episodeNumber !== 'Bonus') {
    const transcript = await getEntry('transcripts', episode.episodeNumber);
    if (transcript) {
      // Clean the transcript by removing timestamps
      transcriptContent = cleanTranscript(transcript.body);
    }
  }

  const markdown = generateEpisodeMarkdown(
    episode,
    show,
    starpodConfig,
    transcriptContent
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
