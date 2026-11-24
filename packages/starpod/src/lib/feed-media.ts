/**
 * Video and people discovery for feed items.
 *
 * `rss-to-json` drops nested Podcasting 2.0 elements such as
 * `<podcast:alternateEnclosure>`, so the raw feed XML is scanned here instead.
 * An item's video is its first alternate enclosure whose type is video or an
 * HLS playlist; the `<podcast:source uri>` inside it is the stream URL. Its
 * people are its `<podcast:person>` tags: a name, and a role, photo and link
 * when given.
 */

import { decodeEntities } from './entities';

export interface FeedVideo {
  src: string;
  type: string;
}

export interface FeedPerson {
  name: string;
  /** The tag's role, lower case; the namespace's default is host. */
  role: string;
  img?: string;
  href?: string;
}

const HLS_TYPES = ['application/x-mpegurl', 'application/vnd.apple.mpegurl'];
const FETCH_TIMEOUT_MS = 10_000;

// Attribute names are fixed by this module, never taken from the feed.
const ATTRIBUTE_PATTERNS = {
  href: /\bhref\s*=\s*(["'])(.*?)\1/i,
  img: /\bimg\s*=\s*(["'])(.*?)\1/i,
  role: /\brole\s*=\s*(["'])(.*?)\1/i,
  type: /\btype\s*=\s*(["'])(.*?)\1/i,
  uri: /\buri\s*=\s*(["'])(.*?)\1/i
} as const;

function attribute(
  tag: string,
  name: keyof typeof ATTRIBUTE_PATTERNS
): string | undefined {
  const match = tag.match(ATTRIBUTE_PATTERNS[name]);
  return match ? decodeEntities(match[2]) : undefined;
}

/** An element's character data: CDATA sections as-is, the rest decoded. */
function characterData(raw: string): string {
  return raw
    .split(/(<!\[CDATA\[[\s\S]*?\]\]>)/)
    .map((part) =>
      part.startsWith('<![CDATA[') ? part.slice(9, -3) : decodeEntities(part)
    )
    .join('')
    .trim();
}

export function isVideoType(type: string): boolean {
  const lower = type.toLowerCase();
  return lower.startsWith('video/') || HLS_TYPES.includes(lower);
}

/** Each item's body, with its guid. */
function* itemsOf(xml: string): Generator<[guid: string, body: string]> {
  for (const item of xml.split(/<item[\s>]/i).slice(1)) {
    const body = item.split(/<\/item>/i)[0];
    const guid = body.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1];
    if (guid) {
      yield [characterData(guid), body];
    }
  }
}

/**
 * Map each item's guid to its video, for items that carry one.
 */
export function extractVideosByGuid(xml: string): Map<string, FeedVideo> {
  const videos = new Map<string, FeedVideo>();

  for (const [guid, body] of itemsOf(xml)) {
    const enclosures = body.match(
      /<podcast:alternateEnclosure\b[\s\S]*?<\/podcast:alternateEnclosure>/gi
    );
    for (const enclosure of enclosures ?? []) {
      const openTag = enclosure.match(
        /<podcast:alternateEnclosure\b[^>]*>/i
      )![0];
      const type = attribute(openTag, 'type') ?? '';
      if (!isVideoType(type)) {
        continue;
      }
      const sourceTag = enclosure.match(/<podcast:source\b[^>]*>/i)?.[0];
      const src = sourceTag && attribute(sourceTag, 'uri');
      if (src) {
        videos.set(guid, { src, type });
        break;
      }
    }
  }

  return videos;
}

/**
 * Map each item's guid to its people, for items that name any. (The
 * channel's own people are the show's current ones, not every episode's.)
 */
export function extractPeopleByGuid(
  xml: string
): Map<string, Array<FeedPerson>> {
  const people = new Map<string, Array<FeedPerson>>();

  for (const [guid, body] of itemsOf(xml)) {
    const found: Array<FeedPerson> = [];
    for (const [, tag, text] of body.matchAll(
      /(<podcast:person\b[^>]*>)([\s\S]*?)<\/podcast:person>/gi
    )) {
      const name = characterData(text);
      if (!name) {
        continue;
      }
      found.push({
        name,
        role: (attribute(tag, 'role') ?? 'host').toLowerCase(),
        img: attribute(tag, 'img') || undefined,
        href: attribute(tag, 'href') || undefined
      });
    }
    if (found.length) {
      people.set(guid, found);
    }
  }

  return people;
}

/**
 * Fetch the feed and extract its videos and people. A failure here must never
 * break the build: the site simply falls back to audio-first everywhere, and
 * to whoever the guests database names.
 */
export async function fetchFeedExtras(feedUrl: string): Promise<{
  videos: Map<string, FeedVideo>;
  people: Map<string, Array<FeedPerson>>;
}> {
  try {
    // A deadline on the whole request, body included: a stalled response
    // must not hold up the build, which then falls back to audio.
    const response = await fetch(feedUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) {
      return { videos: new Map(), people: new Map() };
    }
    const xml = await response.text();
    return {
      videos: extractVideosByGuid(xml),
      people: extractPeopleByGuid(xml)
    };
  } catch {
    return { videos: new Map(), people: new Map() };
  }
}
