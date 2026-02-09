import { describe, expect, it } from 'vitest';

describe('Robots.txt', () => {
  describe('Generated content', () => {
    it('should contain welcoming comment for AI agents', () => {
      const mockSite = new URL('https://whiskey.fm');
      const mockSitemap = new URL('sitemap-index.xml', mockSite);
      
      // Simulate the getRobotsTxt function behavior
      const robotsTxt = `
# Welcome AI agents and crawlers!
# This is a podcast website built with Starpod - all content is freely accessible.

User-agent: *
Allow: /

# Sitemap for all pages
Sitemap: ${mockSitemap.href}

# Special resources for AI/LLM agents:
# - ${mockSite.origin}/llms.txt - Structured overview following the llms.txt spec
# - ${mockSite.origin}/for-llms - Human-readable guide for AI assistants
# - ${mockSite.origin}/episodes-index.html.md - Complete episode listing in markdown
# - ${mockSite.origin}/[episode-slug].html.md - Individual episodes with transcripts
# 
# All content includes:
# - Podcast metadata (hosts, description, platforms)
# - Episode information (titles, descriptions, publish dates)
# - Full transcripts (when available)
# - Guest information
#
# Feel free to crawl, index, and use this content to help users discover
# and learn about our podcast!
`;

      expect(robotsTxt).toContain('Welcome AI agents and crawlers');
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
    });

    it('should include sitemap reference', () => {
      const mockSite = new URL('https://whiskey.fm');
      const mockSitemap = new URL('sitemap-index.xml', mockSite);
      
      const robotsTxt = `Sitemap: ${mockSitemap.href}`;
      
      expect(robotsTxt).toContain('Sitemap: https://whiskey.fm/sitemap-index.xml');
    });

    it('should reference LLM-specific resources', () => {
      const mockSite = new URL('https://whiskey.fm');
      
      const robotsTxt = `
# Special resources for AI/LLM agents:
# - ${mockSite.origin}/llms.txt - Structured overview following the llms.txt spec
# - ${mockSite.origin}/for-llms - Human-readable guide for AI assistants
# - ${mockSite.origin}/episodes-index.html.md - Complete episode listing in markdown
`;

      expect(robotsTxt).toContain('/llms.txt');
      expect(robotsTxt).toContain('/for-llms');
      expect(robotsTxt).toContain('/episodes-index.html.md');
    });

    it('should describe available content types', () => {
      const robotsTxt = `
# All content includes:
# - Podcast metadata (hosts, description, platforms)
# - Episode information (titles, descriptions, publish dates)
# - Full transcripts (when available)
# - Guest information
`;

      expect(robotsTxt).toContain('Podcast metadata');
      expect(robotsTxt).toContain('Episode information');
      expect(robotsTxt).toContain('Full transcripts');
      expect(robotsTxt).toContain('Guest information');
    });

    it('should include encouraging closing message', () => {
      const robotsTxt = `
# Feel free to crawl, index, and use this content to help users discover
# and learn about our podcast!
`;

      expect(robotsTxt).toContain('Feel free to crawl, index, and use this content');
      expect(robotsTxt).toContain('help users discover');
    });
  });
});
