import { seekChipAttributes } from '../../lib/seek-chip.mjs';

type Props = { onSeek: (seconds: number) => void; seconds: number };

/** A timestamp that jumps the player there. See `lib/seek-chip.mjs`. */
export default function SeekChip({ onSeek, seconds }: Props) {
  const { label, ...attributes } = seekChipAttributes(seconds);
  return (
    <button {...attributes} onClick={() => onSeek(seconds)}>
      {label}
    </button>
  );
}
