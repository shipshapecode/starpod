// src/pages/api/image.ts
import sharp from 'sharp';
import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const prerender = false;

const CACHE_DIR = './public/image-cache';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = new URL(url).searchParams;
  const imageUrl = searchParams.get('src');

  if (!imageUrl) {
    return new Response('Missing src parameter', { status: 400 });
  }

  try {
    // Create cache key from URL
    const cacheKey = crypto.createHash('md5').update(imageUrl).digest('hex');
    const cachePath = path.join(CACHE_DIR, `${cacheKey}.avif`);

    // Check if cached version exists
    if (fs.existsSync(cachePath)) {
      const cachedImage = fs.readFileSync(cachePath);
      return new Response(cachedImage, {
        headers: {
          'Content-Type': 'image/avif',
          'Cache-Control': 'public, max-age=31536000' // 1 year
        }
      });
    }

    // Fetch original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Process with Sharp: resize to 160x160 and convert to avif
    const processedImage = await sharp(Buffer.from(imageBuffer))
      .resize(160, 160, {
        fit: 'cover',
        position: 'center'
      })
      .avif({ quality: 75 })
      .toBuffer();

    // Cache the processed image
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePath, processedImage);

    return new Response(processedImage, {
      headers: {
        'Content-Type': 'image/avif',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (error) {
    console.error('Image processing error:', error);

    // Return your default image as fallback
    try {
      const fallbackPath = './public/images/www.png';
      const fallbackImage = fs.readFileSync(fallbackPath);
      return new Response(fallbackImage, {
        headers: { 'Content-Type': 'image/png' }
      });
    } catch {
      return new Response('Image not found', { status: 404 });
    }
  }
};
