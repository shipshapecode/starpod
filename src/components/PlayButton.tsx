import { currentEpisode, isPlaying } from './state';
import type { Episode } from '@lib/rss';

type Props = {
  episodes: Array<Episode>;
};

export default function PlayButton({ episodes }: Props) {
  return (
    <button
      type="button"
      class="mr-4 inline-flex items-center rounded-lg px-10 py-3 text-center text-lg font-medium bg-gray-100 text-pink-700 hover:bg-gray-200 focus:outline-none focus:ring-black focus-visible:ring-2 dark:focus:ring-black"
      onClick={() => {
        currentEpisode.value = {
          ...episodes[0]
        };

        isPlaying.value = true;
      }}
    >
      <svg
        class="-ml-1 mr-2 h-6 w-6 text-pink-700"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clip-rule="evenodd"
        />
      </svg>
      Play
    </button>
  );
}
