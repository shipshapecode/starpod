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

  useEffect(() => {
    setCues(null);
  }, [episode.slug]);

  const warm = () => {
    if (!cues && episode.slug) {
      void loadCues(episode.slug).then(setCues);
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
        style={{ '--fill': duration ? `${(time / duration) * 100}%` : '0%' }}
        type="range"
        value={time}
      />
      <div
        aria-hidden="true"
        class="scrub-preview"
        data-open={preview ? '' : undefined}
        style={
          preview
            ? { '--x': `${preview.x}px`, '--top': `${preview.top}px` }
            : undefined
        }
      >
        <span class="scrub-preview-time">
          {formatClock(preview?.at ?? 0)}
          {cue?.n && <span class="scrub-preview-name"> · {cue.n}</span>}
        </span>
        {cue && (
          <span class="scrub-preview-line" data-v={cue.v ?? 'none'}>
            {cue.t}
          </span>
        )}
      </div>
    </>
  );
}
