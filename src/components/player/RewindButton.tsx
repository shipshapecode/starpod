import type { MutableRef } from 'preact/hooks';

type Props = {
  audioPlayer: MutableRef<HTMLAudioElement | null>;
};

function RewindIcon() {
  return (
    <svg
      class="h-6 w-6 stroke-slate-500 group-hover:stroke-slate-700"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m9 10v5"
        stroke="#9da3af"
        stroke-linecap="square"
        stroke-width="1.5"
      />
      <path
        d="m13.75 10h-.5c-.6904 0-1.25.5596-1.25 1.25v2.5c0 .6904.5596 1.25 1.25 1.25h.5c.6904 0 1.25-.5596 1.25-1.25v-2.5c0-.6904-.5596-1.25-1.25-1.25z"
        stroke="#9da3af"
        stroke-width="1.5"
      />
      <path
        clip-rule="evenodd"
        d="m20.75 12c0-4.83249-3.9175-8.75-8.75-8.75-2.2529 0-4.30634.85071-5.85784 2.25h2.35784v1.5h-4.75v-4.75h1.5v2.03624c1.80264-1.57851 4.16484-2.53624 6.75-2.53624 5.6609 0 10.25 4.58908 10.25 10.25 0 5.6609-4.5891 10.25-10.25 10.25-5.66092 0-10.25-4.5891-10.25-10.25 0-1.2606.2279-2.4695.64527-3.58671l1.3942.5544c-.34874.9439-.53947 1.96511-.53947 3.03231 0 4.8325 3.91751 8.75 8.75 8.75 4.8325 0 8.75-3.9175 8.75-8.75z"
        fill="#9da3af"
        fill-rule="evenodd"
      />
    </svg>
  );
}

export default function RewindButton({ audioPlayer }: Props) {
  return (
    <button
      type="button"
      className="group relative rounded-full focus:outline-none"
      onClick={() => {
        if (audioPlayer.current) {
          audioPlayer.current.currentTime -= 10;
        }
      }}
      aria-label="Rewind 10 seconds"
    >
      <div className="absolute -inset-4 -right-2 md:hidden" />
      <RewindIcon />
    </button>
  );
}
