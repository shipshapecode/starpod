import { effect } from '@preact/signals';
import type { RefObject } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';

import { reducedMotion } from '../../motion/propflip';
import { formatClock } from '../../utils/playable';
import { currentEpisode, currentTime, type PlayableEpisode } from '../state';

/** The last turn that starts at or before `time` (0 when none does). */
function turnAt(starts: Array<number>, time: number) {
  let low = 0;
  let high = starts.length - 1;
  let found = 0;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (starts[mid] <= time) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return found;
}

type Props = { episode: PlayableEpisode; root: RefObject<HTMLElement> };

/**
 * Follows playback through a transcript of turns (`.ep-turn`, each opening
 * with its seek chip). The turn being spoken carries `data-live`, and
 * "jump to the live line" markers move into the flow around it: one before
 * it, sticky to the bottom of the screen, and one after it, sticky to the
 * top. So while the turn has not been reached yet the first pins to the
 * bottom edge, once it has gone by entirely the second pins to the top, and
 * while any of it is on screen neither does. A sticky box can't leave its
 * parent, so in a long transcript (turns in groups) a second pair does the
 * same around the live turn's group. CSS shows a marker's button only while
 * it is stuck (scroll-state queries). Only one pair is ever present, so
 * assistive tech finds one jump: the turn's while its group is in view, the
 * group's while it isn't (one IntersectionObserver, on the live group). One
 * binary search per time update; the DOM is only touched when the live turn
 * changes, or its group comes into or out of view.
 */
export default function LiveTurn({ episode, root }: Props) {
  const ahead = useRef<HTMLDivElement>(null);
  const behind = useRef<HTMLDivElement>(null);
  const groupAhead = useRef<HTMLDivElement>(null);
  const groupBehind = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLElement>();

  // Following playback from hydration on, not after the next frame (a still
  // page in WebKit may not paint one for a while).
  useLayoutEffect(() => {
    const markers = [ahead, behind, groupAhead, groupBehind].map(
      (ref) => ref.current!
    );
    const turns = Array.from(
      root.current?.querySelectorAll<HTMLElement>('.ep-turn') ?? []
    );
    if (!turns.length) {
      return;
    }
    const starts = turns.map((turn) =>
      Number(turn.querySelector<HTMLElement>('[data-seek]')?.dataset.seek ?? 0)
    );

    let liveGroup: Element | null = null;
    let groupInView = true;
    const expose = () =>
      markers.forEach((marker, n) => {
        marker.hidden =
          !live.current ||
          (n > 1
            ? !liveGroup || groupInView
            : Boolean(liveGroup) && !groupInView);
      });
    // Only a transcript long enough to come in groups needs to watch one.
    let seen: IntersectionObserver | undefined;

    const stop = effect(() => {
      const index = turnAt(starts, currentTime.value);
      const next =
        currentEpisode.value?.id === episode.id ? turns[index] : undefined;
      if (next === live.current) {
        return;
      }
      live.current?.removeAttribute('data-live');
      live.current = next;
      const group = next?.parentElement?.closest('.ep-turns') ?? null;
      if (group !== liveGroup) {
        if (liveGroup) {
          seen?.unobserve(liveGroup);
        }
        liveGroup = group;
        if (group) {
          seen ??= new IntersectionObserver(([entry]) => {
            groupInView = entry.isIntersecting;
            expose();
          });
          seen.observe(group);
        }
      }
      markers.forEach((marker) => {
        marker.querySelector('time')!.textContent = next
          ? formatClock(starts[index])
          : '';
      });
      expose();
      if (!next) {
        return;
      }
      next.setAttribute('data-live', '');
      next.before(markers[0]);
      next.after(markers[1]);
      group?.before(markers[2]);
      group?.after(markers[3]);
    });
    return () => {
      stop();
      seen?.disconnect();
    };
  }, [episode.id, root]);

  function jump() {
    const turn = live.current;
    turn
      ?.querySelector<HTMLElement>('[data-seek]')
      ?.focus({ preventScroll: true });
    turn?.scrollIntoView({
      block: 'center',
      behavior: reducedMotion() ? 'auto' : 'smooth'
    });
  }

  const marker = (edge: 'top' | 'bottom', ref: typeof ahead) => (
    <div class="ep-now" data-edge={edge} hidden ref={ref}>
      <button class="ep-now-jump" onClick={jump} type="button">
        <svg
          aria-hidden="true"
          class="ep-now-caret"
          fill="none"
          height="16"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            d="M8 3v10m0 0-4-4m4 4 4-4"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <span class="sr-only">Jump to the line playing now, at</span>
        <span aria-hidden="true">Now ·</span>
        <time />
      </button>
    </div>
  );

  return (
    <>
      {marker('bottom', ahead)}
      {marker('top', behind)}
      {marker('bottom', groupAhead)}
      {marker('top', groupBehind)}
    </>
  );
}
