import { XMLParser } from 'fast-xml-parser';
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
import { dasherize } from '../utils/dasherize';
import { truncate } from '../utils/truncate';
import starpodConfig from '../../starpod.config';

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
  /**
   * HLS video stream, when the feed provides a `<podcast:alternateEnclosure>`
   * with a `application/x-mpegURL` source. Absent for audio-only episodes.
   */
  video?: {
    src: string;
    type: string;
  };
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

export async function getShowInfo() {
  if (showInfoCache) {
    return showInfoCache;
  }

  // @ts-expect-error
  const showInfo = (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
  showInfo.image = (await optimizeImage(showInfo.image, {
    height: 640,
    width: 640
  })) as string;

  showInfoCache = showInfo;
  return showInfo;
}

const HLS_TYPE = 'application/x-mpegURL';

let videoMapCache: Map<string, Episode['video']> | null = null;

/**
 * `rss-to-json` only surfaces a hardcoded allowlist of fields and drops
 * `<podcast:alternateEnclosure>` entirely, so we parse the raw feed XML once to
 * pull the HLS video stream for each episode, keyed by guid.
 */
async function getEpisodeVideos() {
  if (videoMapCache) {
    return videoMapCache;
  }

  const map = new Map<string, Episode['video']>();

  const res = await fetch(starpodConfig.rssFeed);
  const xml = await res.text();
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);

  const channel = parsed?.rss?.channel ?? parsed?.feed;
  let items = channel?.item ?? [];
  if (!Array.isArray(items)) {
    items = [items];
  }

  for (const item of items) {
    const guid =
      typeof item?.guid === 'object' ? item.guid['#text'] : item?.guid;
    if (!guid) {
      continue;
    }

    let alternates = item['podcast:alternateEnclosure'];
    if (!alternates) {
      continue;
    }
    if (!Array.isArray(alternates)) {
      alternates = [alternates];
    }

    const hls = alternates.find(
      (alt: Record<string, unknown>) => alt['@_type'] === HLS_TYPE
    );
    const source = hls?.['podcast:source'];
    const uri = Array.isArray(source)
      ? source[0]?.['@_uri']
      : source?.['@_uri'];

    if (uri) {
      map.set(String(guid), { src: uri, type: HLS_TYPE });
    }
  }

  videoMapCache = map;
  return map;
}

let episodesCache: Array<Episode> | null = null;

export async function getAllEpisodes() {
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
  let feed = (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
  let items = parse(FeedSchema, feed).items;

  const videoMap = await getEpisodeVideos();

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
            },
            video: videoMap.get(id)
          };
        }
      )
  );

  episodesCache = episodes;
  return episodes;
}
