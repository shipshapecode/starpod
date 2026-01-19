/**
 * Starting around episode 223, the RSS feed changed from HTML to plain text.
 * This transformer converts the new plain-text format to match the old HTML structure exactly.
 */
export function transformPlainTextToHtml(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this is a timestamp line like "(00:00) - Intro"
    if (/^\(\d{2}:\d{2}(?::\d{2})?\)\s*-/.test(line)) {
      // Start collecting all consecutive timestamp lines into a list
      const listItems: string[] = [];
      while (i < lines.length && /^\(\d{2}:\d{2}(?::\d{2})?\)\s*-/.test(lines[i])) {
        listItems.push(escapeHtml(lines[i]));
        i++;
      }
      html.push('<ul>');
      listItems.forEach(item => html.push(`<li>${item}</li>`));
      html.push('</ul>');
      continue;
    }

    // Check if this is a section header (bold text like "**Links**" or just "Links")
    if (/^\*\*(.+?)\*\*$/.test(line)) {
      const text = line.replace(/^\*\*(.+?)\*\*$/, '$1');
      html.push(`<p><strong>${escapeHtml(text)}</strong></p>`);
      i++;
      continue;
    }

    // Check if this looks like a link list item (e.g., "CodeRabbit: https://...")
    if (/:?\s*https?:\/\//.test(line)) {
      // Collect all consecutive link lines into a list
      const linkItems: string[] = [];
      while (i < lines.length && /:?\s*https?:\/\//.test(lines[i])) {
        linkItems.push(lines[i]);
        i++;
      }
      html.push('<ul>');
      linkItems.forEach(item => {
        // Parse "Label: URL" or just "URL"
        const match = item.match(/^(.+?):\s*(https?:\/\/.+)$/);
        if (match) {
          const label = escapeHtml(match[1].trim());
          const url = escapeHtml(match[2].trim());
          html.push(`<li>${label}: <a href="${url}">${url}</a></li>`);
        } else {
          const urlMatch = item.match(/(https?:\/\/.+)/);
          if (urlMatch) {
            const url = escapeHtml(urlMatch[1].trim());
            html.push(`<li><a href="${url}">${url}</a></li>`);
          } else {
            html.push(`<li>${escapeHtml(item)}</li>`);
          }
        }
      });
      html.push('</ul>');
      continue;
    }

    // Default: regular paragraph
    html.push(`<p>${escapeHtml(line)}</p>`);
    i++;
  }

  return html.join('\n');
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function looksLikeHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text.trim());
}
