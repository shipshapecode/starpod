import { defineCollection } from 'astro:content';
import { transcriptsLoader } from 'starpod/content';

const transcripts = defineCollection({
  loader: transcriptsLoader()
});

export const collections = {
  transcripts
};
