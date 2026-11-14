import { useEffect, useRef, useState } from 'preact/hooks';

import PlayGlyph from './PlayGlyph';
import PlayToggle from './PlayToggle';
import {
  activeMedium,
  currentEpisode,
  isBuffering,
  isPlaying,
  playEpisode,
  type PlayableEpisode
} from '../state';
import { formatClock } from '../../utils/playable';
import { readPosition, startEngine, stageOutOfView } from './engine';
import MediumSwitch from './MediumSwitch';

type Props = {
  episode: PlayableEpisode;
  /**
   * `overlay`: the large play control over the stage frame (also keeps the
   * stage's state attributes in sync). `actions`: the play button and
   * Watch/Listen switch beside the title.
   */
  part: 'overlay' | 'actions';
};

export default function StageControls({ episode, part }: Props) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [resumeAt, setResumeAt] = useState(0);

  const isCurrent = currentEpisode.value?.id === episode.id;
  const playing = isCurrent && isPlaying.value;
  const watching = isCurrent && activeMedium.value === 'watch';
  const buffering = playing && isBuffering.value;

  useEffect(() => {
    startEngine();
    setResumeAt(readPosition(episode.id));
  }, [episode.id]);

  // Reflect state on the stage so CSS can stage the light, swap artwork for
  // video, and pin the frame while watching.
  useEffect(() => {
    if (part !== 'overlay') {
      return;
    }
    const stage = anchor.current?.closest<HTMLElement>('[data-stage]');
    if (!stage) {
      return;
    }
    stage.toggleAttribute('data-current', isCurrent);
    stage.toggleAttribute('data-playing', playing);
    stage.toggleAttribute('data-watching', watching);
    stage.toggleAttribute('data-buffering', buffering);
  });

  // Float the video into the dock while the stage is scrolled away.
  useEffect(() => {
    if (part !== 'overlay' || !isCurrent) {
      return;
    }
    const frame = anchor.current?.closest('[data-stage]')?.querySelector('[data-stage-frame]');
    if (!frame || !('IntersectionObserver' in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        stageOutOfView.value = entry.intersectionRatio < 0.3;
      },
      { threshold: [0, 0.3, 0.6] }
    );
    observer.observe(frame);
    return () => {
      observer.disconnect();
      stageOutOfView.value = false;
    };
  }, [isCurrent, part]);

  const label = playing ? 'Pause' : resumeAt > 30 && !isCurrent ? 'Resume' : 'Play';

  if (part === 'overlay') {
    return (
      <span class="stage-overlay" ref={anchor}>
        <PlayToggle
          class="stage-play"
          episode={episode}
          labelFor={(playing) =>
            `${playing ? 'Pause' : resumeAt > 30 && !isCurrent ? 'Resume' : 'Play'} episode ${episode.episodeNumber}: ${episode.title}`
          }
          size={30}
        />
        {!isCurrent && resumeAt > 30 && (
          <span class="stage-resume">Resume at {formatClock(resumeAt)}</span>
        )}
      </span>
    );
  }

  return (
    <div class="stage-actions">
      <button class="button-primary" onClick={() => playEpisode(episode)} type="button">
        <PlayGlyph playing={playing} size={18} />
        <span>
          {label}
          {label === 'Resume' ? ` at ${formatClock(resumeAt)}` : ' episode'}
        </span>
      </button>
      {episode.video && <MediumSwitch />}
    </div>
  );
}
