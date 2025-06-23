// src/pages/api/[page].json.ts
import type { APIRoute } from 'astro';
import { getAllEpisodes } from '../../../lib/rss';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const episodesPerPage = 15;

// Image optimization configuration
const OUTPUT_DIR = './public/opt-images';
const IMAGE_QUALITY = 75;
const IMAGE_SIZE = 160;
const IMAGE_FORMAT = 'avif' as const;

// Check if we're in development mode
const isDev = import.meta.env.DEV;

// Get all episodes and optimize their images (only in production)
const allEpisodes = await getAllEpisodes();
const processedEpisodes = isDev
  ? allEpisodes
  : await optimizeAllEpisodeImages(allEpisodes);

export async function getStaticPaths({ paginate }: { paginate: any }) {
  return paginate(processedEpisodes, { pageSize: episodesPerPage });
}

export const GET: APIRoute = async ({ props }) => {
  const page = props.page.currentPage;
  const canLoadMore = page * episodesPerPage < processedEpisodes.length;
  return new Response(
    JSON.stringify({
      canLoadMore,
      episodes: props.page.data // Return the actual episode data, not the page object
    })
  );
};

/**
 * Optimize images for all episodes and add optimizedImageThumbnail property
 * Only runs in production builds
 */
async function optimizeAllEpisodeImages(episodes: any[]): Promise<any[]> {
  console.log('🖼️  Starting episode image optimization (production mode)...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }

  // Process episodes with their images
  const processedEpisodes = [];

  for (const episode of episodes) {
    const processedEpisode = { ...episode };

    if (episode.episodeImage && episode.episodeImage.startsWith('http')) {
      try {
        const optimizedPath = await optimizeImage(episode.episodeImage);
        if (optimizedPath) {
          processedEpisode.optimizedImageThumbnail = optimizedPath;
          console.log(`✅ Optimized: ${episode.title}`);
        }
      } catch (error: unknown) {
        console.error(
          `❌ Failed to optimize image for ${episode.title}:`,
          (error as Error).message
        );
      }
    }

    processedEpisodes.push(processedEpisode);
  }

  return processedEpisodes;
}

/**
 * Optimize a single image and return the public path
 */
async function optimizeImage(imageUrl: string): Promise<string | null> {
  try {
    // Generate consistent filename based on URL
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    const filename = `${hash}.${IMAGE_FORMAT}`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    const publicPath = `/opt-images/${filename}`;

    // Skip if already optimized
    if (fs.existsSync(outputPath)) {
      return publicPath;
    }

    // Fetch image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AstroBuild/1.0)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();

      // Optimize with Sharp
      await sharp(Buffer.from(buffer))
        .resize(IMAGE_SIZE, IMAGE_SIZE, {
          fit: 'cover',
          position: 'center'
        })
        .avif({
          quality: IMAGE_QUALITY,
          effort: 6
        })
        .toFile(outputPath);

      return publicPath;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: unknown) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Timeout fetching image: ${imageUrl}`);
    }
    throw new Error(`${(error as Error).message} (${imageUrl})`);
  }
}
