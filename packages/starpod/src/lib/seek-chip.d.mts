export declare const SEEK_CHIP_CLASS: string;
export declare function formatClock(seconds: number): string;
export declare function chipLabel(seconds: number): string;
export declare function seekChipAttributes(seconds: number): {
  type: 'button';
  class: string;
  'data-seek': string;
  'aria-label': string;
  label: string;
};
