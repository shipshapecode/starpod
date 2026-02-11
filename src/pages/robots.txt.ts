import type { APIRoute } from 'astro';

export const getRobotsTxt = (sitemapURL: URL, siteURL: URL) => `
# Welcome AI agents and crawlers!
# This is a podcast website built with Starpod - all content is freely accessible.

User-agent: *
Allow: /

# Sitemap for all pages
Sitemap: ${sitemapURL.href}

# Special resources for AI/LLM agents:
# - ${siteURL.origin}/llms.txt - Structured overview following the llms.txt spec
# - ${siteURL.origin}/for-llms - Human-readable guide for AI assistants
# - ${siteURL.origin}/episodes-index.html.md - Complete episode listing in markdown
# - ${siteURL.origin}/[episode-slug].html.md - Individual episodes with transcripts
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

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  const siteURL = new URL(site!);
  return new Response(getRobotsTxt(sitemapURL, siteURL));
};