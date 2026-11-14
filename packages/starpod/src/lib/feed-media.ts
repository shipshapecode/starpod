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

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function attribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return match ? decodeEntities(match[1]) : undefined;
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
        videos.set(decodeEntities(guid.trim()), { src, type });
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
    const response = await fetch(feedUrl);
    if (!response.ok) {
      return new Map();
    }
    return extractVideosByGuid(await response.text());
  } catch {
    return new Map();
  }
}
