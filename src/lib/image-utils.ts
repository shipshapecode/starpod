// src/lib/image-utils.ts
export function getOptimizedImageUrl(
  originalUrl: string | null | undefined,
  width: number = 160,
  height: number = 160
): string {
  if (!originalUrl) {
    return '/images/www.png';
  }

  try {
    // Use Astro's image service endpoint
    // This works because Astro creates /_image endpoints when image service is configured
    const params = new URLSearchParams({
      href: originalUrl,
      w: width.toString(),
      h: height.toString(),
      f: 'webp', // Format
      q: '85' // Quality
    });

    return `/_image?${params}`;
  } catch (error) {
    console.error('Error generating optimized image URL:', error);
    return originalUrl;
  }
}
