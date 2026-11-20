import { effect, signal } from '@preact/signals';

import { matchPageNames } from '../../lib/cast';
import type { TranscriptCue } from '../../lib/cues';
import { cueIndexAt, loadCues } from '../media/cue-cache';
import { currentEpisode, currentTime, isPlaying } from '../state';
import { speakingNow } from './speaking';

/*
  Who is speaking, on every page, for as long as an episode plays: from the
  episode's timed lines (the cues the live script and the scrubber's preview
  read) and the media clock. Everything marked `data-speaks-as` with that
  person (the transcript's label, a configured name or an id) gets
  `data-speaking`, so the rail, the stage cast, people cards, the hero and the
  close-up light together, and keep doing so across navigations. Who on the
  page is which speaker is settled for all the names the page shows at once
  (`matchPageNames`): each speaker lights one person, never a namesake.

  Cheap by construction: until an episode whose lines name speakers is
  loaded, nothing here depends on the clock; while paused, nothing does
  either. Each tick steps on from the last line rather than searching, the
  page is touched only when the speaker changes, and islands that render
  someone are watched for only while someone is speaking.
*/

/** The current episode's lines, once loaded, when they name speakers. */
const lines = signal<Array<TranscriptCue> | null>(null);
let speakers: Array<string> = [];
let index = 0;
let lit: Array<Element> = [];
let loaded: string | undefined;

// Who is which speaker, for the set of names on the page: worked out again
// only when that set changes.
let settledFor = '';
let speakerOf = new Map<string, string>();
function settle(names: Array<string>) {
  const key = [...new Set(names)].sort().join('\n');
  if (key !== settledFor) {
    settledFor = key;
    speakerOf = matchPageNames(names, speakers);
  }
  return speakerOf;
}

const declaredIn = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-speaks-as]'));

// An island that renders someone while another is speaking can change who is
// who (a better match for the speaker may have arrived): mark again.
const arrivals = new MutationObserver((records) => {
  const someone = records.some((record) =>
    Array.from(record.addedNodes).some(
      (node) =>
        node instanceof HTMLElement &&
        (node.matches('[data-speaks-as]') ||
          node.querySelector('[data-speaks-as]'))
    )
  );
  if (someone) {
    mark();
  }
});

function mark() {
  lit.forEach((element) => element.removeAttribute('data-speaking'));
  lit = [];
  arrivals.disconnect();
  const speaker = speakingNow.peek();
  if (!speaker) {
    return;
  }
  const declared = declaredIn(document);
  const who = settle(declared.map((element) => element.dataset.speaksAs!));
  for (const element of declared) {
    if (who.get(element.dataset.speaksAs!) === speaker) {
      element.setAttribute('data-speaking', '');
      lit.push(element);
    }
  }
  arrivals.observe(document.body, { childList: true, subtree: true });
}

/** The line at `time`: one step on from the last in steady playback. */
function lineAt(all: Array<TranscriptCue>, time: number) {
  const here = all[index];
  const next = all[index + 1];
  if (here && here.s <= time && (!next || next.s > time)) {
    return index;
  }
  const after = all[index + 2];
  if (next && next.s <= time && (!after || after.s > time)) {
    return (index += 1);
  }
  return (index = cueIndexAt(all, time));
}

// The episode's lines, fetched once when it is loaded (shared with the live
// script and the scrubber); nothing when its transcript names no one.
effect(() => {
  const slug = currentEpisode.value?.slug;
  if (slug === loaded) {
    return;
  }
  loaded = slug;
  lines.value = null;
  speakers = [];
  settledFor = '';
  index = 0;
  if (slug) {
    void loadCues(slug).then((all) => {
      const named = [...new Set(all.flatMap((cue) => (cue.n ? [cue.n] : [])))];
      if (slug === loaded && named.length) {
        speakers = named;
        lines.value = all;
      }
    });
  }
});

effect(() => {
  const all = lines.value;
  const speaker =
    all && isPlaying.value
      ? all[lineAt(all, currentTime.value + 0.25)]?.n
      : undefined;
  if (speaker !== speakingNow.peek()) {
    speakingNow.value = speaker;
    mark();
  }
});

// A new page brings its own people.
document.addEventListener('astro:page-load', mark);
