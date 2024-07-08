import type { MutableRef } from 'preact/hooks';
import './styles.css';

type Props = {
  audioPlayer: MutableRef<HTMLAudioElement | null>;
};

export default function ForwardButton({ audioPlayer }: Props) {
  return (
    <button
      type="button"
      className="forward-button gradient-icon relative h-6 w-6 rounded-full focus:outline-none"
      onClick={() => {
        if (audioPlayer.current) {
          audioPlayer.current.currentTime += 10;
        }
      }}
      aria-label="Fast-forward 10 seconds"
    >
      <div className="absolute -inset-4 -left-2 md:hidden" />
    </button>
  );
}
