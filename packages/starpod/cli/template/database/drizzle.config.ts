import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // The schema ships with the starpod package.
  schema: './node_modules/starpod/src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.ASTRO_DB_REMOTE_URL!,
    authToken: process.env.ASTRO_DB_APP_TOKEN!
  }
});
