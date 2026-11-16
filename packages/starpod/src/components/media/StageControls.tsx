import { useLayoutEffect, useRef, useState } from 'preact/hooks';

import { QueueIcon } from '../icons';
import PlayGlyph from './PlayGlyph';
import PlayToggle from './PlayToggle';
import {
  activeMedium,
  currentEpisode,
  dequeue,
  enqueue,
  isBuffering,
  isPlaying,
  playEpisode,
  queue,
  type PlayableEpisode
} from '../state';
import { formatClock } from '../../utils/playable';
import { startEngine, watchStage } from './engine';
import { readPosition } from './position';
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

  useLayoutEffect(() => {
    startEngine();
    setResumeAt(readPosition(episode.id));
  }, [episode.id]);

  // Reflect state on the stage so CSS can stage the light, swap artwork for
  // video, and pin the frame while watching.
  useLayoutEffect(() => {
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

  // The picture leaves for its picture-in-picture place while the stage is
  // scrolled away, and comes back with it.
  useLayoutEffect(() => {
    const room = anchor.current?.closest('[data-stage]')?.querySelector<HTMLElement>('.stage-room');
    return part === 'overlay' && isCurrent && room ? watchStage(room) : undefined;
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

  const queued = queue.value.some((item) => item.id === episode.id);

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
      {!isCurrent && (
        <button
          aria-pressed={queued}
          class="button-secondary"
          onClick={() => (queued ? dequeue(episode.id) : enqueue(episode))}
          title={queued ? 'Remove from Up next' : 'Play after the current episode'}
          type="button"
        >
          <QueueIcon queued={queued} size={18} />
          <span>Up next</span>
        </button>
      )}
    </div>
  );
}
