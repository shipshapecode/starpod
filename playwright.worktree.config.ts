// Worktree-only override: the user's own dev server occupies :4321 serving
// the main branch, so e2e here must boot its own server on another port.
// Not meant to be committed.
import { defineConfig } from '@playwright/test';

import baseConfig from './playwright.config';

const PORT = 4399;

export default defineConfig({
  ...baseConfig,
  reporter: 'list',
  use: {
    ...baseConfig.use,
    baseURL: `http://localhost:${PORT}`
  },
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180 * 1000
  }
});
