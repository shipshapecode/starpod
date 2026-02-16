import { defineConfig } from 'astro/config';

// Import the shared base configuration (which doesn't include db)
import { baseConfig } from './astro.config.mjs';

// https://astro.build/config - Configuration without astro:db for testing
// Note: Use with --tsconfig tsconfig.no-db.json to exclude db files from type checking
export default defineConfig(baseConfig);
