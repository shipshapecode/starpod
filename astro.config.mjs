import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import starpod from 'starpod';

import starpodConfig from './starpod.config';

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
  site: 'https://whiskey.fm',
  integrations: [starpod(starpodConfig, { database: true })],
  // These were specific redirects we needed for our podcast, if you do not have any routes to redirect, you can safely remove this.
  redirects: {
    '/hot-takes-tan-stack-and-open-source-with-tanner-linsley':
      '/hot-takes-tanstack-and-open-source-with-tanner-linsley',
    '/creating-code-pen-tackling-tailwind-and-keeping-it-simple-with-chris-coyier':
      'creating-codepen-tackling-tailwind-and-keeping-it-simple-with-chris-coyier',
    '/coding-languages-ai-and-the-evolution-of-game-development-with-phillip-winston':
      '/coding-languages-ai-and-the-evolution-of-game-development-with-philip-winston'
  }
});
