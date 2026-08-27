import type { StarpodConfig } from '../utils/config';

export type ResolvedCta = {
  label: string;
  href: string;
};

/**
 * Resolve the single, rationed call-to-action shown in the rail and mobile
 * app-bar. Podcasters configure it via the optional `cta` field in
 * `starpod.config.ts`; when unset it falls back to the most useful "Subscribe"
 * target available (a primary platform link, else the RSS feed) so an adopter
 * who sets nothing still ships a sensible CTA.
 */
export function resolveCta(config: StarpodConfig): ResolvedCta {
  const { cta, platforms, rssFeed } = config;

  const fallbackHref =
    platforms.spotify ??
    platforms.apple ??
    platforms.youtube ??
    platforms.overcast ??
    platforms.pocketCasts ??
    rssFeed;

  return {
    label: cta?.label ?? 'Subscribe',
    href: cta?.href ?? fallbackHref
  };
}
