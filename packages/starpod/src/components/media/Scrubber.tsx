import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';

import type { TranscriptCue } from '../../lib/cues';
import { formatClock } from '../../utils/playable';
import type { PlayableEpisode } from '../state';
import { cueIndexAt, loadCues } from './cue-cache';
import { seek } from './engine';

type Props = {
  duration: number;
  episode: PlayableEpisode;
  time: number;
};

const BUBBLE_HALF = 160;
const EDGE = 12;

/**
 * The dock's timeline. Hovering it (or dragging it on touch) previews the
 * moment under the pointer: its time, who is speaking, and what they say,
 * typeset in that speaker's voice. Transcripts load on first approach.
 */
export default function Scrubber({ duration, episode, time }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [cues, setCues] = useState<Array<TranscriptCue> | null>(null);
  const [preview, setPreview] = useState<{ at: number; x: number; top: number } | null>(null);
  const dragging = useRef(false);

  const slug = useRef(episode.slug);
  slug.current = episode.slug;
  useEffect(() => {
    setCues(null);
  }, [episode.slug]);

  const warm = () => {
    const asked = episode.slug;
    if (!cues && asked) {
      // An answer for an episode that is no longer this one is dropped.
      void loadCues(asked).then((loaded) => slug.current === asked && setCues(loaded));
    }
  };

  const show = (clientX: number) => {
    const rect = input.current?.getBoundingClientRect();
    if (!rect || !duration) {
      return;
    }
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const half = Math.min(BUBBLE_HALF, window.innerWidth / 2 - EDGE);
    setPreview({
      at: fraction * duration,
      x: Math.min(window.innerWidth - EDGE - half, Math.max(EDGE + half, clientX)),
      top: rect.top
    });
  };

  const cue =
    preview && cues?.length ? cues[cueIndexAt(cues, preview.at)] : undefined;

  return (
    <>
      <input
        aria-label="Seek"
        aria-valuetext={`${formatClock(time)} of ${formatClock(duration)}`}
        class="scrubber"
        max={duration || 1}
        min={0}
        onInput={(event) => {
          const value = Number((event.target as HTMLInputElement).value);
          seek(value);
          if (dragging.current && input.current) {
            const rect = input.current.getBoundingClientRect();
            show(rect.left + (duration ? (value / duration) * rect.width : 0));
          }
        }}
        onPointerDown={(event) => {
          warm();
          if (event.pointerType !== 'mouse') {
            dragging.current = true;
            show(event.clientX);
          }
        }}
        onPointerEnter={warm}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') {
            setPreview(null);
          }
        }}
        onPointerMove={(event) => {
          if (event.pointerType === 'mouse' || dragging.current) {
            show(event.clientX);
          }
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== 'mouse') {
            dragging.current = false;
            setPreview(null);
          }
        }}
        onPointerCancel={() => {
          dragging.current = false;
          setPreview(null);
        }}
        ref={input}
        step={1}
        type="range"
        value={time}
      />
      {/* The ship's exhaust (the thumb is the ship): sparks trailing its tail,
          carried along by the media clock's progress (player.css). */}
      <span aria-hidden="true" class="ship-particles">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      {/* Rendered beside the player, not inside it: the player's parts are
          transformed while they travel, and the bubble is fixed to the screen. */}
      {createPortal(
        <div
          aria-hidden="true"
          class="scrub-preview pointer-events-none fixed top-[var(--top,100vh)] left-[var(--x,50vw)] z-60 flex w-max max-w-[min(320px,calc(100vw-24px))] origin-[50%_100%] flex-col gap-1 rounded-[12px] border border-line bg-surface px-[13px] pt-[10px] pb-[11px] opacity-0 shadow-[var(--shadow-float)] scale-94 [transition:opacity_160ms_var(--ease-out),scale_240ms_var(--ease-out)] -translate-x-1/2 -translate-y-[calc(100%+14px)] data-open:opacity-100 data-open:scale-100"
          data-open={preview ? '' : undefined}
          style={
            preview
              ? { '--x': `${preview.x}px`, '--top': `${preview.top}px` }
              : undefined
          }
        >
          <span class="text-[0.75rem] font-bold text-accent-ink tabular-nums">
            {formatClock(preview?.at ?? 0)}
            {cue?.n && <span class="font-semibold text-muted"> · {cue.n}</span>}
          </span>
          {cue && (
            <span class="scrub-preview-line line-clamp-3 text-[0.875rem] leading-[1.35] text-pretty text-ink" data-v={cue.v ?? 'none'}>
              {cue.t}
            </span>
          )}
        </div>,
        document.querySelector('.dock') ?? document.body
      )}
    </>
  );
}
