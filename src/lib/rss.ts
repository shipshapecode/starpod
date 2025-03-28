import { htmlToText } from 'html-to-text';
import parseFeed from 'rss-to-json';
import { array, number, object, optional, parse, string } from 'valibot';

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
  content: string;
  episodeImage?: string;
  episodeNumber?: string;
  episodeSlug: string;
  audio: {
    src: string;
    type: string;
  };
}

export async function getShowInfo() {
  // @ts-expect-error
  return (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
}

export async function getAllEpisodes() {
  let FeedSchema = object({
    items: array(
      object({
        id: string(),
        title: string(),
        published: number(),
        description: string(),
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

  let episodes: Array<Episode> = items
    .filter((item) => item.itunes_episodeType !== 'trailer')
    .map(
      ({
        description,
        id,
        title,
        enclosures,
        published,
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
          content: description,
          description: truncate(htmlToText(description), 260),
          // If the image path includes 3000x3000 we can probably replace the size with 160x160 and save bytes.
          episodeImage: itunes_image?.href?.replace('3000x3000', '160x160'),
          episodeNumber,
          episodeSlug,
          published,
          audio: enclosures.map((enclosure) => ({
            src: enclosure.url,
            type: enclosure.type
          }))[0]
        };
      }
    );

  return episodes;
}
