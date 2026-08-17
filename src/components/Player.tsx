import { useEffect, useState, useRef } from 'preact/hooks';
import type Hls from 'hls.js';

import {
  currentEpisode,
  isMuted,
  isPlaying,
  isTheaterOpen,
  mediaMode,
  seekTo
} from '../components/state';
import MuteButton from './player/MuteButton';
import PlayButton from './player/PlayButton';
import PlaybackRateButton from './player/PlaybackRateButton';
import ForwardButton from './player/ForwardButton';
import RewindButton from './player/RewindButton';
import Slider from './player/Slider';

export default function Player() {
  // A single <video> element backs both audio and video episodes (a <video>
  // plays audio-only sources fine), which keeps the cross-page-transition
  // persistence identical to the audio-only player.
  const mediaPlayer = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const prevEpisodeIdRef = useRef<string | null>(null);
  const progressRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  if (currentEpisode.value === null) {
    return;
  }

  const { audio, video, episodeImage, episodeNumber, id, title } =
    currentEpisode.value;
  const hasVideo = !!video;
  const useVideo = hasVideo && mediaMode.value === 'video';
  const theaterOpen = useVideo && isTheaterOpen.value;
  const activeSrc = useVideo ? video!.src : audio.src;

  function whilePlaying() {
    if (mediaPlayer.current?.duration) {
      const time = mediaPlayer.current.currentTime;
      const percentage = (time / mediaPlayer.current.duration) * 100;
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

  // Load the active source whenever the episode or the audio/video mode
  // changes. Episode changes restart from 0; toggling audio<->video on the same
  // episode preserves the current position.
  useEffect(() => {
    const el = mediaPlayer.current;
    if (!el) {
      return;
    }

    const sameEpisode = prevEpisodeIdRef.current === id;
    const resumeAt = sameEpisode ? el.currentTime : 0;
    prevEpisodeIdRef.current = id;

    let cancelled = false;

    const restore = () => {
      if (cancelled) {
        return;
      }
      if (resumeAt > 0) {
        try {
          el.currentTime = resumeAt;
        } catch {
          // seek requested before the stream is seekable; ignore
        }
      }
      if (isPlaying.value) {
        void el.play();
      }
    };

    // Tear down any previous hls.js instance before loading a new source.
    hlsRef.current?.destroy();
    hlsRef.current = null;

    const canPlayNativeHls =
      el.canPlayType('application/vnd.apple.mpegurl') !== '';

    if (useVideo && video && !canPlayNativeHls) {
      // Chrome/Firefox can't play HLS natively — lazy-load hls.js only here.
      import('hls.js').then(({ default: HlsLib }) => {
        if (cancelled || mediaPlayer.current !== el) {
          return;
        }
        if (HlsLib.isSupported()) {
          const hls = new HlsLib();
          hls.loadSource(video.src);
          hls.attachMedia(el);
          hls.on(HlsLib.Events.MANIFEST_PARSED, restore);
          hlsRef.current = hls;
        } else {
          el.src = video.src;
          el.addEventListener('loadedmetadata', restore, { once: true });
        }
      });
    } else {
      // Audio mode, audio-only episodes, or Safari (native HLS).
      el.src = activeSrc;
      el.addEventListener('loadedmetadata', restore, { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, [activeSrc]);

  // Destroy any hls.js instance when the player unmounts.
  useEffect(() => () => hlsRef.current?.destroy(), []);

  // Keep the shared signals in sync when the user drives playback through the
  // native HTML5 video controls (theater), so the custom transport in the bar
  // doesn't desync from the element.
  useEffect(() => {
    const el = mediaPlayer.current;
    if (!el) {
      return;
    }
    const onPlay = () => {
      isPlaying.value = true;
    };
    const onPause = () => {
      isPlaying.value = false;
    };
    const onTimeUpdate = () => setCurrentTime(el.currentTime);

    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (isPlaying.value) {
      mediaPlayer.current?.play();
      progressRef.current = requestAnimationFrame(whilePlaying);
    } else {
      mediaPlayer.current?.pause();
      cancelAnimationFrame(progressRef.current as number);
    }
  }, [isPlaying.value]);

  useEffect(() => {
    const target = seekTo.value;
    const player = mediaPlayer.current;
    if (target === null || !player) {
      return;
    }

    const applySeek = async () => {
      const previousIsPlaying = isPlaying.value;
      const previousSeekTo = seekTo.value;
      player.currentTime = target;
      try {
        await player.play();
        isPlaying.value = true;
        seekTo.value = null;
      } catch {
        // Playback was blocked (e.g. autoplay policy) — keep the UI honest by
        // restoring the pre-seek state instead of showing a false "playing".
        isPlaying.value = previousIsPlaying;
        seekTo.value = previousSeekTo;
      }
    };

    // If the episode was just switched, its metadata isn't loaded yet and the
    // seek wouldn't stick — wait for it. Otherwise seek immediately.
    if (player.readyState >= 1 /* HAVE_METADATA */) {
      applySeek();
    } else {
      player.addEventListener('loadedmetadata', applySeek, { once: true });
      return () => player.removeEventListener('loadedmetadata', applySeek);
    }
  }, [seekTo.value]);

  useEffect(() => {
    const duration = mediaPlayer.current?.duration ?? 0;
    if (duration > 0 && currentTime >= duration - 0.01) {
      isPlaying.value = false;
      setCurrentTime(0);
    }
  }, [currentTime]);

  return (
    <div class="player fixed inset-x-0 bottom-0 z-50 flex flex-col lg:left-112 xl:left-120">
      {/*
        The <video> stays mounted at all times so playback and position survive
        toggling to audio-only or minimizing the theater; the theater container
        is simply hidden (display:none) when closed — the element keeps playing
        audio either way.
      */}
      <div class={`flex justify-center px-4 md:px-6 ${theaterOpen ? '' : 'hidden'}`}>
        <div class="relative w-full max-w-3xl overflow-hidden rounded-t-lg bg-black shadow-lg">
          <video
            ref={mediaPlayer}
            muted={isMuted.value}
            playsInline
            controls={theaterOpen}
            poster={episodeImage}
            class="aspect-video w-full bg-black object-contain"
          />
          <button
            type="button"
            onClick={() => (isTheaterOpen.value = false)}
            class="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-xs font-bold text-white"
            aria-label="Minimize video"
          >
            Minimize
          </button>
        </div>
      </div>

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
              <RewindButton audioPlayer={mediaPlayer} />
              <div class="md:hidden">
                <PlayButton />
              </div>
              <ForwardButton audioPlayer={mediaPlayer} />
            </div>
            <Slider audioPlayer={mediaPlayer} currentTime={currentTime} />
            <div class="flex items-center gap-4">
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => {
                    const toVideo = !useVideo;
                    mediaMode.value = toVideo ? 'video' : 'audio';
                    isTheaterOpen.value = toVideo;
                  }}
                  class="rounded-full border border-current px-2 py-[2px] text-[10px] font-bold uppercase"
                  aria-label={
                    useVideo ? 'Switch to audio only' : 'Switch to video'
                  }
                >
                  {useVideo ? 'Audio' : 'Video'}
                </button>
              )}
              {hasVideo && useVideo && !isTheaterOpen.value && (
                <button
                  type="button"
                  onClick={() => (isTheaterOpen.value = true)}
                  class="rounded-full border border-current px-2 py-[2px] text-[10px] font-bold uppercase"
                  aria-label="Expand video"
                >
                  Watch
                </button>
              )}
              <div class="flex items-center">
                <PlaybackRateButton audioPlayer={mediaPlayer} />
              </div>
              <div class="hidden items-center md:flex">
                <MuteButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
