import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import type { AstroIntegration } from 'astro';
import { fontProviders } from 'astro/config';
import type { Plugin as VitePlugin } from 'vite';

import rehypeTranscriptTimestamps from './lib/rehype-transcript-timestamps.mjs';
import { type StarpodConfig } from './utils/config';
import {
  main as applyVercelMarkdownNegotiation,
  pagesToMarkdownPaths
} from './vercel-md-negotiation.mjs';

/**
 * Built-in components a site may replace via `options.components`. Each maps
 * to the default implementation shipped with the package; call sites import
 * them through `virtual:starpod/components/<Name>` so an override swaps the
 * module everywhere at once.
 */
const OVERRIDABLE_COMPONENTS = {
  Dots: './components/Dots.astro',
  EpisodeList: './components/EpisodeList.astro',
  Hosts: './components/Hosts.astro',
  InfoCard: './components/InfoCard.astro',
  LargePlatforms: './components/LargePlatforms.astro',
  NotFoundContent: './components/NotFoundContent.astro',
  Platforms: './components/Platforms.astro',
  ShowArtwork: './components/ShowArtwork.astro'
} as const;

export type OverridableComponent = keyof typeof OVERRIDABLE_COMPONENTS;

export interface StarpodOptions {
  /**
   * Enable the Turso/Drizzle database for per-episode guests and sponsors.
   * Requires `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`. When disabled
   * (the default), episode pages simply render without the guests and
   * sponsors sections.
   */
  database?: boolean;
  /**
   * Replace built-in components with your own, e.g.
   * `{ Hosts: './src/components/MyHosts.astro' }`. Paths are resolved from
   * the project root.
   */
  components?: Partial<Record<OverridableComponent, string>>;
  /**
   * Extra stylesheets loaded after the built-in styles, e.g.
   * `['./src/styles/theme.css']`. Paths are resolved from the project root.
   */
  customCss?: string[];
}

const VIRTUAL_CONFIG_ID = 'virtual:starpod/config';
const RESOLVED_VIRTUAL_CONFIG_ID = '\0' + VIRTUAL_CONFIG_ID;
const VIRTUAL_USER_CSS_ID = 'virtual:starpod/user-css';
const RESOLVED_VIRTUAL_USER_CSS_ID = '\0' + VIRTUAL_USER_CSS_ID;
const VIRTUAL_COMPONENT_PREFIX = 'virtual:starpod/components/';

/**
 * Serves the virtual modules that connect the consuming site to the package:
 * the validated config (plus feature flags), user CSS, and component
 * overrides.
 */
function starpodVitePlugin(
  config: StarpodConfig,
  options: StarpodOptions,
  root: URL
): VitePlugin {
  const rootDir = fileURLToPath(root);

  return {
    name: 'starpod',
    resolveId(id) {
      if (id === VIRTUAL_CONFIG_ID) {
        return RESOLVED_VIRTUAL_CONFIG_ID;
      }
      if (id === VIRTUAL_USER_CSS_ID) {
        return RESOLVED_VIRTUAL_USER_CSS_ID;
      }
      if (id.startsWith(VIRTUAL_COMPONENT_PREFIX)) {
        const name = id.slice(
          VIRTUAL_COMPONENT_PREFIX.length
        ) as OverridableComponent;
        const defaultPath = OVERRIDABLE_COMPONENTS[name];
        if (!defaultPath) {
          throw new Error(
            `[starpod] Unknown component "${name}". Overridable components: ${Object.keys(OVERRIDABLE_COMPONENTS).join(', ')}`
          );
        }
        const override = options.components?.[name];
        return override
          ? resolvePath(rootDir, override)
          : fileURLToPath(new URL(defaultPath, import.meta.url));
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_CONFIG_ID) {
        return [
          `export default ${JSON.stringify(config)};`,
          `export const database = ${options.database === true};`
        ].join('\n');
      }
      if (id === RESOLVED_VIRTUAL_USER_CSS_ID) {
        const imports = (options.customCss ?? []).map(
          (css) =>
            `import ${JSON.stringify(
              css.startsWith('.') ? resolvePath(rootDir, css) : css
            )};`
        );
        return imports.join('\n') || 'export {};';
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

export default function starpod(
  starpodConfig: StarpodConfig,
  options: StarpodOptions = {}
): AstroIntegration {
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
            preact({
              // The preset's default exclude is /node_modules/, which would
              // skip this package's own .tsx components when starpod is
              // installed as a dependency. Exclude everything else but keep
              // starpod's sources in the Preact JSX transform.
              exclude: [/node_modules(?!.*[\\/]starpod[\\/])/]
            }),
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
            plugins: [
              tailwindcss(),
              starpodVitePlugin(starpodConfig, options, config.root)
            ]
          }
        });
      },
      'astro:build:done': ({ dir, assets }) => {
        // Injects `Accept: text/markdown` content-negotiation routes into the
        // Vercel build output. No-ops for other adapters. The adapter runs
        // first in astro:build:done (Astro unshifts it), so config.json exists
        // here — but the static dir is only copied afterwards, so the markdown
        // twin paths are derived from the build's generated assets, not the
        // filesystem.
        const outputBase = fileURLToPath(dir);
        const generated = [...assets.values()]
          .flat()
          .map((url) => fileURLToPath(url).slice(outputBase.length));
        applyVercelMarkdownNegotiation(
          fileURLToPath(new URL('./.vercel/output', projectRoot)),
          pagesToMarkdownPaths(generated)
        );
      }
    }
  };
}

export { defineStarpodConfig, type Host, type StarpodConfig } from './utils/config';
