/**
 * Primary site navigation links, surfaced in the desktop rail and the mobile
 * slide-over menu.
 *
 * NOTE: These are intentionally hard-coded for now. When nav becomes
 * config-driven (see `.impeccable/briefs/reshape-sticky-rail.md`, open
 * question #2), move this array into `starpod.config.ts` and resolve it through
 * `defineStarpodConfig`. Centralizing it here keeps that migration trivial.
 */
export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: Array<NavLink> = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Store', href: 'https://whiskey.fund/' },
  { label: 'Become a sponsor', href: '/sponsor' }
];
