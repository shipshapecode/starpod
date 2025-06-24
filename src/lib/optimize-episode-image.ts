import { getImage } from 'astro:assets';

import type { Episode } from './rss';

export async function optimizeEpisodeImage(episode: Episode) {
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
