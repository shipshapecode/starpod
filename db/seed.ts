import { db, Episode, HostOrGuest, Person } from 'astro:db';

import { getAllEpisodes } from '../src/lib/rss';
import people from './data/people';
import peoplePerEpisode from './data/people-per-episode';

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Person).values(people).onConflictDoNothing();

  const allEpisodes = await getAllEpisodes();
  const episodes = allEpisodes.map((episode) => {
    return {
      episodeSlug: episode.episodeSlug
    };
  });

  await db.insert(Episode).values(episodes).onConflictDoNothing();

  const hostsOrGuestsToInsert = [];
  for (let episode of episodes) {
    if (peoplePerEpisode[episode.episodeSlug]?.length) {
      for (let person of peoplePerEpisode[episode.episodeSlug]) {
        hostsOrGuestsToInsert.push({
          episodeSlug: episode.episodeSlug,
          isHost: person.host ?? false,
          personId: person.id
        });
      }
    }
  }

  await db
    .insert(HostOrGuest)
    .values(hostsOrGuestsToInsert)
    .onConflictDoNothing();
}
