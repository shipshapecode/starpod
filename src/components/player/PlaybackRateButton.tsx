import { useState, type MutableRef } from 'preact/hooks';

type Props = {
  audioPlayer: MutableRef<HTMLAudioElement | null>;
};

const playbackRates = [1, 1.2, 1.5, 2];

export default function PlaybackRateButton({ audioPlayer }: Props) {
  let [playbackRate, setPlaybackRate] = useState(playbackRates[0]);

  return (
    <button
      type="button"
      className="gradient-icon relative flex h-[18px] w-[18px] items-center justify-center rounded-md transition-colors focus:outline-none"
      onClick={() => {
        setPlaybackRate((rate) => {
          let existingIdx = playbackRates.indexOf(rate);
          let idx = (existingIdx + 1) % playbackRates.length;
          let next = playbackRates[idx];

          if (audioPlayer.current) {
            audioPlayer.current.playbackRate = next;
          }

          return next;
        });
      }}
      aria-label="Playback rate"
    >
      <div class="absolute -inset-4 md:hidden" />
      <div class="flex h-[18px] w-[18px] items-center justify-center rounded p-2 text-[6px] font-black text-light-player/90 transition-colors dark:text-dark-player/90">
        {playbackRate}
        <span class="ml-[1px] flex items-end">x</span>
      </div>
    </button>
  );
}
