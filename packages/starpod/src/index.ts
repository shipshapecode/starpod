import { fileURLToPath } from 'node:url';

import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import type { AstroIntegration } from 'astro';
import { fontProviders } from 'astro/config';
import type { Plugin as VitePlugin } from 'vite';

import rehypeTranscriptTimestamps from './lib/rehype-transcript-timestamps.mjs';
import { type StarpodConfig } from './utils/config';
import { main as applyVercelMarkdownNegotiation } from './vercel-md-negotiation.mjs';

const VIRTUAL_CONFIG_ID = 'virtual:starpod/config';
const RESOLVED_VIRTUAL_CONFIG_ID = '\0' + VIRTUAL_CONFIG_ID;

/**
 * Exposes the user's Starpod config to every page and component in the
 * package as the `virtual:starpod/config` module.
 */
function starpodConfigPlugin(config: StarpodConfig): VitePlugin {
  return {
    name: 'starpod-config',
    resolveId(id) {
      if (id === VIRTUAL_CONFIG_ID) {
        return RESOLVED_VIRTUAL_CONFIG_ID;
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_CONFIG_ID) {
        return `export default ${JSON.stringify(config)};`;
      }
    }
  };
}

/**
 * Every route the integration injects, mirroring the file-based routes the
 * pages had when they lived in the consuming site's `src/pages`.
 */
const ROUTES: Array<{ pattern: string; entrypoint: string }> = [
  { pattern: '/', entrypoint: 'index.astro' },
  { pattern: '/404', entrypoint: '404.astro' },
  { pattern: '/[...notFound]', entrypoint: '[...notFound].astro' },
  { pattern: '/[episode]', entrypoint: '[episode].astro' },
  { pattern: '/[episode].html.md', entrypoint: '[episode].html.md.ts' },
  { pattern: '/about', entrypoint: 'about.astro' },
  { pattern: '/about.html.md', entrypoint: 'about.html.md.ts' },
  { pattern: '/contact', entrypoint: 'contact.astro' },
  {
    pattern: '/episodes-index.html.md',
    entrypoint: 'episodes-index.html.md.ts'
  },
  { pattern: '/for-llms', entrypoint: 'for-llms.astro' },
  { pattern: '/for-llms.html.md', entrypoint: 'for-llms.html.md.ts' },
  { pattern: '/llms.txt', entrypoint: 'llms.txt.ts' },
  { pattern: '/openapi.json', entrypoint: 'openapi.json.ts' },
  { pattern: '/robots.txt', entrypoint: 'robots.txt.ts' },
  { pattern: '/sponsor', entrypoint: 'sponsor.astro' },
  { pattern: '/api/contact', entrypoint: 'api/contact.ts' },
  { pattern: '/api/episodes/[page].json', entrypoint: 'api/episodes/[page].json.ts' },
  {
    pattern: '/api/episodes/search.json',
    entrypoint: 'api/episodes/search.json.ts'
  }
];

export default function starpod(starpodConfig: StarpodConfig): AstroIntegration {
  let projectRoot: URL;

  return {
    name: 'starpod',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
        projectRoot = config.root;

        for (const route of ROUTES) {
          injectRoute({
            pattern: route.pattern,
            entrypoint: new URL(`./pages/${route.entrypoint}`, import.meta.url)
          });
        }

        updateConfig({
          build: {
            inlineStylesheets: 'always'
          },
          experimental: {
            clientPrerender: true
          },
          fonts: [
            {
              provider: fontProviders.google(),
              name: 'Inter',
              cssVariable: '--astro-font-inter',
              formats: ['woff2'],
              styles: ['normal'],
              subsets: ['latin'],
              weights: ['300 900'],
              options: {
                experimental: {
                  variableAxis: {
                    opsz: ['14..32']
                  }
                }
              }
            }
          ],
          image: {
            remotePatterns: [{ protocol: 'https' }, { protocol: 'http' }]
          },
          integrations: [
            preact(),
            sitemap({
              filter: (page) => {
                const pathname = new URL(page).pathname;
                // Exclude episode number pages and only include slug pages.
                return !/^\/\d+\/?$/.test(pathname);
              }
            })
          ],
          markdown: {
            // Makes bracketed timestamps in markdown transcripts clickable
            // for seeking.
            rehypePlugins: [rehypeTranscriptTimestamps]
          },
          prefetch: {
            prefetchAll: true,
            defaultStrategy: 'viewport'
          },
          trailingSlash: 'never',
          vite: {
            plugins: [tailwindcss(), starpodConfigPlugin(starpodConfig)]
          }
        });
      },
      'astro:build:done': () => {
        // Injects `Accept: text/markdown` content-negotiation routes into the
        // Vercel build output. No-ops for other adapters.
        applyVercelMarkdownNegotiation(
          fileURLToPath(new URL('./.vercel/output', projectRoot))
        );
      }
    }
  };
}

export { defineStarpodConfig, type Host, type StarpodConfig } from './utils/config';
