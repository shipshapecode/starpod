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
  const [currentTime, setCurrentTime] = useState(0);

  if (currentEpisode.value === null) {
    return;
  }

  const { audio, episodeNumber, title } = currentEpisode.value;

  function whilePlaying() {
    if (audioPlayer.current?.duration) {
      const time = audioPlayer.current.currentTime;
      const percentage = (time / audioPlayer.current.duration) * 100;
      setCurrentTime(time);

      const slider = document.querySelector('.slider');
      const particles = document.querySelector('.ship-particles');

      if (slider) {
        (slider as HTMLElement).style.setProperty(
          '--seek-before-width',
          `${percentage}%`
        );
      }

      if (particles && slider) {
        const pxOffset = slider.clientWidth * (percentage / 100);
        (particles as HTMLElement).style.setProperty(
          '--seek-particles-left',
          `${pxOffset - 10}px` // -5 to put the dots into the track
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
    const duration = audioPlayer.current?.duration ?? 0;
    if (duration > 0 && currentTime >= duration - 0.01) {
      isPlaying.value = false;
      setCurrentTime(0);
    }
  }, [currentTime]);

  return (
    <div class="player fixed inset-x-0 bottom-0 z-50 lg:left-112 xl:left-120">
      <div
        class="flex items-center gap-6 bg-light-player/90 px-4 py-4 backdrop-blur-xs md:px-6 dark:bg-dark-player/90"
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
            <Slider audioPlayer={audioPlayer} currentTime={currentTime} />
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
