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
    .map((token) => token.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

/**
 * Do these two names refer to the same person? Loosely: their first names
 * start the same way ("Robbie" ~ "RobbieTheWagner"), or they share a surname
 * ("Chuck Carpenter" ~ "Charles William Carpenter III").
 */
function sameName(a: string, b: string) {
  const [aFirst = '', ...aRest] = tokens(a);
  const [bFirst = '', ...bRest] = tokens(b);
  if (aFirst.length >= 3 && bFirst.length >= 3 && (aFirst.startsWith(bFirst) || bFirst.startsWith(aFirst))) {
    return true;
  }
  return aRest.some((token) => token.length >= 4 && bRest.includes(token));
}

/**
 * Which transcript voice (0 or 1, the two most talkative speakers) a person
 * speaks in, so their name on the stage wears the same typeface as their
 * lines. People who don't speak as one of those two, or can't be matched, get
 * no voice.
 */
export function voiceFor(
  name: string,
  cues: Array<TranscriptCue> | null
): number | undefined {
  if (!cues?.length) {
    return undefined;
  }
  for (const voice of [0, 1]) {
    const speaker = cues.find((cue) => cue.v === voice && cue.n)?.n;
    if (speaker && sameName(name, speaker)) {
      return voice;
    }
  }
  return undefined;
}
