import { currentEpisode, isPlaying } from '@components/state';

import { useEffect, useState, useRef } from 'preact/hooks';

const PlayIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="h-4 w-4"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill-rule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
      clip-rule="evenodd"
    />
  </svg>
);

const PauseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="h-4 w-4"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill-rule="evenodd"
      d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
      clip-rule="evenodd"
    />
  </svg>
);

// This app doesn't have real songs, it only has a few songs
// that we will play over and over as the user uses the app.
const MAX_SONGS = 4;

export default function Player() {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const progressRef = useRef(null);
  const [songIndex, setSongIndex] = useState(4);
  const [progress, setProgress] = useState(0);

  if (currentEpisode.value === null) {
    return;
  }

  const { audio, episodeImage, title, artist, albumName } =
    currentEpisode.value;

  function whilePlaying() {
    if (audioPlayer.current.duration) {
      const percentage =
        (audioPlayer.current.currentTime * 100) / audioPlayer.current.duration;
      setProgress(percentage);
    }
    progressRef.current = requestAnimationFrame(whilePlaying);
  }

  useEffect(() => {
    const newIndex = (songIndex % MAX_SONGS) + 1;
    audioPlayer.current.src = audio.src;
    audioPlayer.current.currentTime = 0;
    audioPlayer.current.play();
    setSongIndex(newIndex);
  }, [audio]);

  useEffect(() => {
    if (isPlaying.value) {
      audioPlayer.current?.play();
      progressRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(progressRef.current);
    }
  }, [isPlaying.value]);

  useEffect(() => {
    if (progress >= 99.99) {
      isPlaying.value = false;
      setProgress(0);
    }
  }, [progress]);

  return (
    <div
      class="bg-light-player dark:bg-dark-player fixed inset-x-0 bottom-0 z-10 lg:left-112 xl:left-120"
      role="region"
      aria-labelledby="audio-player-heading"
      style={{ viewTransitionName: 'player' }}
    >
      <h2 id="audio-player-heading" class="sr-only">
        Audio player
      </h2>
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
      <div class="container mx-auto flex max-w-screen-lg items-center gap-5 px-3 py-2 sm:px-6 sm:py-4">
        <img
          src={episodeImage ?? 'http://whiskeywebandwhatnot.fm/images/www.png'}
          alt={`${artist} - ${albumName} album cover`}
          aria-hidden="true"
          width="60"
          height="60"
          class="block rounded-md"
        />
        <div class="min-w-0 flex-1">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium text-black">
            {title}
          </div>
          <div class="overflow-hidden text-ellipsis whitespace-nowrap text-xl text-gray-700">
            {artist}
          </div>
        </div>
        <audio ref={audioPlayer} />
        <div class="flex items-center gap-6 text-black">
          <button
            type="button"
            disabled
            class="opacity-50 focus:outline-none focus:ring-black focus-visible:ring-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="hidden h-10 w-10 sm:block"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
            </svg>
            <span class="sr-only">Previous episode</span>
          </button>

          <button
            type="button"
            class="focus:outline-none focus:ring-black focus-visible:ring-2"
            onClick={() => (isPlaying.value = !isPlaying.value)}
          >
            {isPlaying.value ? PauseIcon : PlayIcon}
            <span class="sr-only">{isPlaying.value ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            disabled
            class="opacity-50 focus:outline-none focus:ring-black focus-visible:ring-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="hidden h-10 w-10 sm:block"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
            </svg>
            <span class="sr-only">Next episode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
