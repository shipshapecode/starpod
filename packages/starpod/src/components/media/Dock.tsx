import { navigate } from 'astro:transitions/client';
import { useEffect, useState } from 'preact/hooks';

import {
  ArrowOutIcon,
  BackIcon,
  CloseIcon,
  ExpandIcon,
  ForwardIcon,
  VolumeIcon
} from '../icons';
import {
  activeMedium,
  closeMini,
  currentEpisode,
  currentTime,
  isMuted,
  mediaDuration,
  mediaHost,
  miniClosed,
  playbackRate,
} from '../state';
import { formatClock } from '../../utils/playable';
import { enterFullscreen, setRate, skip, startEngine } from './engine';
import MediumSwitch from './MediumSwitch';
import PlayToggle from './PlayToggle';
import Scrubber from './Scrubber';

const RATES = [1, 1.25, 1.5, 1.75, 2, 0.75];
const ARRIVAL_MS = 700;

// The dock rises into view once per visit. Navigation re-inserts the
// persisted dock, which would otherwise restart the rise on every page.
let arrived = false;

/**
 * The persistent transport. Lives in the layout's dock beside the
 * `[data-media-dock]` holder (where the mini video sits when it isn't on a
 * stage) and survives client-side navigation.
 */
export default function Dock() {
  useEffect(() => {
    startEngine();
  }, []);

  const [arriving, setArriving] = useState(!arrived);
  const hasEpisode = Boolean(currentEpisode.value);
  useEffect(() => {
    if (!hasEpisode || !arriving) {
      return;
    }
    arrived = true;
    const timer = window.setTimeout(() => setArriving(false), ARRIVAL_MS);
    return () => window.clearTimeout(timer);
  }, [hasEpisode, arriving]);

  // The floating mini video opens its episode, where it returns to the stage.
  const target = currentEpisode.value
    ? `/${currentEpisode.value.slug ?? currentEpisode.value.episodeNumber}`
    : null;
  useEffect(() => {
    const mini = document.querySelector<HTMLElement>('[data-media-dock]');
    if (!mini || !target) {
      return;
    }
    const open = () => void navigate(target);
    mini.addEventListener('click', open);
    mini.title = 'Open episode';
    return () => mini.removeEventListener('click', open);
  }, [target]);

  const episode = currentEpisode.value;
  if (!episode) {
    return null;
  }

  const duration = mediaDuration.value || episode.duration || 0;
  const time = currentTime.value;
  const href = `/${episode.slug ?? episode.episodeNumber}`;
  const showArt =
    mediaHost.value === 'stage' || activeMedium.value === 'listen' || miniClosed.value;

  const floating =
    mediaHost.value === 'dock' &&
    activeMedium.value === 'watch' &&
    Boolean(episode.video) &&
    !miniClosed.value;

  return (
    <>
    {floating && (
      <div class="mini-chrome">
        <span class="mini-title">{episode.title}</span>
        <button
          aria-label="Fullscreen"
          class="mini-button"
          data-shortcut="fullscreen"
          onClick={(event) => {
            // The mini video itself opens the episode; this button must not.
            event.stopPropagation();
            enterFullscreen();
          }}
          title="Fullscreen (F)"
          type="button"
        >
          <ExpandIcon size={15} />
        </button>
        <button
          aria-label="Close video"
          class="mini-button"
          onClick={(event) => {
            event.stopPropagation();
            closeMini();
          }}
          title="Close video"
          type="button"
        >
          <CloseIcon size={15} />
        </button>
      </div>
    )}
    <div
      class="dock-controls"
      data-arriving={arriving ? '' : undefined}
      role="region"
      aria-label="Player"
    >
      {showArt && episode.image && (
        <a class="dock-art" href={href} tabIndex={-1} aria-hidden="true">
          <img alt="" height={56} src={episode.image} width={56} />
        </a>
      )}

      <div class="dock-title">
        <a class="dock-title-link" href={href} title={episode.title}>
          {episode.title}
        </a>
        <span class="dock-sub">
          {episode.episodeNumber !== 'Bonus' ? `Episode ${episode.episodeNumber}` : 'Bonus'}
          {' · '}
          {activeMedium.value === 'watch' ? 'Watching' : 'Listening'}
        </span>
      </div>

      <div class="dock-transport">
        <button
          aria-keyshortcuts="J"
          aria-label="Back 15 seconds"
          class="icon-button"
          data-shortcut="back"
          onClick={() => skip(-15)}
          title="Back 15 seconds (J)"
          type="button"
        >
          <BackIcon size={22} />
        </button>
        <PlayToggle class="dock-play" shortcut size={20} />
        <button
          aria-keyshortcuts="L"
          aria-label="Forward 30 seconds"
          class="icon-button"
          data-shortcut="forward"
          onClick={() => skip(30)}
          title="Forward 30 seconds (L)"
          type="button"
        >
          <ForwardIcon size={22} />
        </button>
      </div>

      <div class="dock-scrub">
        <span class="dock-time">{formatClock(time)}</span>
        <Scrubber duration={duration} episode={episode} time={time} />
        <span class="dock-time">-{formatClock(Math.max(0, duration - time))}</span>
      </div>

      <div class="dock-tools">
        {episode.video && <MediumSwitch compact shortcut />}
        <button
          aria-label={`Playback speed ${playbackRate.value}×, change`}
          class="text-button"
          onClick={() => {
            const next = RATES[(RATES.indexOf(playbackRate.value) + 1) % RATES.length];
            setRate(next);
          }}
          type="button"
        >
          {playbackRate.value}×
        </button>
        <button
          aria-keyshortcuts="M"
          aria-label={isMuted.value ? 'Unmute' : 'Mute'}
          aria-pressed={isMuted.value}
          class="icon-button dock-mute"
          data-shortcut="mute"
          onClick={() => (isMuted.value = !isMuted.value)}
          title={`${isMuted.value ? 'Unmute' : 'Mute'} (M)`}
          type="button"
        >
          <VolumeIcon muted={isMuted.value} size={20} />
        </button>
        <a aria-label="Open episode" class="icon-button dock-open" href={href} title="Open episode">
          <ArrowOutIcon size={18} />
        </a>
      </div>
    </div>
    </>
  );
}
