import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';

import type { TranscriptCue } from '../../lib/cues';
import { formatClock } from '../../utils/playable';
import { currentEpisode, currentTime, seekToEpisode, type PlayableEpisode } from '../state';
import { cueIndexAt, loadCues } from './cue-cache';

type Props = { episode: PlayableEpisode };

const BEFORE = 5;
const AFTER = 2;
// Further than this and the lines on screen aren't the same conversation:
// crossfade instead of flying lines across unrelated text.
const JUMP = 3;
const EASE = 'cubic-bezier(0.25, 1, 0.5, 1)';
const MOVE_MS = 720;

type Box = { top: number; left: number; right: number; size: number };

/**
 * FLIP the script from its last layout to its new one. Sizes and line
 * positions change instantly in the layout (no reflowing transitions, so the
 * text never re-wraps mid-motion); each line then animates from where it was
 * to where it is using transforms only: the new live line swells, spoken
 * lines glide up as they shrink, and arrivals fade up from below.
 */
function useFlip(
  list: { current: HTMLOListElement | null },
  anchor: number,
  cues: Array<TranscriptCue> | null
) {
  const boxes = useRef(new Map<number, Box>());
  const lastAnchor = useRef<number | null>(null);

  useLayoutEffect(() => {
    const ol = list.current;
    if (!ol) {
      return;
    }
    // Off screen the lines skip rendering (content-visibility), so nothing
    // is measured or animated there; back on screen, the next change starts
    // from where the lines are.
    if (ol.firstElementChild?.checkVisibility?.({ contentVisibilityAuto: true }) === false) {
      boxes.current = new Map();
      lastAnchor.current = null;
      return;
    }
    const calm =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previous = boxes.current;
    const next = new Map<number, Box>();
    const moved = lastAnchor.current !== null && lastAnchor.current !== anchor;
    const jumped = moved && Math.abs(anchor - lastAnchor.current!) > JUMP;
    const origin = ol.getBoundingClientRect();

    for (const li of Array.from(ol.children) as Array<HTMLElement>) {
      li.getAnimations?.().forEach((animation) => animation.cancel());
      const index = Number(li.dataset.index);
      const rect = li.getBoundingClientRect();
      const box = {
        top: rect.top - origin.top,
        left: rect.left - origin.left,
        right: rect.right - origin.left,
        size: parseFloat(getComputedStyle(li).fontSize) || 16
      };
      next.set(index, box);
      if (!moved || jumped || calm) {
        continue;
      }
      const before = previous.get(index);
      if (!before) {
        li.animate?.([{ opacity: 0, transform: 'translateY(18px)' }, {}], {
          duration: MOVE_MS,
          easing: EASE
        });
        continue;
      }
      const fromRight = li.dataset.v === '1';
      const dx = fromRight ? before.right - box.right : before.left - box.left;
      const dy = before.top - box.top;
      const scale = before.size / box.size;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(scale - 1) < 0.01) {
        continue;
      }
      li.style.transformOrigin = fromRight ? 'top right' : 'top left';
      li.animate?.(
        [{ transform: `translate(${dx}px, ${dy}px) scale(${scale})` }, { transform: 'none' }],
        { duration: MOVE_MS, easing: EASE }
      );
    }

    if (jumped && !calm) {
      ol.animate?.([{ opacity: 0.1 }, { opacity: 1 }], { duration: 420, easing: EASE });
    }
    boxes.current = next;
    lastAnchor.current = anchor;
  }, [anchor, cues, list]);
}

/**
 * The stage's signature: the conversation typeset live beside the
 * player. Each voice speaks in its own face, the line being heard swells, and
 * lines already spoken shrink back into the page. Any line seeks.
 */
export default function LiveScript({ episode }: Props) {
  const [cues, setCues] = useState<Array<TranscriptCue> | null>(null);

  // Fetched as hydration completes, not after the next frame; again for a
  // new episode, whose lines replace the last one's (a reply for the old one
  // arriving late is dropped).
  useLayoutEffect(() => {
    if (!episode.slug) {
      setCues([]);
      return;
    }
    let current = true;
    setCues(null);
    void loadCues(episode.slug).then((next) => current && setCues(next));
    return () => {
      current = false;
    };
  }, [episode.slug]);

  const list = useRef<HTMLOListElement>(null);
  const isCurrent = currentEpisode.value?.id === episode.id;
  const live = useMemo(
    () => (cues?.length && isCurrent ? cueIndexAt(cues, currentTime.value + 0.25) : -1),
    [cues, isCurrent, Math.floor(currentTime.value * 4)]
  );

  // Idle (not this episode, or not started): the opening line already holds
  // the stage at full voice, with what follows waiting below it.
  const idle = live === -1;
  const anchor = idle ? 0 : live;
  useFlip(list, idle ? -1 : anchor, cues);

  if (!cues) {
    return <div aria-hidden="true" class="script" data-state="loading" />;
  }

  if (cues.length === 0) {
    return <div class="script" data-state="empty" />;
  }

  const start = idle ? 0 : Math.max(0, anchor - BEFORE);
  const end = Math.min(cues.length, anchor + (idle ? 4 : AFTER + 1));
  const visible = cues.slice(start, end);
  const speakers = new Set(cues.map((cue) => cue.n).filter(Boolean)).size;

  return (
    <ol
      aria-label="Live transcript"
      class="script"
      data-state={idle ? 'preview' : 'live'}
      data-voices={speakers}
      ref={list}
    >
      {visible.map((cue, offset) => {
        const index = start + offset;
        const distance = index - anchor;
        return (
          <li
            class="script-line"
            data-d={Math.max(-5, Math.min(2, distance))}
            data-index={index}
            data-long={cue.t.length > 90 ? '' : undefined}
            data-v={cue.v ?? 'none'}
            key={index}
          >
            <button
              aria-label={`Play from ${formatClock(cue.s)}${cue.n ? `, ${cue.n}` : ''}`}
              class="script-seek"
              onClick={() => seekToEpisode(episode, cue.s)}
              type="button"
            >
              <span class="script-meta">
                {formatClock(cue.s)}
                {cue.n && ` · ${cue.n}`}
              </span>
              <span class="script-text">{cue.t}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
