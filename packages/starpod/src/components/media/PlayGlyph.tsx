import { useEffect, useRef, useState } from 'preact/hooks';

import { PauseIcon, PlayIcon } from '../icons';

type Props = { onAir?: boolean; playing: boolean; size: number };

/**
 * Play or pause, springing from one to the other when the state flips (but
 * not on first paint, so pages don't arrive with every button popping). With
 * `onAir`, a playing control shows live level bars, and the pause glyph on
 * hover or focus.
 *
 * The server never knows what's playing, so the first client render matches
 * its markup (paused) and the real state follows right after mount. Arriving
 * on a page mid-episode therefore hydrates cleanly and doesn't spring.
 */
export default function PlayGlyph({ onAir = false, playing, size }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shown = mounted && playing;

  const settled = useRef<boolean | null>(null);
  if (mounted && settled.current === null) {
    settled.current = playing;
  }
  const changed = useRef(false);
  if (settled.current !== null && shown !== settled.current) {
    changed.current = true;
  }

  const glyph = (
    <span
      class="glyph"
      data-swap={changed.current ? '' : undefined}
      key={shown ? 'pause' : 'play'}
    >
      {shown ? <PauseIcon size={size} /> : <PlayIcon size={size} />}
    </span>
  );

  if (!onAir || !shown) {
    return glyph;
  }

  return (
    <>
      <span aria-hidden="true" class="onair">
        <i />
        <i />
        <i />
      </span>
      {glyph}
    </>
  );
}
