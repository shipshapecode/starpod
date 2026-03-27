import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.ASTRO_DB_REMOTE_URL!,
    authToken: process.env.ASTRO_DB_APP_TOKEN!
  }
});
