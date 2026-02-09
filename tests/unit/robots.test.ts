import { describe, expect, it, beforeEach } from 'vitest';
import { getRobotsTxt } from '../../src/pages/robots.txt';

describe('Robots.txt', () => {
  let mockSite: URL;
  let mockSitemap: URL;
  let robotsTxt: string;

  beforeEach(() => {
    mockSite = new URL('https://whiskey.fm');
    mockSitemap = new URL('sitemap-index.xml', mockSite);
    robotsTxt = getRobotsTxt(mockSitemap, mockSite);
  });

  describe('Generated content', () => {
    it('should contain welcoming comment for AI agents', () => {
      expect(robotsTxt).toContain('Welcome AI agents and crawlers');
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
    });

    it('should include sitemap reference', () => {
      expect(robotsTxt).toContain('Sitemap: https://whiskey.fm/sitemap-index.xml');
    });

    it('should reference LLM-specific resources', () => {
      expect(robotsTxt).toContain('/llms.txt');
      expect(robotsTxt).toContain('/for-llms');
      expect(robotsTxt).toContain('/episodes-index.html.md');
    });

    it('should describe available content types', () => {
      expect(robotsTxt).toContain('Podcast metadata');
      expect(robotsTxt).toContain('Episode information');
      expect(robotsTxt).toContain('Full transcripts');
      expect(robotsTxt).toContain('Guest information');
    });

    it('should include encouraging closing message', () => {
      expect(robotsTxt).toContain('Feel free to crawl, index, and use this content');
      expect(robotsTxt).toContain('help users discover');
    });
  });
});
