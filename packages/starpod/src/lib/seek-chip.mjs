// The seek chip: a timestamp that jumps the player to that moment. Show
// notes, markdown transcripts (via the rehype plugin, at build time), and
// feed transcripts all render the same chip from these definitions, so they
// look and behave alike. Plain JS so the build-time plugin can import it;
// tailwind.css lists this folder as a source so the classes are generated.

export const SEEK_CHIP_CLASS = [
  'seek-chip',
  'mr-2.5 inline-block cursor-pointer rounded-md px-1.5 py-px align-baseline',
  'text-[0.8125rem] font-semibold tabular-nums text-accent-ink',
  // Solid chip: the fill fades into the Iris/Aqua gradient on hover/focus.
  'bg-linear-to-r from-accent-soft to-accent-soft',
  'transition-[--tw-gradient-from,--tw-gradient-to,color] duration-300 ease-(--ease-out)',
  'hover:from-glow-a hover:to-glow-b hover:text-on-glow',
  'focus-visible:from-glow-a focus-visible:to-glow-b focus-visible:text-on-glow'
].join(' ');

const pad = (value) => value.toString().padStart(2, '0');

/** `m:ss`, or `h:mm:ss` past the hour: the natural reading, for speech. */
export function formatClock(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

/**
 * The chip's visible label: always `HH:MM:SS`, the format show notes use.
 * One fixed shape means every chip is the same width (with tabular figures)
 * and the label never depends on its neighbours.
 */
export function chipLabel(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60].map(pad).join(':');
}

/** Attributes every seek chip carries; clicks are handled by `data-seek`. */
export function seekChipAttributes(seconds) {
  return {
    type: 'button',
    class: SEEK_CHIP_CLASS,
    'data-seek': String(Math.floor(seconds)),
    'aria-label': `Play from ${formatClock(seconds)}`,
    label: chipLabel(seconds)
  };
}
