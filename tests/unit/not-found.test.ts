import { describe, expect, it } from 'vitest';

import { generateNotFoundMarkdown } from 'starpod/src/lib/not-found';
import type { Show } from 'starpod/src/lib/rss';

describe('generateNotFoundMarkdown', () => {
  const mockShow: Show = {
    title: 'Test Podcast',
    description: 'A test podcast',
    image: 'https://example.com/image.jpg',
    link: 'https://example.com'
  };

  it('names the missing path and links recovery entry points', () => {
    const siteUrl = new URL('https://podcast.example.com');
    const result = generateNotFoundMarkdown('/missing-page', mockShow, siteUrl);

    expect(result).toContain('# 404');
    expect(result).toContain('`/missing-page`');
    expect(result).toContain('## Where To Look Next');
    expect(result).toContain('https://podcast.example.com/llms.txt');
    expect(result).toContain(
      'https://podcast.example.com/episodes-index.html.md'
    );
    expect(result).toContain('https://podcast.example.com/sitemap-index.xml');
    expect(result).toContain('https://podcast.example.com/openapi.json');
  });
});
