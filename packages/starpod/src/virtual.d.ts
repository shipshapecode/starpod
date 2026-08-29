declare module 'virtual:starpod/config' {
  const config: import('./utils/config').StarpodConfig;
  export default config;
  /** Whether the guests/sponsors database was enabled via integration options. */
  export const database: boolean;
}

declare module 'virtual:starpod/user-css' {
  const noop: Record<string, never>;
  export default noop;
}

declare module 'virtual:starpod/components/*' {
  const Component: (props: Record<string, unknown>) => unknown;
  export default Component;
}
