import { useEffect, useState, useRef } from 'preact/hooks';

import { currentEpisode, isMuted, isPlaying } from '../components/state';
import MuteButton from './player/MuteButton';
import PlayButton from './player/PlayButton';
import PlaybackRateButton from './player/PlaybackRateButton';
import ForwardButton from './player/ForwardButton';
import RewindButton from './player/RewindButton';
import Slider from './player/Slider';

export default function Player() {
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  if (currentEpisode.value === null) {
    return;
  }

  const { audio, episodeNumber, title } = currentEpisode.value;

  function whilePlaying() {
    if (audioPlayer.current?.duration) {
      const percentage =
        (audioPlayer.current.currentTime / audioPlayer.current.duration) * 100;
      setProgress(percentage);
      const slider = document.querySelector('.slider');
      if (slider) {
        console.log(percentage);
        (slider as HTMLElement).style.setProperty(
          '--seek-before-width',
          `${percentage}%`
        );
      }
    }
    progressRef.current = requestAnimationFrame(whilePlaying);
  }

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.src = audio.src;
      audioPlayer.current.currentTime = 0;
      audioPlayer.current.play();
    }
  }, [audio]);

  useEffect(() => {
    if (isPlaying.value) {
      audioPlayer.current?.play();
      progressRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(progressRef.current as number);
    }
  }, [isPlaying.value]);

  useEffect(() => {
    if (progress >= 99.99) {
      isPlaying.value = false;
      setProgress(0);
    }
  }, [progress]);

  return (
    <div class="player fixed inset-x-0 bottom-0 z-50 lg:left-112 xl:left-120">
      <div
        class="flex items-center gap-6 bg-light-player/90 px-4 py-4 backdrop-blur-sm md:px-6 dark:bg-dark-player/90"
        role="region"
        style={{ viewTransitionName: 'player' }}
      >
        <div class="hidden self-start md:block">
          <PlayButton />
        </div>

        <div class="flex flex-1 flex-col gap-3 overflow-hidden p-1">
          <a
            href={`/${episodeNumber}`}
            class="truncate text-center text-sm font-bold leading-6 md:text-left"
            title={title}
          >
            {title}
          </a>

          <div class="flex justify-between gap-6">
            <div class="flex items-center md:hidden">
              <MuteButton />
            </div>
            <div class="flex flex-none items-center gap-4">
              <RewindButton audioPlayer={audioPlayer} />
              <div class="md:hidden">
                <PlayButton />
              </div>
              <ForwardButton audioPlayer={audioPlayer} />
            </div>
            <Slider audioPlayer={audioPlayer} progress={progress} />
            <div class="flex items-center gap-4">
              <div class="flex items-center">
                <PlaybackRateButton audioPlayer={audioPlayer} />
              </div>
              <div class="hidden items-center md:flex">
                <MuteButton />
              </div>
            </div>
          </div>

          <div class="hidden">
            <audio muted={isMuted} ref={audioPlayer} />
          </div>
        </div>
      </div>
    </div>
  );
}
