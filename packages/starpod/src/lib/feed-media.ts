/**
 * Video discovery for feed items.
 *
 * `rss-to-json` drops nested Podcasting 2.0 elements such as
 * `<podcast:alternateEnclosure>`, so the raw feed XML is scanned here instead.
 * An item's video is its first alternate enclosure whose type is video or an
 * HLS playlist; the `<podcast:source uri>` inside it is the stream URL.
 */

export interface FeedVideo {
  src: string;
  type: string;
}

const HLS_TYPES = ['application/x-mpegurl', 'application/vnd.apple.mpegurl'];
const FETCH_TIMEOUT_MS = 10_000;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  quot: '"'
};

/**
 * Decode XML character references in one pass, so each reference in the
 * original text is decoded exactly once (`&amp;lt;` stays the literal `&lt;`).
 */
function decodeEntities(value: string): string {
  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|(amp|apos|gt|lt|quot));/gi,
    (reference, decimal?: string, hex?: string, name?: string) => {
      if (name) {
        return NAMED_ENTITIES[name.toLowerCase()];
      }
      const codePoint = decimal ? Number(decimal) : parseInt(hex!, 16);
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : reference;
    }
  );
}

// Attribute names are fixed by this module, never taken from the feed.
const ATTRIBUTE_PATTERNS: Record<'type' | 'uri', RegExp> = {
  type: /\btype\s*=\s*(["'])(.*?)\1/i,
  uri: /\buri\s*=\s*(["'])(.*?)\1/i
};

function attribute(tag: string, name: 'type' | 'uri'): string | undefined {
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

/**
 * Map each item's guid to its video, for items that carry one.
 */
export function extractVideosByGuid(xml: string): Map<string, FeedVideo> {
  const videos = new Map<string, FeedVideo>();

  for (const item of xml.split(/<item[\s>]/i).slice(1)) {
    const body = item.split(/<\/item>/i)[0];
    const guid = body.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1];
    if (!guid) {
      continue;
    }

    const enclosures = body.match(
      /<podcast:alternateEnclosure\b[\s\S]*?<\/podcast:alternateEnclosure>/gi
    );
    for (const enclosure of enclosures ?? []) {
      const openTag = enclosure.match(/<podcast:alternateEnclosure\b[^>]*>/i)![0];
      const type = attribute(openTag, 'type') ?? '';
      if (!isVideoType(type)) {
        continue;
      }
      const sourceTag = enclosure.match(/<podcast:source\b[^>]*>/i)?.[0];
      const src = sourceTag && attribute(sourceTag, 'uri');
      if (src) {
        videos.set(characterData(guid), { src, type });
        break;
      }
    }
  }

  return videos;
}

/**
 * Fetch the feed and extract its videos. A failure here must never break the
 * build: the site simply falls back to audio-first everywhere.
 */
export async function fetchFeedVideos(
  feedUrl: string
): Promise<Map<string, FeedVideo>> {
  try {
    // A deadline on the whole request, body included: a stalled response
    // must not hold up the build, which then falls back to audio.
    const response = await fetch(feedUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) {
      return new Map();
    }
    return extractVideosByGuid(await response.text());
  } catch {
    return new Map();
  }
}
