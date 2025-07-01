import { getImage } from 'astro:assets';

export async function optimizeImage(
  image?: string,
  options?: { height?: number; width?: number }
) {
  if (image) {
    const optimizedImage = await getImage({
      src: image,
      format: 'avif',
      height: options?.height ?? 160,
      width: options?.width ?? 160,
      quality: 75
    });

    return optimizedImage.src;
  }
}
