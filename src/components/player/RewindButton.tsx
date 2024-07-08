import type { MutableRef } from 'preact/hooks';

type Props = {
  audioPlayer: MutableRef<HTMLAudioElement | null>;
};

function RewindIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="group-hover:stroke-[url(#paint0_linear_201_22852)] dark:group-hover:stroke-[url(#paint0_linear_201_20128)]"
        d="M9 10L9 15"
        stroke="#9da3af"
        stroke-width="1.5"
        stroke-linecap="square"
      />
      <path
        class="group-hover:stroke-[url(#paint1_linear_201_22852)] dark:group-hover:stroke-[url(#paint1_linear_201_20128)]"
        d="M13.75 10H13.25C12.5596 10 12 10.5596 12 11.25V13.75C12 14.4404 12.5596 15 13.25 15H13.75C14.4404 15 15 14.4404 15 13.75V11.25C15 10.5596 14.4404 10 13.75 10Z"
        stroke="#9da3af"
        stroke-width="1.5"
      />
      <path
        class="group-hover:fill-[url(#paint2_linear_201_22852)] dark:group-hover:fill-[url(#paint2_linear_201_20128)]"
        fill="#9da3af"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.75 12C20.75 7.16751 16.8325 3.25 12 3.25C9.7471 3.25 7.69366 4.10071 6.14216 5.5H8.5V7H3.75V2.25H5.25V4.28624C7.05264 2.70773 9.41484 1.75 12 1.75C17.6609 1.75 22.25 6.33908 22.25 12C22.25 17.6609 17.6609 22.25 12 22.25C6.33908 22.25 1.75 17.6609 1.75 12C1.75 10.7394 1.9779 9.5305 2.39527 8.41329L3.78947 8.96769C3.44073 9.91159 3.25 10.9328 3.25 12C3.25 16.8325 7.16751 20.75 12 20.75C16.8325 20.75 20.75 16.8325 20.75 12Z"
      />
      <defs>
        {/* Light */}
        <linearGradient
          id="paint0_linear_201_22852"
          x1="9.5"
          y1="10"
          x2="9.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#BBA4FF" />
          <stop offset="1" stop-color="#9D7BFF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_201_22852"
          x1="13.5"
          y1="10"
          x2="13.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#BBA4FF" />
          <stop offset="1" stop-color="#9D7BFF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_201_22852"
          x1="12"
          y1="1.75"
          x2="12"
          y2="22.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C0ABFF" />
          <stop offset="1" stop-color="#9571FF" />
        </linearGradient>

        {/* Dark */}
        <linearGradient
          id="paint0_linear_201_20128"
          x1="9.5"
          y1="10"
          x2="9.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#A3E8FE" />
          <stop offset="1" stop-color="#4ECDF6" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_201_20128"
          x1="13.5"
          y1="10"
          x2="13.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#A3E8FE" />
          <stop offset="1" stop-color="#4ECDF6" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_201_20128"
          x1="12"
          y1="1.75"
          x2="12"
          y2="22.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#9DE6FE" />
          <stop offset="1" stop-color="#4ACBF5" />
        </linearGradient>
      </defs>
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
