import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    imageService: true,
    speedInsights: {
      enabled: true
    },
    webAnalytics: {
      enabled: true
    }
  }),
  site: 'https://starpod.dev',
  integrations: [
    tailwind({
      applyBaseStyles: false,
      nesting: true
    }),
    ,
    preact()
  ],
  redirects: {
    '/hot-takes-tan-stack-and-open-source-with-tanner-linsley':
      '/hot-takes-tanstack-and-open-source-with-tanner-linsley',
    '/creating-code-pen-tackling-tailwind-and-keeping-it-simple-with-chris-coyier':
      'creating-codepen-tackling-tailwind-and-keeping-it-simple-with-chris-coyier'
  }
});
