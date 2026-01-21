import { htmlToText } from 'html-to-text';

import type { Episode, Show } from './rss';
import type { StarpodConfig } from '../utils/config';
import { truncate } from '../utils/truncate';

/**
 * Format duration in seconds to HH:MM:SS or MM:SS format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format timestamp to human-readable date
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Clean transcript by removing timestamps and extra whitespace
 */
export function cleanTranscript(markdown: string): string {
  // Remove timestamp patterns like [00:34] or [01:23:45]
  let cleaned = markdown.replace(/\[\d{1,2}:\d{2}(?::\d{2})?\]/g, '');

  // Remove extra whitespace while preserving paragraph structure
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Truncate text to specified length
 * Uses the existing truncate utility which also handles HTML sanitization
 */
export function truncateDescription(text: string, length: number): string {
  return truncate(text, length);
}

/**
 * Convert HTML to clean markdown/text
 */
export function htmlToMarkdown(html: string): string {
  return htmlToText(html, {
    wordwrap: false,
    preserveNewlines: true,
    selectors: [
      { selector: 'a', options: { ignoreHref: false } },
      { selector: 'img', format: 'skip' }
    ]
  });
}

/**
 * Generate llms.txt content following the specification
 */
export function generateLlmsTxt(
  show: Show,
  recentEpisodes: Episode[],
  config: StarpodConfig,
  siteUrl?: URL
): string {
  const baseUrl = siteUrl?.origin || '';
  const hostNames = config.hosts.map((h) => h.name).join(', ');

  let content = `# ${show.title}\n\n`;
  content += `> ${config.blurb}\n\n`;
  content += `${config.description}\n\n`;
  content += `Hosted by: ${hostNames}\n\n`;

  // Main Documentation
  content += `## Main Documentation\n\n`;
  content += `- [About the Show](${baseUrl}/about.html.md): Information about the podcast and hosts\n`;
  content += `- [For LLMs](${baseUrl}/for-llms.html.md): Comprehensive guide for AI assistants\n`;
  content += `- [Episodes Index](${baseUrl}/episodes-index.html.md): Complete list of all episodes\n\n`;

  // Recent Episodes
  if (recentEpisodes.length > 0) {
    content += `## Recent Episodes\n\n`;
    for (const episode of recentEpisodes) {
      const episodeUrl = `${baseUrl}/${episode.episodeSlug}.html.md`;
      const description = truncateDescription(episode.description, 150);
      content += `- [${episode.title}](${episodeUrl}): ${description}\n`;
    }
    content += `\n`;
  }

  // Optional section
  content += `## Optional\n\n`;
  content += `- [RSS Feed](${config.rssFeed}): Direct access to podcast RSS\n`;

  if (config.platforms.apple) {
    content += `- [Listen on Apple Podcasts](${config.platforms.apple})\n`;
  }
  if (config.platforms.spotify) {
    content += `- [Listen on Spotify](${config.platforms.spotify})\n`;
  }
  if (config.platforms.youtube) {
    content += `- [Watch on YouTube](${config.platforms.youtube})\n`;
  }
  if (config.platforms.overcast) {
    content += `- [Listen on Overcast](${config.platforms.overcast})\n`;
  }
  if (config.platforms.pocketCasts) {
    content += `- [Listen on Pocket Casts](${config.platforms.pocketCasts})\n`;
  }

  return content;
}

/**
 * Generate markdown for a single episode
 */
export function generateEpisodeMarkdown(
  episode: Episode,
  show: Show,
  config: StarpodConfig,
  transcriptContent?: string
): string {
  const hostNames = config.hosts.map((h) => h.name).join(', ');
  const episodeContent = htmlToMarkdown(episode.content);

  let markdown = `# Episode ${episode.episodeNumber}: ${episode.title}\n\n`;
  markdown += `**Show**: ${show.title}\n`;
  markdown += `**Published**: ${formatDate(episode.published)}\n`;
  markdown += `**Duration**: ${formatDuration(episode.duration)}\n`;
  markdown += `**Episode Number**: ${episode.episodeNumber}\n\n`;

  markdown += `## Hosts\n\n${hostNames}\n\n`;

  markdown += `## Description\n\n${episodeContent}\n\n`;

  markdown += `## Audio\n\n[Download or listen to episode](${episode.audio.src})\n\n`;

  if (transcriptContent) {
    markdown += `## Transcript\n\n${transcriptContent}\n`;
  } else {
    markdown += `## Transcript\n\nTranscript not available for this episode.\n`;
  }

  return markdown;
}

/**
 * Generate episodes index markdown
 */
export function generateEpisodesIndex(
  show: Show,
  episodes: Episode[],
  siteUrl?: URL
): string {
  const baseUrl = siteUrl?.origin || '';

  let markdown = `# ${show.title} - Episodes\n\n`;
  markdown += `Complete listing of all ${episodes.length} episodes.\n\n`;
  markdown += `---\n\n`;

  for (const episode of episodes) {
    markdown += `## Episode ${episode.episodeNumber}: ${episode.title}\n\n`;
    markdown += `**Published**: ${formatDate(episode.published)}\n`;
    markdown += `**Duration**: ${formatDuration(episode.duration)}\n`;
    markdown += `**Description**: ${truncateDescription(episode.description, 200)}\n\n`;
    markdown += `[Full episode details](${baseUrl}/${episode.episodeSlug}.html.md) | [Audio](${episode.audio.src})\n\n`;
    markdown += `---\n\n`;
  }

  return markdown;
}

/**
 * Generate for-llms page markdown content
 */
export function generateForLlmsMarkdown(
  show: Show,
  episodes: Episode[],
  config: StarpodConfig,
  siteUrl?: URL
): string {
  const baseUrl = siteUrl?.origin || '';

  let markdown = `# ${show.title} - Guide for AI Assistants\n\n`;
  markdown += `## Podcast Overview\n\n`;
  markdown += `**Tagline**: ${config.blurb}\n\n`;
  markdown += `${config.description}\n\n`;

  markdown += `## Hosts\n\n`;
  for (const host of config.hosts) {
    markdown += `### ${host.name}\n\n`;
    markdown += `${host.bio}\n\n`;
    if (host.website || host.github || host.twitter) {
      markdown += `**Links**: `;
      const links = [];
      if (host.website) links.push(`[Website](${host.website})`);
      if (host.github) links.push(`[GitHub](${host.github})`);
      if (host.twitter) links.push(`[Twitter](${host.twitter})`);
      markdown += links.join(' | ');
      markdown += `\n\n`;
    }
  }

  markdown += `## Episode Information\n\n`;
  markdown += `- **Total Episodes**: ${episodes.length}\n`;

  if (episodes.length > 0) {
    const totalDuration = episodes.reduce((sum, ep) => sum + ep.duration, 0);
    const avgDuration = totalDuration / episodes.length;
    markdown += `- **Average Episode Duration**: ${formatDuration(avgDuration)}\n`;

    // Calculate publishing frequency
    if (episodes.length > 1) {
      const newest = episodes[0].published;
      const oldest = episodes[episodes.length - 1].published;
      const daysBetween = (newest - oldest) / (1000 * 60 * 60 * 24);
      const episodesPerWeek = (episodes.length / daysBetween) * 7;
      markdown += `- **Publishing Frequency**: Approximately ${episodesPerWeek.toFixed(1)} episodes per week\n`;
    }
  }

  markdown += `\n## Recent Episodes\n\n`;
  const recentEpisodes = episodes.slice(0, 10);
  for (const episode of recentEpisodes) {
    markdown += `- **Episode ${episode.episodeNumber}**: [${episode.title}](${baseUrl}/${episode.episodeSlug}.html.md) - ${formatDate(episode.published)}\n`;
  }

  markdown += `\n## Transcript Availability\n\n`;
  markdown += `Transcripts are available for many episodes and are included in the individual episode markdown files. `;
  markdown += `Access any episode at \`/{episode-slug}.html.md\` to view the full transcript if available.\n\n`;

  markdown += `## How to Listen\n\n`;
  if (config.platforms.apple) {
    markdown += `- [Apple Podcasts](${config.platforms.apple})\n`;
  }
  if (config.platforms.spotify) {
    markdown += `- [Spotify](${config.platforms.spotify})\n`;
  }
  if (config.platforms.youtube) {
    markdown += `- [YouTube](${config.platforms.youtube})\n`;
  }
  if (config.platforms.overcast) {
    markdown += `- [Overcast](${config.platforms.overcast})\n`;
  }
  if (config.platforms.pocketCasts) {
    markdown += `- [Pocket Casts](${config.platforms.pocketCasts})\n`;
  }

  markdown += `\n## RSS Feed\n\n`;
  markdown += `Direct RSS feed access: ${config.rssFeed}\n\n`;

  markdown += `## Complete Episode List\n\n`;
  markdown += `For a complete list of all episodes with descriptions, see [Episodes Index](${baseUrl}/episodes-index.html.md).\n`;

  return markdown;
}

/**
 * Generate about page markdown content
 */
export function generateAboutMarkdown(
  show: Show,
  config: StarpodConfig
): string {
  let markdown = `# About ${show.title}\n\n`;
  markdown += `${config.description}\n\n`;

  markdown += `## Meet the Hosts\n\n`;
  for (const host of config.hosts) {
    markdown += `### ${host.name}\n\n`;
    markdown += `${host.bio}\n\n`;
    if (host.website || host.github || host.twitter) {
      if (host.twitter) markdown += `- Twitter: ${host.twitter}\n`;
      if (host.github) markdown += `- GitHub: ${host.github}\n`;
      if (host.website) markdown += `- Website: ${host.website}\n`;
      markdown += `\n`;
    }
  }

  markdown += `## Listen to the Show\n\n`;
  if (config.platforms.apple) {
    markdown += `- [Apple Podcasts](${config.platforms.apple})\n`;
  }
  if (config.platforms.spotify) {
    markdown += `- [Spotify](${config.platforms.spotify})\n`;
  }
  if (config.platforms.youtube) {
    markdown += `- [YouTube](${config.platforms.youtube})\n`;
  }
  if (config.platforms.overcast) {
    markdown += `- [Overcast](${config.platforms.overcast})\n`;
  }
  if (config.platforms.pocketCasts) {
    markdown += `- [Pocket Casts](${config.platforms.pocketCasts})\n`;
  }

  return markdown;
}
