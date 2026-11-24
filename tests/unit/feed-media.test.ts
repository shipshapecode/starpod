import { describe, expect, it } from 'vitest';
import {
  extractPeopleByGuid,
  extractVideosByGuid,
  isVideoType
} from 'starpod/src/lib/feed-media';

const feed = `<?xml version="1.0"?>
<rss><channel>
<item><title>With video</title><guid isPermaLink="false">flightcast:AAA</guid>
<enclosure url="https://example.com/a.mp3" type="audio/mpeg"/>
<podcast:alternateEnclosure type="application/x-mpegURL" length="0" title="HLS Video Stream" rel="alternate" default="false"><podcast:source uri="https://example.com/v/a.m3u8?x=1&amp;y=2"></podcast:source></podcast:alternateEnclosure>
</item>
<item><title>Audio only</title><guid>flightcast:BBB</guid>
<enclosure url="https://example.com/b.mp3" type="audio/mpeg"/>
</item>
<item><title>Quoting</title><guid><![CDATA[episode-A]]></guid>
<podcast:alternateEnclosure type='video/mp4'><podcast:source uri='https://example.com/q.mp4?a=1&#38;b=&amp;lt;2'/></podcast:alternateEnclosure>
</item>
<item><title>Audio alternate first</title><guid>CCC</guid>
<podcast:alternateEnclosure type="audio/opus"><podcast:source uri="https://example.com/c.opus"/></podcast:alternateEnclosure>
<podcast:alternateEnclosure type="video/mp4"><podcast:source uri="https://example.com/c.mp4"/></podcast:alternateEnclosure>
</item>
</channel></rss>`;

describe('extractVideosByGuid', () => {
  const videos = extractVideosByGuid(feed);

  it('finds an HLS alternate enclosure and decodes its URL', () => {
    expect(videos.get('flightcast:AAA')).toEqual({
      src: 'https://example.com/v/a.m3u8?x=1&y=2',
      type: 'application/x-mpegURL'
    });
  });

  it('reads CDATA guids, single-quoted attributes, and each reference once', () => {
    expect(videos.get('episode-A')).toEqual({
      src: 'https://example.com/q.mp4?a=1&b=&lt;2',
      type: 'video/mp4'
    });
  });

  it('leaves audio-only items out', () => {
    expect(videos.has('flightcast:BBB')).toBe(false);
  });

  it('skips non-video alternates and takes the first video one', () => {
    expect(videos.get('CCC')).toEqual({
      src: 'https://example.com/c.mp4',
      type: 'video/mp4'
    });
  });
});

describe('isVideoType', () => {
  it('accepts video and HLS types only', () => {
    expect(isVideoType('video/mp4')).toBe(true);
    expect(isVideoType('application/vnd.apple.mpegurl')).toBe(true);
    expect(isVideoType('audio/mpeg')).toBe(false);
  });
});

describe('extractPeopleByGuid', () => {
  const people = extractPeopleByGuid(`<rss><channel>
<podcast:person role="Host" img="https://example.com/show-host.jpg">Show Host</podcast:person>
<item><title>Two people</title><guid>flightcast:AAA</guid>
<podcast:person role="Host" img="https://example.com/r.jpg?a=1&amp;b=2" href="https://r.example/">Robbie Wagner</podcast:person>
<podcast:person role='Guest' href="https://g.example/"><![CDATA[Guest & Co]]></podcast:person>
<podcast:person>No Role</podcast:person>
<podcast:person role="guest"> </podcast:person>
</item>
<item><title>Nobody</title><guid>flightcast:BBB</guid></item>
</channel></rss>`);

  it("reads each item's people: name, role, photo and link", () => {
    expect(people.get('flightcast:AAA')).toEqual([
      {
        name: 'Robbie Wagner',
        role: 'host',
        img: 'https://example.com/r.jpg?a=1&b=2',
        href: 'https://r.example/'
      },
      {
        name: 'Guest & Co',
        role: 'guest',
        img: undefined,
        href: 'https://g.example/'
      },
      { name: 'No Role', role: 'host', img: undefined, href: undefined }
    ]);
  });

  it("leaves out items that name nobody, and the channel's own people", () => {
    expect(people.has('flightcast:BBB')).toBe(false);
    expect([...people.values()].flat().map((p) => p.name)).not.toContain(
      'Show Host'
    );
  });
});
