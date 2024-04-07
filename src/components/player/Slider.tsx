import type { MutableRef } from 'preact/hooks';

type Props = {
  audioPlayer: MutableRef<HTMLAudioElement | null>;
  progress: number;
};

export default function Slider({ audioPlayer, progress }: Props) {
  return (
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
        class="h-1.5 bg-pink-700"
        style={`width: ${progress}%`}
      ></div>
    </div>
  );
}
