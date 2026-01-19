import { htmlToText } from 'html-to-text';
import parseFeed from 'rss-to-json';
import { array, number, object, optional, parse, string } from 'valibot';

import { optimizeImage } from './optimize-episode-image';
import { dasherize } from '../utils/dasherize';
import { truncate } from '../utils/truncate';
import starpodConfig from '../../starpod.config';

/**
 * Starting around episode 223, the RSS feed changed from HTML to plain text.
 * This transformer converts the new plain-text format to match the old HTML structure exactly.
 */
function transformPlainTextToHtml(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this is a timestamp line like "(00:00) - Intro"
    if (/^\(\d{2}:\d{2}(?::\d{2})?\)\s*-/.test(line)) {
      // Start collecting all consecutive timestamp lines into a list
      const listItems: string[] = [];
      while (i < lines.length && /^\(\d{2}:\d{2}(?::\d{2})?\)\s*-/.test(lines[i])) {
        listItems.push(escapeHtml(lines[i]));
        i++;
      }
      html.push('<ul>');
      listItems.forEach(item => html.push(`<li>${item}</li>`));
      html.push('</ul>');
      continue;
    }

    // Check if this is a section header (bold text like "**Links**" or just "Links")
    if (/^\*\*(.+?)\*\*$/.test(line)) {
      const text = line.replace(/^\*\*(.+?)\*\*$/, '$1');
      html.push(`<p><strong>${escapeHtml(text)}</strong></p>`);
      i++;
      continue;
    }

    // Check if this looks like a link list item (e.g., "CodeRabbit: https://...")
    if (/:?\s*https?:\/\//.test(line)) {
      // Collect all consecutive link lines into a list
      const linkItems: string[] = [];
      while (i < lines.length && /:?\s*https?:\/\//.test(lines[i])) {
        linkItems.push(lines[i]);
        i++;
      }
      html.push('<ul>');
      linkItems.forEach(item => {
        // Parse "Label: URL" or just "URL"
        const match = item.match(/^(.+?):\s*(https?:\/\/.+)$/);
        if (match) {
          const label = escapeHtml(match[1].trim());
          const url = escapeHtml(match[2].trim());
          html.push(`<li>${label}: <a href="${url}">${url}</a></li>`);
        } else {
          const urlMatch = item.match(/(https?:\/\/.+)/);
          if (urlMatch) {
            const url = escapeHtml(urlMatch[1].trim());
            html.push(`<li><a href="${url}">${url}</a></li>`);
          } else {
            html.push(`<li>${escapeHtml(item)}</li>`);
          }
        }
      });
      html.push('</ul>');
      continue;
    }

    // Default: regular paragraph
    html.push(`<p>${escapeHtml(line)}</p>`);
    i++;
  }

  return html.join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function looksLikeHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text.trim());
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