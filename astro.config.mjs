import { defineConfig } from 'astro/config';
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
    webAnalytics: {
      enabled: true
    }
  }),
  site: 'https://whiskey.fm',
  integrations: [db(), preact(), sitemap()],
  // These were specific redirects we needed for our podcast, if you do not have any routes to redirect, you can safely remove this.
  redirects: {
    '/hot-takes-tan-stack-and-open-source-with-tanner-linsley':
      '/hot-takes-tanstack-and-open-source-with-tanner-linsley',
    '/creating-code-pen-tackling-tailwind-and-keeping-it-simple-with-chris-coyier':
      'creating-codepen-tackling-tailwind-and-keeping-it-simple-with-chris-coyier',
    '/coding-languages-ai-and-the-evolution-of-game-development-with-phillip-winston':
      '/coding-languages-ai-and-the-evolution-of-game-development-with-philip-winston'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
