import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/unit/test-setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  },
  resolve: {
    alias: {
      '@': '/src',
      // Resolve package-internal imports as filesystem paths so
      // directory-index imports (e.g. .../player/Slider) work in tests.
      'starpod/src': fileURLToPath(
        new URL('./packages/starpod/src', import.meta.url)
      ),
      // Outside Astro there is no integration to provide the virtual config
      // module, so tests resolve it straight to the site's config file.
      'virtual:starpod/config': fileURLToPath(
        new URL('./starpod.config.ts', import.meta.url)
      )
    }
  }
});
