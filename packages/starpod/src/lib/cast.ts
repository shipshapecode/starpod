import type { TranscriptCue } from './cues';

/** A person on an episode, as recorded in the guests/sponsors database. */
export interface CastPerson {
  id: string;
  img: string | null;
  isHost: boolean;
  name: string;
}

/**
 * The episode's people in credit order: this episode's hosts first (the
 * show's configured hosts in config order, then guest hosts alphabetically),
 * then guests alphabetically. Whether someone hosted is the episode's own
 * record (`isHost`), so a regular host who joined one episode as a guest is
 * credited as a guest there.
 */
export function sortCast(
  people: Array<CastPerson>,
  configuredHosts: Array<string>
): Array<CastPerson> {
  return [...people].sort((a, b) => {
    if (a.isHost !== b.isHost) {
      return a.isHost ? -1 : 1;
    }
    if (!a.isHost) {
      return a.name.localeCompare(b.name);
    }
    const aIndex = configuredHosts.indexOf(a.name);
    const bIndex = configuredHosts.indexOf(b.name);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) {
      return -1;
    }
    if (bIndex !== -1) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  });
}

const tokens = (name: string) =>
  name
    .toLowerCase()
    .split(/[\s.]+/)
    // Letters and digits in any script, so non-Latin names survive.
    .map((token) => token.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean);

/**
 * Do these two names refer to the same person? Loosely: their first names
 * start the same way ("Robbie" ~ "RobbieTheWagner"), or they share a surname
 * ("Chuck Carpenter" ~ "Charles William Carpenter III").
 */
export function sameName(a: string, b: string) {
  const [aFirst = '', ...aRest] = tokens(a);
  const [bFirst = '', ...bRest] = tokens(b);
  if (aFirst.length >= 3 && bFirst.length >= 3 && (aFirst.startsWith(bFirst) || bFirst.startsWith(aFirst))) {
    return true;
  }
  return aRest.some((token) => token.length >= 4 && bRest.includes(token));
}

/**
 * How surely two names are one person, 0 when they aren't:
 * 4  the same name ("Shruti Kapoor");
 * 3  first names that agree and a shared surname ("Rob Wagner" ~ "Robbie
 *    Wagner");
 * 2  first names that agree where one name has nothing else ("Jason" ~
 *    "Jason Lengstorf", "RobbieTheWagner" ~ "Robbie Wagner");
 * 1  only a shared surname ("Chuck Carpenter" ~ "Charles William Carpenter
 *    III"), counted only when `surnames` is on: within one episode's own cast,
 *    never across the site, where every Wagner would match.
 * Two full names whose surnames differ ("Adam Rackis", "Adam Argyle") never
 * match.
 */
function likeness(a: string, b: string, surnames: boolean) {
  const [aFirst = '', ...aRest] = tokens(a);
  const [bFirst = '', ...bRest] = tokens(b);
  if (!aFirst || !bFirst) {
    return 0;
  }
  if ([aFirst, ...aRest].join(' ') === [bFirst, ...bRest].join(' ')) {
    return 4;
  }
  const firsts =
    aFirst.length >= 3 &&
    bFirst.length >= 3 &&
    (aFirst.startsWith(bFirst) || bFirst.startsWith(aFirst));
  const surname = aRest.some(
    (token) => token.length >= 4 && bRest.includes(token)
  );
  if (firsts && surname) {
    return 3;
  }
  if (firsts && (!aRest.length || !bRest.length)) {
    return 2;
  }
  return surnames && surname && !firsts ? 1 : 0;
}

/**
 * Pairs each item with at most one candidate and each candidate with at most
 * one item: the surest pairs first, and a pair that ties with another for
 * the same item or candidate is ambiguous and goes to neither, so nothing is
 * matched by a guess.
 */
function pair<T>(
  items: Array<T>,
  candidates: Array<string>,
  score: (item: T, candidate: string) => number
) {
  const pairs: Array<{ item: T; candidate: string; score: number }> = [];
  for (const item of items) {
    for (const candidate of new Set(candidates)) {
      const value = score(item, candidate);
      if (value) {
        pairs.push({ item, candidate, score: value });
      }
    }
  }
  pairs.sort((a, b) => b.score - a.score);
  const matched = new Map<T, string>();
  const used = new Set<string>();
  for (let start = 0; start < pairs.length; ) {
    let end = start;
    while (end < pairs.length && pairs[end].score === pairs[start].score) {
      end++;
    }
    const open = pairs
      .slice(start, end)
      .filter(
        ({ item, candidate }) => !matched.has(item) && !used.has(candidate)
      );
    for (const one of open) {
      const rivals = open.filter(
        (other) =>
          other !== one &&
          (other.item === one.item || other.candidate === one.candidate)
      );
      if (!rivals.length) {
        matched.set(one.item, one.candidate);
        used.add(one.candidate);
      }
    }
    start = end;
  }
  return matched;
}

/**
 * Pairs each of `names` with at most one of `candidates`, and each candidate
 * with at most one name, surest first (see `likeness` and `pair`). Returns
 * name → candidate. Used to find who in a cast is which transcript speaker.
 */
export function matchNames(
  names: Array<string>,
  candidates: Array<string>,
  { surnames = false } = {}
) {
  return pair([...new Set(names)], candidates, (name, candidate) =>
    likeness(name, candidate, surnames)
  );
}

/**
 * Who on a page is speaking: `names` are the people a page shows (however
 * each element names them), `speakers` the playing transcript's. Names that
 * are surely one person ("RobbieTheWagner" on the rail, "Robbie Wagner" on a
 * card) count as one, so all of them light; otherwise each speaker goes to
 * at most one person, the surest, and never by a shared surname alone, so a
 * host's lines light no namesake. Returns name → speaker.
 */
export function matchPageNames(names: Array<string>, speakers: Array<string>) {
  const people: Array<Array<string>> = [];
  for (const name of new Set(names)) {
    const same = people.filter((person) =>
      person.some((other) => likeness(name, other, false) >= 2)
    );
    // A name that could be either of two people stays on its own.
    if (same.length === 1) {
      same[0].push(name);
    } else {
      people.push([name]);
    }
  }
  const matched = pair(people, speakers, (person, speaker) =>
    Math.max(...person.map((name) => likeness(name, speaker, false)))
  );
  return new Map(
    [...matched].flatMap(([person, speaker]) =>
      person.map((name) => [name, speaker] as const)
    )
  );
}

/**
 * Which transcript voice (0 or 1, the two most talkative speakers) a person
 * speaks in, so their name on the stage wears the same typeface as their
 * lines. Pass the episode's whole `cast` so each speaker goes to the right one
 * of them (`matchNames`); people who don't speak as one of those two, or
 * can't be told apart, get no voice.
 */
export function voiceFor(
  name: string,
  cues: Array<TranscriptCue> | null,
  cast: Array<string> = [name]
): number | undefined {
  if (!cues?.length) {
    return undefined;
  }
  const speakers = [...new Set(cues.flatMap((cue) => (cue.n ? [cue.n] : [])))];
  const speaker = matchNames(cast, speakers, { surnames: true }).get(name);
  const voice = speaker ? cues.find((cue) => cue.n === speaker)?.v : undefined;
  return voice === 0 || voice === 1 ? voice : undefined;
}

/**
 * Which of a transcript's speakers one name is, on its own (no cast to weigh
 * it against): exact, or first names that agree (`matchNames`, without
 * surname-only matches). Undefined when none matches surely.
 */
export function speakerFor(name: string, speakers: Array<string>) {
  return matchNames([name], speakers).get(name);
}

/** 1st, 2nd, 3rd, 4th … 11th, 12th, 13th … 21st. */
export function ordinal(n: number) {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th');
  return `${n}${suffix}`;
}

/**
 * The one line under a person's name that says something about them, the
 * first that applies, in sentence case. On an episode (`appearance` given:
 * which of their episodes this one is, oldest first): a host's tally, a
 * guest's first time, or which time this is and where they first appeared.
 * Anywhere else: their role and tally.
 */
export function personFact({
  appearance,
  count,
  first,
  host
}: {
  /** Which of their episodes this one is, oldest first (1-based). */
  appearance?: number;
  /** How many episodes they are on. */
  count: number;
  /** Their first episode, as the site labels it ("Ep 112"). */
  first?: string;
  host: boolean;
}) {
  const episodes = `${count} ${count === 1 ? 'episode' : 'episodes'}`;
  if (host || appearance === undefined) {
    return `${host ? 'Host' : 'Guest'} · ${episodes}`;
  }
  if (count <= 1) {
    return 'First time on the show';
  }
  if (appearance === 1) {
    return `First of ${count} appearances`;
  }
  return first
    ? `${ordinal(appearance)} appearance · first on ${first}`
    : `${ordinal(appearance)} appearance`;
}

/**
 * Whether `personFact`'s line already says how many episodes they are on
 * (a first time says it's one), so a tally beside it would repeat it.
 */
export function factGivesCount({
  appearance,
  count,
  host
}: {
  appearance?: number;
  count: number;
  host: boolean;
}) {
  return host || appearance === undefined || count <= 1 || appearance === 1;
}
