import type { MutableRef } from 'preact/hooks';

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
      <div
        class="slider h-1.5 flex-1 bg-gray-200 dark:bg-gray-700"
        onClick={(e: MouseEvent) => {
          const { clientX, offsetX } = e;
          const leftEdge = clientX - offsetX;
          const sliderWidth =
            (e.target as HTMLDivElement).closest('.slider')?.clientWidth ?? 0;
          const relativePosition = (e.x - leftEdge) / sliderWidth;
          const value =
            relativePosition < 0
              ? 0
              : relativePosition > 1
                ? 1
                : relativePosition;

          if (audioPlayer?.current) {
            const selectedTime = value * audioPlayer.current?.duration;
            audioPlayer.current.currentTime = selectedTime;
          }
        }}
      >
        <div
          aria-orientation="horizontal"
          role="slider"
          aria-label="audio timeline"
          aria-valuemin={0}
          aria-valuemax={Math.floor(audioPlayer.current?.duration ?? 0)}
          aria-valuenow={Math.floor(audioPlayer.current?.currentTime ?? 0)}
          aria-valuetext={`${Math.floor(
            audioPlayer.current?.currentTime ?? 0
          )} seconds`}
          class="slider-progress h-1.5 bg-gradient-to-r from-[#D8CCFF] to-[#8A63FF] dark:from-[#42C8F3] dark:to-[#B6EDFF]"
          style={`width: ${progress}%`}
        ></div>
      </div>
      <span class="hidden text-sm md:inline-block">
        {formatTime(currentTime, totalTime)} / {formatTime(totalTime)}
      </span>
    </div>
  );
}
