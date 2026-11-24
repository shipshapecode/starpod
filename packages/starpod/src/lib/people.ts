/**
 * Who is on each episode, for every page that shows people. Like
 * transcripts (a markdown file, else the feed's), people come from two
 * optional sources: the guests database where it lists the episode, else the
 * feed's `<podcast:person>` tags (src/lib/feed-media.ts). With neither,
 * nobody is named, and the pieces that show people leave themselves out.
 *
 * Server-only.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { eq } from 'drizzle-orm';
import { database } from 'virtual:starpod/config';

// The face for someone without a photo, light or dark with the page.
import avatar from '../assets/avatar.svg?url';
import { createDb } from '../db';
import { HostOrGuest, Person } from '../db/schema';
import { dasherize } from '../utils/dasherize';
import { matchNames, type CastPerson } from './cast';
import { getAllEpisodes } from './rss';

interface Records {
  bySlug: Map<string, Array<CastPerson>>;
  everyone: Array<Pick<CastPerson, 'id' | 'img' | 'name'>>;
}

/** The database's casts, and everyone in it; nothing when it is off or out of reach. */
async function fromDatabase(): Promise<Records> {
  const none: Records = { bySlug: new Map(), everyone: [] };
  if (!database) {
    return none;
  }
  try {
    const db = createDb(
      import.meta.env.ASTRO_DB_REMOTE_URL,
      import.meta.env.ASTRO_DB_APP_TOKEN
    );
    const [rows, everyone] = await Promise.all([
      db
        .select({
          id: Person.id,
          img: Person.img,
          isHost: HostOrGuest.isHost,
          name: Person.name,
          slug: HostOrGuest.episodeSlug
        })
        .from(HostOrGuest)
        .innerJoin(Person, eq(HostOrGuest.personId, Person.id)),
      db
        .select({ id: Person.id, img: Person.img, name: Person.name })
        .from(Person)
    ]);
    const bySlug = new Map<string, Array<CastPerson>>();
    for (const { slug, ...person } of rows) {
      bySlug.set(slug, [...(bySlug.get(slug) ?? []), person]);
    }
    return { bySlug, everyone };
  } catch (error) {
    console.warn(
      '[starpod] The guests database is out of reach; people come from the feed alone.',
      error
    );
    return none;
  }
}

let cast: Promise<Map<string, Array<CastPerson>>> | undefined;

/**
 * Each episode's hosts and guests, keyed by episode slug: the database's
 * where it lists the episode, else the feed's. A name the feed gives that the
 * database knows (the same name, or surely the same person) is that record,
 * so one person has one id, and one photo, across both. Gathered once.
 */
export function peopleBySlug(): Promise<Map<string, Array<CastPerson>>> {
  cast ??= (async () => {
    const [{ bySlug, everyone }, episodes] = await Promise.all([
      fromDatabase(),
      getAllEpisodes()
    ]);
    const recordOf = matchNames(
      episodes.flatMap(
        (episode) => episode.people?.map((person) => person.name) ?? []
      ),
      everyone.map((person) => person.name)
    );
    const byName = new Map(everyone.map((person) => [person.name, person]));
    for (const episode of episodes) {
      if (!episode.people || bySlug.has(episode.episodeSlug)) {
        continue;
      }
      bySlug.set(
        episode.episodeSlug,
        episode.people.map((person) => {
          const record = byName.get(recordOf.get(person.name) ?? '');
          return {
            id: record?.id ?? dasherize(person.name),
            img: record?.img ?? person.img ?? null,
            isHost: person.role === 'host',
            name: record?.name ?? person.name
          };
        })
      );
    }
    return bySlug;
  })();
  return cast;
}

const photos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/img/people/*.{jpeg,jpg,png}'
);
const faces = new Map<string, Promise<string>>();

/**
 * A person's face, square at `size`: their photo (a file in src/img/people,
 * or the feed's image URL), else the avatar.
 */
export function faceOf(
  img: string | null | undefined,
  size: number
): Promise<string> {
  const key = `${img ?? ''}@${size}`;
  if (!faces.has(key)) {
    faces.set(
      key,
      (async () => {
        const src = !img
          ? undefined
          : /^https?:\/\//i.test(img)
            ? img
            : (await photos[`/src/img/people/${img}`]?.())?.default;
        if (!src) {
          return avatar;
        }
        try {
          return (
            await getImage({ src, width: size, height: size, format: 'webp' })
          ).src;
        } catch {
          return avatar;
        }
      })()
    );
  }
  return faces.get(key)!;
}
