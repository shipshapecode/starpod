---
version: 2
slug: "src-layouts-layout-astro"
primary_target: "src/layouts/Layout.astro"
related_targets: ["src/pages/index.astro","src/pages/[episode].astro","src/pages/about.astro","src/pages/contact.astro","src/components/NotFoundContent.astro"]
---

# Surface brief: Starpod app shell (layout, home, episode, pages)

Scope: the package Layout and every route it frames (home episode list,
episode stage, about, contact, 404, custom pages). Mode: Experience on the
episode stage (the video, or artwork plus audio, leads from the first
viewport); Operate on the list and standalone pages.

Audience/job: listeners and viewers of any Starpod show; start the episode in
their chosen medium, subscribe, browse, read transcripts and show notes.
Podcasters configure nothing for any of it beyond `starpod.config.ts`.

Constraints (user-pinned): Iris (violet, light) / Aqua (cyan, dark) palette in
OKLCH only; the gradient ring on outlined controls, gradient fill on solid
ones, gradient icon on bare icons, always transitioned; app-scale single-show
media experience; fixed navigation never hides CTAs; video-first, automatic
from the feed's alternateEnclosure, artwork fallback for audio-only; video
docks to a mini player across navigation; works on phone, desktop, and
foldables, with a little delight just for foldables; keep every route and
piece of metadata the site had (sitemap, llms.txt, .html.md twins, OpenAPI,
schema, og:audio); Tailwind for styling, custom CSS only where Tailwind
cannot express it; nothing show-specific in the package.

## Decision

Two directions were built for comparison as switchable worlds: Daylight
Section (a building in section, poche walls, a light band) and Stage Page
(the conversation typeset). The user chose **Stage**. Daylight was removed
entirely (toggle, `?world=`, config, marks, rooms, shaft, limewash); `<html
data-world="stage">` is now hardcoded. DESIGN.md records the shipped system.

## Direction contract — Stage Page (shipped)

THESIS: A podcast is people talking, so the app typesets the conversation:
each voice its own face, the line being spoken swelling as it is heard.
Refuses the transcript-as-grey-paragraph and the static show-notes page.

OWN-WORLD: One face per voice (condensed variable Archivo for voice 0 in Iris,
Young Serif for voice 1 in Aqua, Familjen Grotesk for captions without
speakers); size carries volume and lines recede as they pass; condensed
uppercase Archivo for every title; calm Familjen UI; full-colour show art and
cast photos; light sampled from the playing video.

STORY: The home page is the episode list. Clicking a row morphs its art and
title into the episode stage, where the conversation is already set beside
the video. Pressing play makes the script perform in sync; clicking any line
or timestamp seeks; the dock carries playback across pages; the rail (or top
bar, tab bar, and More sheet) keeps follow and navigation visible.

FIRST VIEWPORT (episode): Desktop: rail left with the show name set large;
stage column (video or artwork, title, facts, cast, sponsors, Watch/Listen,
Play) beside a sticky script column with the live line at ~3.5rem and prior
lines shrinking upward; dock bottom. Phones: picture, then script, then meta.
Primary action: play on the stage.

STANDALONE PAGES: `PageHeader` (condensed uppercase title plus lede) aligned
to the breadcrumbs. About: Listen on (labelled platform pills), Meet the hosts
(two columns, large portraits, bio, links). Contact: labelled fields, accent
focus, sending/sent/error states. 404: illustration, heading, helpful links,
Go back.

SIGNATURES: the live script (FLIP between lines); stage light sampled into a
32×18 canvas; scrubber transcript preview; list-to-stage morph; curtain page
transitions; on-air bars on the current row; keyboard shortcuts (K, J, L, M,
W, F). Foldable: two voices argue across the hinge; the stage unfolds once.
