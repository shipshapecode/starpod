import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

// Uses ASTRO_DB_REMOTE_URL and ASTRO_DB_APP_TOKEN from environment.
// In Astro files, these are available via import.meta.env.
// In standalone scripts (seed), they are loaded via process.env.
export function createDb(url: string, authToken: string) {
  return drizzle({
    connection: { url, authToken },
    schema
  });
}

export type Database = ReturnType<typeof createDb>;
