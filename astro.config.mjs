import { defineConfig, fontProviders } from 'astro/config';
import db from '@astrojs/db';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({
    imageService: true,
    imagesConfig: {
      formats: ['image/avif'],
      minimumCacheTTL: 3600,
      remotePatterns: [
        {
          protocol: 'https'
        },
        {
          protocol: 'http'
        }
      ],
      sizes: [160, 320, 640, 1280]
    },
    webAnalytics: {
      enabled: true
    }
  }),
  build: {
    inlineStylesheets: 'always'
  },
  experimental: {
    clientPrerender: true,
    fonts: [
      {
        provider: fontProviders.google({
          experimental: { variableAxis: { Inter: { opsz: ['14..32'] } } }
        }),
        name: 'Inter',
        cssVariable: '--astro-font-inter',
        weights: ['300 900'],
        styles: ['normal'],
        subsets: ['latin']
      }
    ]
  },
  image: {
    remotePatterns: [
      {
        protocol: 'https'
      },
      {
        protocol: 'http'
      }
    ]
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  site: 'https://your-podcast-site.com',
  trailingSlash: 'never',
  integrations: [
    db(),
    preact(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        // Exclude episode number pages and only include slug pages.
        return !/^\/\d+\/?$/.test(pathname);
      }
    })
  ],
  // Add any redirects you need here. You can safely remove this if you have none.
  // redirects: {},
  vite: {
    plugins: [tailwindcss()]
  }
});
