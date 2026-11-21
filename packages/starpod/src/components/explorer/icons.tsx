/** The explorer's own icons, drawn on the shared 24px grid (see ../icons). */
import { Svg, type IconProps } from '../icons';

export const GridIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect height="6.5" rx="1.4" width="6.5" x="4" y="4" />
    <rect height="6.5" rx="1.4" width="6.5" x="13.5" y="4" />
    <rect height="6.5" rx="1.4" width="6.5" x="4" y="13.5" />
    <rect height="6.5" rx="1.4" width="6.5" x="13.5" y="13.5" />
  </Svg>
);

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m7 10 5 5 5-5" />
  </Svg>
);

export const SortIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 5v14M4.5 8.5 8 5l3.5 3.5M16 19V5M12.5 15.5 16 19l3.5-3.5" />
  </Svg>
);

export const ResumeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" />
    <path d="M10.2 9v6l4.8-3Z" fill="currentColor" />
  </Svg>
);

export const UpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Svg>
);
