# Product

## Register

brand

## Users

Two distinct audiences, in order of design priority:

- **Listeners / viewers** — people who land on a podcast site built with Starpod,
  usually from a social share, search result, or platform link. Their context is
  casual and often mobile: they want to find an episode, start playing (audio or
  video) within seconds, decide whether to subscribe, and maybe read show notes
  or a transcript. They did not come to read about software; the content is the
  product.
- **Podcasters / operators** — the people who adopt Starpod to run their show's
  website. They clone the template, set `starpod.config.ts` and an RSS feed, and
  expect a polished site in minutes. They are the ones who benefit from clean,
  adaptable defaults; they should be able to drop in their own brand without
  fighting the template or rewriting components.

The job to be done: turn an RSS feed into a fast, beautiful, on-brand podcast
home where discovering and playing an episode is effortless.

## Product Purpose

Starpod is an open-source Astro template that generates a complete podcast
website from an RSS feed and a config file. It exists so any podcaster can have a
professional, fast, accessible site — with an on-site audio/video player, episode
pages, transcripts, search, and platform links — without designing or building it
themselves.

Success looks like: a podcaster ships a site that looks intentionally designed
for *their* show (not "a template"), and a first-time visitor can find and play
an episode within seconds on any device. The reference deployment is
[whiskey.fm](https://whiskey.fm) (Whiskey Web and Whatnot), but Starpod's own
identity is the neutral, adaptable foundation underneath — not that show's voice.

## Brand Personality

**Clean, approachable, adaptable.** Starpod itself is a calm, content-first
foundation that gets out of the way and lets each podcast's own brand come
through. The voice in the reference deployment (irreverent, confident,
whiskey-fueled) belongs to Whiskey Web and Whatnot, *not* to Starpod — the
template must never hard-code that personality so deeply that another show can't
adopt it cleanly.

Emotional goals for a visitor: "this is easy," "this is fast," "I can tell what
this show is and start listening immediately." Emotional goals for an adopter:
"this already looks great, and I can make it mine."

## Anti-references

- **Generic SaaS landing pages.** No cream/sand body backgrounds, no tracked
  uppercase eyebrow above every section, no identical icon-heading-text card
  grids, no hero-metric template. This is a content site, not a pricing page.
- **Locked-in branding.** Don't hard-code one podcast's personality, palette, or
  copy so heavily that the template can't be re-skinned. Brand-specific values
  belong in config and tokens, not baked into component structure.
- **Dated podcast-directory sites.** No tiny artwork, no link-soup of platform
  buttons with no hierarchy, no afterthought players. The player and the artwork
  are first-class.
- **Cluttered / busy layouts.** Keep it calm and content-first. Whitespace and
  clear hierarchy over density and decoration.

## Design Principles

1. **Content first, chrome second.** The episode, its artwork, and the play
   action are the point. Navigation, branding, and metadata support them — they
   never compete with them.
2. **Playable in one tap, on any device.** Starting an episode (audio or video)
   should never require scrolling, hunting, or a page change. Mobile is a
   first-class layout, not a shrink of desktop.
3. **Adaptable, not opinionated.** Every visual decision should survive being
   re-skinned for a different show. Prefer tokens and config over hard-coded
   brand values. A good test: would this still look right for a true-crime show
   and a kids' show?
4. **Fast and quiet.** Static-first, lazy where it helps, motion that's
   purposeful and respects reduced-motion. Speed is part of the brand.
5. **Native and familiar.** Lean on conventions people already know — standard
   media controls, fullscreen, click-to-play — instead of inventing novel
   interactions that need to be learned.

## Accessibility & Inclusion

Target **WCAG 2.2 AA** as the template's baseline, since others ship production
sites on top of it:

- Body text ≥ 4.5:1 contrast; large/bold text ≥ 3:1; placeholders meet 4.5:1.
- Full keyboard operability for the player, search, and navigation; visible
  focus states.
- Media controls have accessible names; the player exposes standard semantics.
- Every animation has a `prefers-reduced-motion: reduce` alternative (the 3D
  artwork tilt, view transitions, and player motion included).
- Semantic structure and landmarks so screen-reader users can navigate episodes
  and show notes.
