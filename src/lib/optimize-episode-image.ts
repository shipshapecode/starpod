export async function resolveRedirects(url: string): Promise<string> {
  const response = await fetch(url, { method: 'GET', redirect: 'manual' });
  if (response.status >= 300 && response.status < 400) {
    return response.headers.get('location') ?? url;
  }
  return url;
}

export async function optimizeImage(
  image?: string,
  options?: { height?: number; width?: number }
) {
  if (image) {
    try {
      const resolvedImage = await resolveRedirects(image);
      const { getImage } = await import('astro:assets');
      const optimizedImage = await getImage({
        src: resolvedImage,
        format: 'avif',
        height: options?.height ?? 160,
        width: options?.width ?? 160,
        quality: 75
      });

      return optimizedImage.src;
    } catch {
      return image;
    }
  }
}
