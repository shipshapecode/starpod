import { getImage } from 'astro:assets';

export async function optimizeEpisodeImage(episodeImage?: string) {
  if (episodeImage) {
    const optimizedImage = await getImage({
      src: episodeImage,
      format: 'avif',
      height: 160,
      width: 160,
      quality: 75
    });

    return optimizedImage.src;
  }
}
