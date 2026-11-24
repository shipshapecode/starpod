/**
 * Everything the home page's explorer renders, gathered once at build time:
 * each episode's artwork at card sizes, its hosts and guests (from the
 * opt-in database), and the menus' choices (years, people).
 *
 * Server-only.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { eq } from 'drizzle-orm';
import starpodConfig, { database } from 'virtual:starpod/config';

// The face for someone without a photo, light or dark with the page.
import avatar from '../../assets/avatar.svg?url';
import { createDb } from '../../db';
import { HostOrGuest, Person } from '../../db/schema';
import { sortCast, type CastPerson } from '../../lib/cast';
import type { Episode, Show } from '../../lib/rss';

export interface ArchivePerson {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
}

export interface ArchiveCard {
  episode: Episode;
  /** Feed order: 0 is the newest. */
  index: number;
  art: { src: string; srcset?: string };
  people: Array<ArchivePerson>;
  year: string;
}

export interface ArchiveChoice {
  value: string;
  label: string;
  count: number;
  avatar?: string;
  /** Hosted most of their episodes (people only; set by loadPeople). */
  host?: boolean;
}

const photos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/img/people/*.{jpeg,jpg,png}'
);

const avatars = new Map<string, Promise<string>>();

function avatarFor(img: string | null): Promise<string> {
  const key = img ?? '';
  if (!avatars.has(key)) {
    avatars.set(
      key,
      (async () => {
        const photo =
          img && (await photos[`/src/img/people/${img}`]?.())?.default;
        if (!photo) {
          return avatar;
        }
        const image = await getImage({
          src: photo,
          width: 64,
          height: 64,
          format: 'webp'
        });
        return image.src;
      })()
    );
  }
  return avatars.get(key)!;
}

/** Square artwork at the sizes a card can be shown at, grid tile to list row. */
async function cardArt(src: string | undefined, fallback: string) {
  if (!src) {
    return { src: fallback };
  }
  try {
    const image = await getImage({
      src,
      format: 'avif',
      height: 320,
      quality: 75,
      width: 320,
      widths: [160, 320, 640]
    });
    return { src: image.src, srcset: image.srcSet.attribute };
  } catch {
    return { src: fallback };
  }
}

let cast: Promise<Map<string, Array<CastPerson>>> | undefined;

/**
 * Each episode's people, keyed by episode slug: asked once, and empty when
 * the database is off or out of reach (the cast is extra; the archive is
 * not).
 */
function peopleBySlug(): Promise<Map<string, Array<CastPerson>>> {
  cast ??= queryPeople().catch((error) => {
    console.warn('[starpod] No cast for the archive:', error);
    return new Map();
  });
  return cast;
}

async function queryPeople(): Promise<Map<string, Array<CastPerson>>> {
  const bySlug = new Map<string, Array<CastPerson>>();
  if (!database) {
    return bySlug;
  }
  const db = createDb(
    import.meta.env.ASTRO_DB_REMOTE_URL,
    import.meta.env.ASTRO_DB_APP_TOKEN
  );
  const rows = await db
    .select({
      id: Person.id,
      img: Person.img,
      isHost: HostOrGuest.isHost,
      name: Person.name,
      slug: HostOrGuest.episodeSlug
    })
    .from(HostOrGuest)
    .innerJoin(Person, eq(HostOrGuest.personId, Person.id));
  for (const { slug, ...person } of rows) {
    bySlug.set(slug, [...(bySlug.get(slug) ?? []), person]);
  }
  return bySlug;
}

let everyone: Promise<Array<ArchiveChoice>> | undefined;

/**
 * Everyone in the archive and how many episodes they are on, most first: the
 * With filter's choices without the card art, for the search palette (every
 * page). Gathered once; empty when the database is off or out of reach.
 */
export function loadPeople(): Promise<Array<ArchiveChoice>> {
  everyone ??= (async () => {
    const counted = new Map<
      string,
      CastPerson & { count: number; hosted: number }
    >();
    for (const cast of (await peopleBySlug()).values()) {
      for (const person of cast) {
        const seen = counted.get(person.id);
        counted.set(person.id, {
          ...person,
          count: (seen?.count ?? 0) + 1,
          hosted: (seen?.hosted ?? 0) + (person.isHost ? 1 : 0)
        });
      }
    }
    const choices = await Promise.all(
      [...counted.values()].map(
        async (person): Promise<ArchiveChoice> => ({
          value: person.id,
          label: person.name,
          count: person.count,
          avatar: await avatarFor(person.img),
          host: person.hosted * 2 > person.count
        })
      )
    );
    return choices.sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label)
    );
  })().catch(() => []);
  return everyone;
}

export async function loadArchive(episodes: Array<Episode>, show: Show) {
  const people = await peopleBySlug();
  const hosts = starpodConfig.hosts.map((host) => host.name);

  const cards: Array<ArchiveCard> = await Promise.all(
    episodes.map(async (episode, index) => ({
      episode,
      index,
      art: await cardArt(
        episode.episodeImage,
        episode.episodeThumbnail ?? show.image
      ),
      people: await Promise.all(
        sortCast(people.get(episode.episodeSlug) ?? [], hosts).map(
          async (person) => ({
            id: person.id,
            name: person.name,
            avatar: await avatarFor(person.img),
            isHost: person.isHost
          })
        )
      ),
      year: String(new Date(episode.published).getFullYear())
    }))
  );

  const years = new Map<string, number>();
  const everyone = new Map<string, ArchiveChoice>();
  for (const card of cards) {
    years.set(card.year, (years.get(card.year) ?? 0) + 1);
    for (const person of card.people) {
      const choice = everyone.get(person.id);
      everyone.set(person.id, {
        value: person.id,
        label: person.name,
        count: (choice?.count ?? 0) + 1,
        avatar: person.avatar
      });
    }
  }

  return {
    cards,
    years: [...years]
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(
        ([year, count]): ArchiveChoice => ({ value: year, label: year, count })
      ),
    people: [...everyone.values()].sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label)
    )
  };
}
