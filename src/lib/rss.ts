import { htmlToText } from 'html-to-text';
import parseFeed from 'rss-to-json';
import { array, number, object, optional, parse, string } from 'valibot';

import { optimizeImage } from './optimize-episode-image';
import {
  escapeHtml,
  looksLikeHtml,
  transformPlainTextToHtml
} from './rss-transform';
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

  // @ts-expect-error
  let feed = (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
  let items = parse(FeedSchema, feed).items;

  let episodes: Array<Episode> = await Promise.all(
    items
      .filter((item) => item.itunes_episodeType !== 'trailer')
      .map(
        async ({
          description,
          id,
          title,
          enclosures,
          published,
          itunes_duration,
          itunes_episode,
          itunes_episodeType,
          itunes_image
        }) => {
          const episodeNumber =
            itunes_episodeType === 'bonus' ? 'Bonus' : `${itunes_episode}`;
          const episodeSlug = dasherize(title);

          return {
            id,
            title: `${title}`,
            content: looksLikeHtml(description)
              ? description
              : transformPlainTextToHtml(description),
            description: truncate(htmlToText(description), 260),
            duration: itunes_duration,
            episodeImage: itunes_image?.href,
            episodeNumber,
            episodeSlug,
            episodeThumbnail: await optimizeImage(itunes_image?.href),
            published,
            audio: enclosures.map((enclosure) => ({
              src: enclosure.url,
              type: enclosure.type
            }))[0]
          };
        }
      )
  );

  episodesCache = episodes;
  return episodes;
}