import { db, Episode, HostOrGuest, Person } from 'astro:db';

import { getAllEpisodes } from '../src/lib/rss';
import people from './data/people';
import peoplePerEpisode from './data/people-per-episode';

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Person).values(people);

  const allEpisodes = await getAllEpisodes();
  const episodes = allEpisodes.map((episode) => {
    return {
      episodeSlug: episode.episodeSlug
    };
  });

  await db.insert(Episode).values(episodes);

  for (let episode of episodes) {
    if (peoplePerEpisode[episode.episodeSlug]?.length) {
      for (let person of peoplePerEpisode[episode.episodeSlug]) {
        await db.insert(HostOrGuest).values([
          {
            episodeSlug: episode.episodeSlug,
            isHost: person.host ?? false,
            personId: person.id
          }
        ]);
      }
    }
  }
}
