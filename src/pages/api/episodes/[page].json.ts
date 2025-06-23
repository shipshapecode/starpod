import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getAllEpisodes } from '../../../lib/rss';

const episodesPerPage = 15;
const allEpisodes = await getAllEpisodes();

for (const episode of allEpisodes) {
  if (episode.episodeImage) {
    const optimizedImage = await getImage({
      src: episode.episodeImage,
      format: 'avif',
      height: 160,
      width: 160,
      quality: 75
    });
    episode.episodeImage = optimizedImage.src;
  }
}

export async function getStaticPaths({ paginate }: { paginate: any }) {
  return paginate(allEpisodes, { pageSize: episodesPerPage });
}

export const GET: APIRoute = async ({ props }) => {
  const page = props.page.currentPage;
  const canLoadMore = page * episodesPerPage < allEpisodes.length;
  return new Response(JSON.stringify({ canLoadMore, episodes: props.page }));
};
