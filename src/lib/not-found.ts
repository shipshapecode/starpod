import type { Show } from './rss';

/**
 * Generate a markdown 404 body pointing agents at recovery entry points, per
 * agent-friendly 404 guidance: never a bare error, always where to look next.
 */
export function generateNotFoundMarkdown(
  pathname: string,
  show: Show,
  siteUrl?: URL
): string {
  const baseUrl = siteUrl?.origin || '';

  let markdown = `# 404 - Page Not Found\n\n`;
  markdown += `\`${pathname}\` does not exist on ${show.title}.\n\n`;
  markdown += `## Where To Look Next\n\n`;
  markdown += `- [Homepage](${baseUrl}/index.html.md): Show overview and latest episodes\n`;
  markdown += `- [Episodes Index](${baseUrl}/episodes-index.html.md): Every episode with links\n`;
  markdown += `- [llms.txt](${baseUrl}/llms.txt): Structured overview of all resources\n`;
  markdown += `- [Sitemap](${baseUrl}/sitemap-index.xml): Every page on the site\n`;
  markdown += `- [OpenAPI Specification](${baseUrl}/openapi.json): JSON API endpoints\n\n`;
  markdown += `Episode pages live at \`/{episode-slug}\` (or \`/{episode-number}\`), `;
  markdown += `with markdown versions at \`/{episode-slug}.html.md\`.\n`;

  return markdown;
}
