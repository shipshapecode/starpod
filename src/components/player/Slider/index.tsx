import type { MutableRef } from 'preact/hooks';
import './styles.css';

type Props = {
  audioPlayer: MutableRef<HTMLAudioElement | null>;
  progress: number;
};

function parseTime(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;
  return [hours, minutes, seconds];
}

function formatTime(seconds: Array<number>, totalSeconds = seconds) {
  let totalWithoutLeadingZeroes = totalSeconds.slice(
    totalSeconds.findIndex((x) => x !== 0)
  );
  return seconds
    .slice(seconds.length - totalWithoutLeadingZeroes.length)
    .map((x) => x.toString().padStart(2, '0'))
    .join(':');
}

export default function Slider({ audioPlayer, progress }: Props) {
  let currentTime = parseTime(
    Math.floor(audioPlayer.current?.currentTime ?? 0)
  );
  let totalTime = parseTime(Math.floor(audioPlayer.current?.duration ?? 0));

  return (
    <div class="absolute inset-x-0 bottom-full flex flex-auto touch-none items-center gap-6 md:relative">
      <input
        aria-orientation="horizontal"
        role="slider"
        aria-label="audio timeline"
        aria-valuemin={0}
        aria-valuemax={Math.floor(audioPlayer.current?.duration ?? 0)}
        aria-valuenow={Math.floor(audioPlayer.current?.currentTime ?? 0)}
        aria-valuetext={`${Math.floor(
          audioPlayer.current?.currentTime ?? 0
        )} seconds`}
        class="slider group"
        type="range"
        max="100"
        value={progress}
        onInput={(e: InputEvent) => {
          if (audioPlayer?.current) {
            const value =
              (Number((e.target as HTMLInputElement).value) / 100) *
              audioPlayer.current.duration;
            audioPlayer.current.currentTime = value;
          }
        }}
      />
      <span class="hidden text-nowrap text-sm tabular-nums md:inline-block">
        {formatTime(currentTime, totalTime)} / {formatTime(totalTime)}
      </span>
    </div>
  );
}
