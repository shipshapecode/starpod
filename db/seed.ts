import {
  db,
  Episode,
  HostOrGuest,
  Person,
  Sponsor,
  SponsorForEpisode,
  sql
} from 'astro:db';

import { getAllEpisodes } from '../src/lib/rss';
import starpodConfig from '../starpod.config';
import people from './data/people';
import peoplePerEpisode from './data/people-per-episode';
import sponsors from './data/sponsors';
import sponsorsPerEpisode from './data/sponsors-per-episode';

// https://astro.build/db/seed
export default async function seed() {
  await db
    .insert(Person)
    .values(people as any)
    .onConflictDoUpdate({
      target: Person.id,
      set: { name: sql`excluded.name`, img: sql`excluded.img` }
    });

  await db
    .insert(Sponsor)
    .values(sponsors)
    .onConflictDoUpdate({
      target: Sponsor.id,
      set: {
        name: sql`excluded.name`,
        img: sql`excluded.img`,
        url: sql`excluded.url`
      }
    });

  const allEpisodes = await getAllEpisodes();
  const episodes = allEpisodes.map((episode) => {
    return {
      episodeSlug: episode.episodeSlug
    };
  });

  await db.insert(Episode).values(episodes).onConflictDoNothing();

  const hostsOrGuestsToInsert = [];
  const sponsorsForEpisodesToInsert = [];
  for (let episode of episodes) {
    if (peoplePerEpisode[episode.episodeSlug]?.length) {
      for (let person of peoplePerEpisode[episode.episodeSlug]) {
        hostsOrGuestsToInsert.push({
          episodeSlug: episode.episodeSlug,
          isHost:
            person.host !== undefined
              ? Boolean(person.host)
              : people
                  .filter((p) =>
                    starpodConfig.hosts.some((h) => h.name === p.name)
                  )
                  .map((p) => p.id)
                  .includes(person.id),
          personId: person.id
        });
      }
    }

    if (sponsorsPerEpisode[episode.episodeSlug]?.length) {
      for (let sponsor of sponsorsPerEpisode[episode.episodeSlug]) {
        sponsorsForEpisodesToInsert.push({
          episodeSlug: episode.episodeSlug,
          sponsorId: sponsor.id
        });
      }
    }
  }

  await db
    .insert(HostOrGuest)
    .values(hostsOrGuestsToInsert)
    .onConflictDoNothing();

  await db
    .insert(SponsorForEpisode)
    .values(sponsorsForEpisodesToInsert)
    .onConflictDoNothing();
}
