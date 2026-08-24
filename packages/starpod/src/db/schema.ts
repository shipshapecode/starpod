import {
  integer,
  sqliteTable,
  text,
  uniqueIndex
} from 'drizzle-orm/sqlite-core';

export const Episode = sqliteTable('Episode', {
  episodeSlug: text().primaryKey()
});

export const Person = sqliteTable('Person', {
  id: text().primaryKey(),
  img: text(),
  name: text().notNull()
});

export const HostOrGuest = sqliteTable(
  'HostOrGuest',
  {
    _id: integer('_id').primaryKey(),
    episodeSlug: text()
      .notNull()
      .references(() => Episode.episodeSlug),
    isHost: integer({ mode: 'boolean' }).notNull(),
    personId: text()
      .notNull()
      .references(() => Person.id)
  },
  (table) => [
    uniqueIndex('HostOrGuest_episodeSlug_personId_idx').on(
      table.episodeSlug,
      table.personId
    )
  ]
);

export const Sponsor = sqliteTable('Sponsor', {
  id: text().primaryKey(),
  img: text(),
  name: text().notNull(),
  url: text().notNull()
});

export const SponsorForEpisode = sqliteTable(
  'SponsorForEpisode',
  {
    _id: integer('_id').primaryKey(),
    episodeSlug: text()
      .notNull()
      .references(() => Episode.episodeSlug),
    sponsorId: text()
      .notNull()
      .references(() => Sponsor.id)
  },
  (table) => [
    uniqueIndex('SponsorForEpisode_episodeSlug_sponsorId_idx').on(
      table.episodeSlug,
      table.sponsorId
    )
  ]
);
