import { htmlToText } from 'html-to-text';
import parseFeed from 'rss-to-json';
import {
  array,
  number,
  object,
  optional,
  parse,
  string,
  union
} from 'valibot';

import { optimizeImage } from './optimize-episode-image';
import type { StarpodConfig } from '../utils/config';
import { dasherize } from '../utils/dasherize';
import { truncate } from '../utils/truncate';

// Inside Astro (dev, build, vitest) the config comes from the integration's
// virtual module. Standalone scripts (e.g. `db/seed.ts` under tsx) have no
// Vite, so they must pass their config explicitly and the dynamic import is
// never reached.
async function resolveRssFeed(config?: StarpodConfig): Promise<string> {
  if (config) {
    return config.rssFeed;
  }
  const { default: starpodConfig } = await import('virtual:starpod/config');
  return starpodConfig.rssFeed;
}

export interface Show {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Episode {
  id: string;
  title: string;
  published: number;
  description: string;
  duration: number;
  content: string;
  episodeImage?: string;
  episodeNumber?: string;
  episodeSlug: string;
  episodeThumbnail?: string;
  audio: {
    src: string;
    type: string;
  };
  // A transcript referenced by the feed's `<podcast:transcript>` tag, if any.
  // Used as a fallback when no explicit markdown transcript is provided for the
  // episode.
  transcriptUrl?: string;
  transcriptType?: string;
}

// A single `<podcast:transcript>` entry from the RSS feed.
const TranscriptSchema = object({
  url: string(),
  type: optional(string()),
  language: optional(string()),
  rel: optional(string())
});

// A feed may list zero, one, or several transcripts per episode. Prefer a JSON
// transcript (Flightcast's format), then VTT, then whatever comes first.
function pickTranscript(
  transcript:
    | { url: string; type?: string }
    | Array<{ url: string; type?: string }>
    | undefined
) {
  if (!transcript) {
    return undefined;
  }

  const list = Array.isArray(transcript) ? transcript : [transcript];

  return (
    list.find((t) => t.type?.toLowerCase().includes('json')) ??
    list.find((t) => t.type?.toLowerCase().includes('vtt')) ??
    list[0]
  );
}

let showInfoCache: Show | null = null;

export async function getShowInfo(config?: StarpodConfig) {
  if (showInfoCache) {
    return showInfoCache;
  }

  // @ts-expect-error
  const showInfo = (await parseFeed.parse(await resolveRssFeed(config))) as Show;
  showInfo.image = (await optimizeImage(showInfo.image, {
    height: 640,
    width: 640
  })) as string;

  showInfoCache = showInfo;
  return showInfo;
}

let episodesCache: Array<Episode> | null = null;

export async function getAllEpisodes(config?: StarpodConfig) {
  if (episodesCache) {
    return episodesCache;
  }
  let FeedSchema = object({
    items: array(
      object({
        id: string(),
        title: string(),
        published: number(),
        description: string(),
        content_encoded: optional(string()),
        podcast_transcript: optional(
          union([TranscriptSchema, array(TranscriptSchema)])
        ),
        itunes_duration: number(),
        itunes_episode: optional(number()),
        itunes_episodeType: string(),
        itunes_image: optional(object({ href: optional(string()) })),
        // A feed may list several enclosures (e.g. the audio file plus a
        // generated cover image); the image enclosure has no `type`.
        enclosures: array(
          object({
            url: string(),
            type: optional(string())
          })
        )
      })
    )
  });

  // @ts-expect-error
  let feed = (await parseFeed.parse(await resolveRssFeed(config))) as Show;
  let items = parse(FeedSchema, feed).items;

  let episodes: Array<Episode> = await Promise.all(
    items
      .filter((item) => item.itunes_episodeType !== 'trailer')
      .map(
        async ({
          description,
          content_encoded,
          id,
          title,
          enclosures,
          published,
          podcast_transcript,
          itunes_duration,
          itunes_episode,
          itunes_episodeType,
          itunes_image
        }) => {
          const episodeNumber =
            itunes_episodeType === 'bonus' ? 'Bonus' : `${itunes_episode}`;
          const episodeSlug = dasherize(title);
          const episodeContent = content_encoded || description;
          const transcript = pickTranscript(podcast_transcript);
          const audioEnclosure =
            enclosures.find((enclosure) =>
              enclosure.type?.toLowerCase().startsWith('audio/')
            ) ?? enclosures[0];

          return {
            id,
            title: `${title}`,
            content: episodeContent,
            description: truncate(htmlToText(description), 260),
            duration: itunes_duration,
            episodeImage: itunes_image?.href,
            episodeNumber,
            episodeSlug,
            episodeThumbnail: await optimizeImage(itunes_image?.href),
            published,
            transcriptUrl: transcript?.url,
            transcriptType: transcript?.type,
            audio: {
              src: audioEnclosure.url,
              type: audioEnclosure.type ?? 'audio/mpeg'
            }
          };
        }
      )
  );

  episodesCache = episodes;
  return episodes;
}
