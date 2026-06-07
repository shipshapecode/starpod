/**
 * Publish podcast episodes to ATProto via standard.site
 *
 * Each episode is published as an individual document record.
 * Supports both incremental publishing (new episodes only) and
 * full backfill (all episodes).
 *
 * Required environment variables:
 *   ATPROTO_HANDLE - Your Bluesky handle (e.g., your-handle.bsky.social)
 *   ATPROTO_APP_PASSWORD - An app password from bsky.app/settings/app-passwords
 *   STANDARD_SITE_URL - Your podcast site URL (e.g., https://whiskey.fm)
 *   STANDARD_SITE_PUBLICATION_RKEY - The publication record key
 *
 * Usage:
 *   pnpm publish:episodes          # publish new episodes only
 *   pnpm publish:episodes:backfill # publish all episodes (backfill)
 */

import { htmlToText } from 'html-to-text';
import parseFeed from 'rss-to-json';
import { array, number, object, optional, parse, string } from 'valibot';

import {
  StandardSitePublisher,
  type PublishDocumentInput
} from '@bryanguffey/astro-standard-site';

import starpodConfig from '../starpod.config';
import { dasherize } from '../src/utils/dasherize';

const BACKFILL = process.argv.includes('--backfill');

const identifier = process.env.ATPROTO_HANDLE;
const password = process.env.ATPROTO_APP_PASSWORD;
const siteUrl = process.env.STANDARD_SITE_URL;
const publicationRkey = process.env.STANDARD_SITE_PUBLICATION_RKEY;

if (!identifier || !password || !siteUrl || !publicationRkey) {
  console.error(
    'Missing required environment variables. Need: ATPROTO_HANDLE, ATPROTO_APP_PASSWORD, STANDARD_SITE_URL, STANDARD_SITE_PUBLICATION_RKEY'
  );
  process.exit(1);
}

const FeedSchema = object({
  items: array(
    object({
      id: string(),
      title: string(),
      published: number(),
      description: string(),
      content_encoded: optional(string()),
      itunes_duration: number(),
      itunes_episode: optional(number()),
      itunes_episodeType: string(),
      itunes_image: optional(object({ href: optional(string()) })),
      enclosures: array(
        object({
          url: string(),
          type: string()
        })
      )
    })
  )
});

interface FeedEpisode {
  id: string;
  title: string;
  published: number;
  description: string;
  content_encoded?: string;
  itunes_duration: number;
  itunes_episode?: number;
  itunes_episodeType: string;
}

async function main() {
  console.log(
    BACKFILL ? '📚 Backfilling all episodes...' : '🆕 Publishing new episodes...'
  );

  // Fetch episodes from RSS
  // @ts-expect-error rss-to-json types don't match runtime API
  const feed = await parseFeed.parse(starpodConfig.rssFeed);
  const { items } = parse(FeedSchema, feed);

  const episodes = items.filter(
    (item) => item.itunes_episodeType !== 'trailer'
  );

  // Initialize publisher
  const publisher = new StandardSitePublisher({
    identifier,
    password
  });

  await publisher.login();
  console.log(`✅ Logged in as ${publisher.getDid()}`);

  // Get existing documents to avoid duplicates
  const existingDocs = await publisher.listDocuments(100);
  const existingPaths = new Set(
    existingDocs
      .map((doc) => doc.value.path)
      .filter(Boolean)
  );

  let published = 0;
  let skipped = 0;

  for (const episode of episodes) {
    const slug = dasherize(episode.title);
    const path = `/${slug}`;

    if (!BACKFILL && existingPaths.has(path)) {
      skipped++;
      continue;
    }

    const description = htmlToText(episode.description, {
      wordwrap: false
    }).slice(0, 300);

    const textContent = episode.content_encoded
      ? htmlToText(episode.content_encoded, { wordwrap: false })
      : description;

    const input: PublishDocumentInput = {
      site: siteUrl,
      path,
      title: episode.title,
      description,
      publishedAt: new Date(episode.published).toISOString(),
      textContent,
      tags: ['podcast']
    };

    try {
      const result = await publisher.publishDocument(input);
      console.log(`  ✅ ${episode.title}`);
      console.log(`     → ${result.uri}`);
      published++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Skip duplicates gracefully during backfill
      if (message.includes('already exists') || message.includes('duplicate')) {
        console.log(`  ⏭️  ${episode.title} (already exists)`);
        skipped++;
      } else {
        console.error(`  ❌ ${episode.title}: ${message}`);
      }
    }
  }

  console.log(
    `\n🎉 Done! Published: ${published}, Skipped: ${skipped}, Total episodes: ${episodes.length}`
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
