import 'dotenv/config';

import { sql } from 'drizzle-orm';

import { createDb } from 'starpod/db';
import {
  Episode,
  HostOrGuest,
  Person,
  Sponsor,
  SponsorForEpisode
} from 'starpod/db/schema';
import { getAllEpisodes } from 'starpod/src/lib/rss';

import starpodConfig from '../starpod.config';
import people from './data/people';
import peoplePerEpisode from './data/people-per-episode';
import sponsors from './data/sponsors';
import sponsorsPerEpisode from './data/sponsors-per-episode';

const db = createDb(
  process.env.ASTRO_DB_REMOTE_URL!,
  process.env.ASTRO_DB_APP_TOKEN!
);

async function seed() {
  if (people.length) {
    await db
      .insert(Person)
      .values(people)
      .onConflictDoUpdate({
        target: Person.id,
        set: { name: sql`excluded.name`, img: sql`excluded.img` }
      });
  }

  if (sponsors.length) {
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
  }

  const allEpisodes = await getAllEpisodes(starpodConfig);
  const episodes = allEpisodes.map((episode) => ({
    episodeSlug: episode.episodeSlug
  }));

  if (episodes.length) {
    await db.insert(Episode).values(episodes).onConflictDoNothing();
  }

  const hostsOrGuestsToInsert = [];
  const sponsorsForEpisodesToInsert = [];
  for (const episode of episodes) {
    for (const person of peoplePerEpisode[episode.episodeSlug] ?? []) {
      hostsOrGuestsToInsert.push({
        episodeSlug: episode.episodeSlug,
        isHost: Boolean(person.isHost),
        personId: person.id
      });
    }

    for (const sponsor of sponsorsPerEpisode[episode.episodeSlug] ?? []) {
      sponsorsForEpisodesToInsert.push({
        episodeSlug: episode.episodeSlug,
        sponsorId: sponsor.id
      });
    }
  }

  if (hostsOrGuestsToInsert.length) {
    await db
      .insert(HostOrGuest)
      .values(hostsOrGuestsToInsert)
      .onConflictDoNothing();
  }

  if (sponsorsForEpisodesToInsert.length) {
    await db
      .insert(SponsorForEpisode)
      .values(sponsorsForEpisodesToInsert)
      .onConflictDoNothing();
  }

  console.log('Seed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
