// src/lib/image-utils.ts
export function getOptimizedImageUrl(
  originalUrl: string | null | undefined,
  width: number = 160,
  height: number = 160,
  quality: number = 75, // Lower quality for AVIF since it's more efficient
  format: 'avif' | 'webp' | 'auto' = 'avif'
): string {
  if (!originalUrl) {
    return '/images/www.png';
  }

  // In development, return original URL
  if (import.meta.env.DEV) {
    return originalUrl;
  }

  // In production on Vercel, use Vercel's Image Optimization API with AVIF
  const params = new URLSearchParams({
    url: originalUrl,
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    f: format, // Force AVIF format (smallest file size)
  });

  return `/_vercel/image?${params}`;
}

// Helper for generating multiple format URLs
export function getImageUrls(originalUrl: string | null | undefined) {
  if (!originalUrl) {
    const fallback = '/images/www.png';
    return { avif: fallback, webp: fallback, fallback };
  }
  
  return {
    avif: getOptimizedImageUrl(originalUrl, 160, 160, 75, 'avif'),
    webp: getOptimizedImageUrl(originalUrl, 160, 160, 85, 'webp'),
    fallback: originalUrl
  };
}