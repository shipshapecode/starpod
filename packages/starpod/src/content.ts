import { glob } from 'astro/loaders';

/**
 * Loader for episode transcript markdown files, named by episode number
 * (e.g. `42.md`). Use in the consuming site's `src/content.config.ts`:
 *
 * ```ts
 * import { defineCollection } from 'astro:content';
 * import { transcriptsLoader } from 'starpod/content';
 *
 * export const collections = {
 *   transcripts: defineCollection({ loader: transcriptsLoader() })
 * };
 * ```
 */
export function transcriptsLoader(base = './src/content/transcripts') {
  return glob({ pattern: '**/*.{md,mdx}', base });
}
