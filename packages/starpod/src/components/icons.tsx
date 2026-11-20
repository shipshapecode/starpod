/**
 * Starpod's icon set: one 24px grid, 1.75 stroke, round caps. Rendered
 * statically from Astro and live inside islands. Decorative by default; give
 * the surrounding control its accessible name.
 */
import type { JSX } from 'preact';

export type IconProps = { class?: string; size?: number };

/**
 * Each icon carries its own vertical gradient whose stops read `--icon-a` and
 * `--icon-b` from the control around it. Controls that opt in (tokens.css)
 * paint the icon with it, so hovering fades the icon from its resting colour
 * into the Iris/Aqua gradient. The id is per instance because a `url(#id)`
 * paint resolves to the first match in the document.
 */
export function Svg({
  children,
  class: className,
  size = 20
}: IconProps & { children: JSX.Element | Array<JSX.Element> }) {
  const id = `sp-icon-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <svg
      aria-hidden="true"
      class={className}
      fill="none"
      height={size}
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.75"
      style={`--icon-paint: url(#${id})`}
      viewBox="0 0 24 24"
      width={size}
    >
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={id} x1="0" x2="0" y1="0" y2="24">
          <stop class="icon-stop-a" offset="0" />
          <stop class="icon-stop-b" offset="1" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
}

export const PlayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.6-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7Z" fill="currentColor" stroke="none" />
  </Svg>
);

export const PauseIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect fill="currentColor" height="15" rx="1.2" stroke="none" width="4.6" x="5.6" y="4.5" />
    <rect fill="currentColor" height="15" rx="1.2" stroke="none" width="4.6" x="13.8" y="4.5" />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.2 3.8v3.4h3.4" />
    <text fill="currentColor" font-family="inherit" font-size="7" font-weight="700" stroke="none" text-anchor="middle" x="12" y="14.6">15</text>
  </Svg>
);

export const ForwardIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M19.8 3.8v3.4h-3.4" />
    <text fill="currentColor" font-family="inherit" font-size="7" font-weight="700" stroke="none" text-anchor="middle" x="12" y="14.6">30</text>
  </Svg>
);

export const ListIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6.5h11M9 12h11M9 17.5h11" />
    <circle cx="4.5" cy="6.5" fill="currentColor" r="1" stroke="none" />
    <circle cx="4.5" cy="12" fill="currentColor" r="1" stroke="none" />
    <circle cx="4.5" cy="17.5" fill="currentColor" r="1" stroke="none" />
  </Svg>
);

/** The sidebar toggle: a panel whose chevron turns with the rail's state. */
export const RailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="15" rx="2.5" width="17" x="3.5" y="4.5" />
    <path d="M9.5 4.5v15" />
    <path class="rail-chevron" d="m15.5 10-2 2 2 2" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="m15.6 15.6 4.4 4.4" />
  </Svg>
);

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.2" />
    <circle cx="12" cy="7.9" fill="currentColor" r="1" stroke="none" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="14" rx="2.2" width="18" x="3" y="5" />
    <path d="m3.8 6.6 8.2 6 8.2-6" />
  </Svg>
);

export const ArrowOutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 16 16.5 7.5M9.5 7.5h7v7" />
  </Svg>
);

export const BagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 8h13l-1 11.2a1.5 1.5 0 0 1-1.5 1.3H8a1.5 1.5 0 0 1-1.5-1.3Z" />
    <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
  </Svg>
);

export const MegaphoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10v4a1 1 0 0 0 1 1h2.5l7.5 4.5v-15L7.5 9H5a1 1 0 0 0-1 1Z" />
    <path d="M18.5 9.2a4 4 0 0 1 0 5.6" />
    <path d="M7.5 15 9 20" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10Z" />
  </Svg>
);

export const LinkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Svg>
);

export const VideoIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="11" rx="2" width="13" x="2.5" y="6.5" />
    <path d="m15.5 10.6 5-2.8v8.4l-5-2.8" />
  </Svg>
);

export const HeadphonesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 14.5V12a8 8 0 0 1 16 0v2.5" />
    <rect height="6.5" rx="1.6" width="4" x="3.5" y="13.5" />
    <rect height="6.5" rx="1.6" width="4" x="16.5" y="13.5" />
  </Svg>
);

export const ExpandIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4.5h5.5V10M10 19.5H4.5V14M19.5 4.5 13.5 10.5M4.5 19.5l6-6" />
  </Svg>
);

export const ChevronUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 14.5 6-6 6 6" />
  </Svg>
);

/** A screen with the small picture in `corner` (where it is, or is going). */
export const PipIcon = (p: IconProps & { corner?: 'se' | 'sw' | 'nw' | 'ne' }) => (
  <Svg {...p}>
    <rect height="14" rx="2.2" width="19" x="2.5" y="5" />
    <rect
      fill="currentColor"
      height="5"
      rx="1"
      stroke="none"
      width="7"
      x={p.corner === 'sw' || p.corner === 'nw' ? 5 : 12}
      y={p.corner === 'nw' || p.corner === 'ne' ? 7.5 : 11.5}
    />
  </Svg>
);

export const QueueIcon = (p: IconProps & { queued?: boolean }) => (
  <Svg {...p}>
    <path d="M4 6.5h11M4 12h11M4 17.5h6" />
    {p.queued ? <path d="m14 17.4 2.4 2.4 4.6-4.6" /> : <path d="M18 14v7M14.5 17.5h7" />}
  </Svg>
);

export const NextIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 5.6v12.8a.7.7 0 0 0 1.1.6l9-6.4a.7.7 0 0 0 0-1.2l-9-6.4a.7.7 0 0 0-1.1.6Z" fill="currentColor" stroke="none" />
    <path d="M19 5.5v13" />
  </Svg>
);

export const GripIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="6.5" fill="currentColor" r="1.4" stroke="none" />
    <circle cx="15" cy="6.5" fill="currentColor" r="1.4" stroke="none" />
    <circle cx="9" cy="12" fill="currentColor" r="1.4" stroke="none" />
    <circle cx="15" cy="12" fill="currentColor" r="1.4" stroke="none" />
    <circle cx="9" cy="17.5" fill="currentColor" r="1.4" stroke="none" />
    <circle cx="15" cy="17.5" fill="currentColor" r="1.4" stroke="none" />
  </Svg>
);

export const MoreIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="5.5" cy="12" fill="currentColor" r="1.4" stroke="none" />
    <circle cx="12" cy="12" fill="currentColor" r="1.4" stroke="none" />
    <circle cx="18.5" cy="12" fill="currentColor" r="1.4" stroke="none" />
  </Svg>
);

export const FollowIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" />
    <circle cx="6" cy="18" fill="currentColor" r="1.6" stroke="none" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const VolumeIcon = (p: IconProps & { muted?: boolean }) => (
  <Svg {...p}>
    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
    {p.muted ? (
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    ) : (
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
    )}
  </Svg>
);

export const GithubIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 21v-3.5a3.4 3.4 0 0 0-1-2.6c3.1-.3 6-1.5 6-6.6a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 0 0-6.8 0C5.3 .7 4.1 1.1 4.1 1.1A4.8 4.8 0 0 0 4 4.7a5.2 5.2 0 0 0-1.4 3.6c0 5.1 2.9 6.3 6 6.6a3.4 3.4 0 0 0-1 2.6V21" />
    <path d="M9 18c-3.5 1.1-3.5-2-5-2.4" />
  </Svg>
);

export const XIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4 4 6.6 8.8L4 20m16-16-6.1 6.9L20 20h-4.4L4 4h4.4l2.2 2.9" />
  </Svg>
);
