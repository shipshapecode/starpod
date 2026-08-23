/**
 * Patches `.vercel/output/config.json` after `astro build` so that pages with
 * a prerendered markdown twin (`{path}.html.md`) serve that twin when a client
 * asks for it with `Accept: text/markdown`, per https://acceptmarkdown.com.
 *
 * Both variants of a negotiated URL are stamped with `Vary: Accept` so CDNs
 * never serve a cached HTML response to an agent asking for markdown (or vice
 * versa).
 *
 * This has to happen post-build because Vercel checks the filesystem before
 * applying `vercel.json` rewrites, so an Accept-based rewrite there would
 * never run for prerendered pages. Routes injected before the `filesystem`
 * handler in the Build Output API config do run first.
 *
 * Runs as part of `pnpm build`. No-ops when there is no Vercel build output.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const MD_SUFFIX = '.html.md';

// Vercel route `has` condition matching any Accept header that mentions
// text/markdown.
const ACCEPT_MARKDOWN = [
  { type: 'header', key: 'accept', value: '.*text/markdown.*' }
];

// How many slugs to pack into a single route regex alternation.
const CHUNK_SIZE = 50;

/**
 * Find every prerendered markdown twin in the static output directory and
 * return the negotiated URL paths they belong to ('/index' for the homepage).
 */
export function collectMarkdownPaths(staticDir) {
  const paths = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(MD_SUFFIX)) {
        const rel = relative(staticDir, full).split(sep).join('/');
        paths.push('/' + rel.slice(0, -MD_SUFFIX.length));
      }
    }
  };

  walk(staticDir);
  return paths.sort();
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const chunk = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

/**
 * Build the routes that implement the negotiation for the given markdown
 * paths. Order matters: Vary stamps first (they `continue`), then the
 * Accept-conditional rewrites to the markdown twins.
 */
export function buildNegotiationRoutes(mdPaths) {
  const routes = [];
  const hasHome = mdPaths.includes('/index');
  const slugChunks = chunk(
    mdPaths.filter((p) => p !== '/index').map((p) => escapeRegex(p.slice(1))),
    CHUNK_SIZE
  );

  // Stamp Vary: Accept on every negotiated URL, whichever variant ends up
  // being served.
  if (hasHome) {
    routes.push({ src: '^/$', headers: { vary: 'Accept' }, continue: true });
  }
  for (const slugs of slugChunks) {
    routes.push({
      src: `^/(?:${slugs.join('|')})$`,
      headers: { vary: 'Accept' },
      continue: true
    });
  }

  // Rewrite to the markdown twin when the client asks for markdown.
  if (hasHome) {
    routes.push({
      src: '^/$',
      has: ACCEPT_MARKDOWN,
      dest: '/index.html.md'
    });
  }
  for (const slugs of slugChunks) {
    routes.push({
      src: `^/(${slugs.join('|')})$`,
      has: ACCEPT_MARKDOWN,
      dest: '/$1.html.md'
    });
  }

  return routes;
}

/**
 * Return a copy of the Vercel Build Output config with the negotiation routes
 * inserted ahead of the `filesystem` handler. Idempotent: an already patched
 * config is returned unchanged.
 */
export function patchConfig(config, mdPaths) {
  if (!Array.isArray(config.routes)) {
    throw new Error('config.json has no routes array');
  }

  const alreadyPatched = config.routes.some(
    (route) =>
      typeof route.dest === 'string' &&
      route.dest.endsWith(MD_SUFFIX) &&
      Array.isArray(route.has)
  );
  if (alreadyPatched) {
    return { config, inserted: 0 };
  }

  const negotiationRoutes = buildNegotiationRoutes(mdPaths);
  if (negotiationRoutes.length === 0) {
    return { config, inserted: 0 };
  }

  const filesystemIndex = config.routes.findIndex(
    (route) => route.handle === 'filesystem'
  );
  if (filesystemIndex === -1) {
    throw new Error(
      'config.json has no `handle: "filesystem"` route; the Vercel build output format may have changed'
    );
  }

  const routes = [
    ...config.routes.slice(0, filesystemIndex),
    ...negotiationRoutes,
    ...config.routes.slice(filesystemIndex)
  ];

  return { config: { ...config, routes }, inserted: negotiationRoutes.length };
}

export function main(outputDir = '.vercel/output') {
  const configPath = join(outputDir, 'config.json');
  const staticDir = join(outputDir, 'static');

  if (!existsSync(configPath) || !existsSync(staticDir)) {
    console.log(
      `[md-negotiation] No Vercel build output at ${outputDir}, skipping`
    );
    return;
  }

  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  const mdPaths = collectMarkdownPaths(staticDir);
  const { config: patched, inserted } = patchConfig(config, mdPaths);

  if (inserted === 0) {
    console.log('[md-negotiation] Nothing to patch');
    return;
  }

  writeFileSync(configPath, JSON.stringify(patched, null, 2));
  console.log(
    `[md-negotiation] Added ${inserted} routes negotiating markdown for ${mdPaths.length} pages`
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main(process.argv[2]);
}
