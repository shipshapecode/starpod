import people from './people';

type PersonId = (typeof people)[number]['id'];

/**
 * Who appears on which episode, keyed by episode slug. Hosts are listed in
 * starpod.config.ts; set `isHost` on entries that are hosts so they sort
 * first.
 */
export default {
  // 'my-first-episode-slug': [{ id: 'jane-doe' }]
} as Record<string, Array<{ id: PersonId; isHost?: boolean }>>;
