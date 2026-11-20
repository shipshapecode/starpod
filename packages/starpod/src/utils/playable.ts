import type { Episode, Show } from '../lib/rss';
import type { PlayableEpisode } from '../components/state';

/**
 * The serializable slice of an episode that play controls hand to the player.
 * Keep it small: it is inlined into every island's props.
 */
export function toPlayable(episode: Episode, show: Show): PlayableEpisode {
  return {
    audio: episode.audio,
    duration: episode.duration,
    episodeNumber: episode.episodeNumber,
    id: episode.id,
    image: episode.episodeThumbnail ?? show.image,
    slug: episode.episodeSlug,
    title: episode.title,
    video: episode.video
  };
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

export { formatClock } from '../lib/seek-chip.mjs';
