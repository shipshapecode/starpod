# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, served by one package:

- **Listeners and viewers** of a show built on Starpod. They arrive from a
  shared episode link, a search result, or the show's own promotion, and want
  to start the episode immediately (watch or listen), then subscribe on their
  platform of choice, browse other episodes, read a transcript, or contact the
  show.
- **Podcasters** (the package's consumers) who install `starpod`, point it at
  an RSS feed, fill in `starpod.config.ts`, and get a finished site. Their job
  is "have a great-looking show site without designing or maintaining one."

## Product Purpose

Starpod generates a complete podcast website from an RSS feed and a small
config file, as an Astro integration. Success: a podcaster ships a site that
feels hand-crafted rather than templated, with zero design work, and visitors
reach play, subscribe, and other CTAs without hunting.

## Positioning

The whole site comes from the feed: episodes, artwork, transcripts
(`<podcast:transcript>`), video (`<podcast:alternateEnclosure>`, HLS or
another video type) and the people on each episode (`<podcast:person>`) all
flow from RSS at build time. Updating the site is a dependency
update. It is free and open source.

## Operating Context

- The site is built statically by Astro and deployed (reference: Vercel).
- Content comes from RSS at build time. Hosts and guests come from a
  Turso/Drizzle database (`database` option) where it lists an episode, else
  from the feed's `<podcast:person>` tags; sponsors come only from the
  database.
- Consumers customize with `customCss`, Starlight-style component overrides
  (`virtual:starpod/components/*`), config `links`, and custom pages composed
  from the package `Layout`.
- The player persists across client-side navigations (Astro `ClientRouter`,
  `transition:persist`).

## Capabilities and Constraints

- **Video-first, automatically:** when an episode's feed item has a video
  `alternateEnclosure` (HLS or another video type), that episode leads with video and the visitor can
  switch to audio at will. Episodes without video lead with artwork plus audio.
  Podcasters configure nothing for this.
- **Playback persists across pages:** video docks to a mini video player when
  the visitor navigates away, with controls to expand or switch to audio.
- Must keep: RSS-driven episodes and show info, search, transcripts with
  clickable timestamps (RSS and markdown), the persistent player, platform
  subscribe links, hosts, creators and guests, sponsors, the contact form,
  `.html.md` / `llms.txt` / OpenAPI agent endpoints, markdown content
  negotiation, standard.site and ATProto tags, and the override and customCss
  hooks.
- Must stay generic: no show-specific copy or imagery in the package. Any show
  should look intentional from its artwork and config alone.
- All colors are authored in OKLCH.

## Brand Commitments

- The visual world is Stage, chosen in the 2026-11 redesign and recorded in
  DESIGN.md. It replaced the old layout and type, kept the Iris/Aqua accents,
  and kept every piece of content and every feature.
- The reference deployment is whiskey.fm (Whiskey Web and Whatnot). It
  demonstrates the package and does not define it.

## Evidence on Hand

- The live reference feed (Flightcast) had 261 episodes in November 2026. 71
  of them carried HLS video streams, and nearly all carried JSON
  transcripts.
- Show artwork, episode artwork, host photos (`src/img/people/`), and sponsor
  logos live in the reference site.
- No testimonials, usage numbers, or press exist. Do not invent them.

## Product Principles

1. The episode is the hero: play, in the visitor's chosen medium, is never more
   than one glance away.
2. Every CTA is visible without digging: subscribe, links, and contact are not
   buried at the bottom of a scrolling sidebar.
3. Zero-config delight: craft and motion come for free from the feed and are
   never a setup step for the podcaster.
4. The visitor decides between watching and listening, and the site remembers
   that choice.
5. Generic by construction: every surface must look deliberate for any show's
   artwork and palette.

## Accessibility & Inclusion

Motion respects `prefers-reduced-motion`. Player controls are keyboard and
screen-reader operable. Light and dark color schemes are both first-class.
