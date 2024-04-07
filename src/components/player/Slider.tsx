import type { MutableRef } from 'preact/hooks';

type Props = {
  audioPlayer: MutableRef<HTMLAudioElement | null>;
  progress: number;
};

export default function Slider({ audioPlayer, progress }: Props) {
  return (
    <div class="absolute inset-x-0 bottom-full flex flex-auto touch-none items-center gap-6 md:relative">
      <div class="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700">
        <div
          aria-orientation="horizontal"
          role="slider"
          aria-label="audio timeline"
          aria-valuemin={0}
          aria-valuemax={
            audioPlayer.current && audioPlayer.current.duration
              ? Math.floor(audioPlayer.current.duration)
              : 0
          }
          aria-valuenow={
            audioPlayer.current && audioPlayer.current.currentTime
              ? Math.floor(audioPlayer.current.currentTime)
              : 0
          }
          aria-valuetext={`${
            audioPlayer.current && audioPlayer.current.currentTime
              ? Math.floor(audioPlayer.current.currentTime)
              : 0
          } seconds`}
          class="h-1.5 bg-gradient-to-r from-[#D8CCFF] to-[#8A63FF] dark:from-[#42C8F3] dark:to-[#B6EDFF]"
          style={`width: ${progress}%`}
        ></div>
      </div>
    </div>
  );
}
