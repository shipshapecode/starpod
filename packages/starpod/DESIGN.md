---
name: Starpod
description: A video-first podcast app generated from one RSS feed, typeset as a conversation.
colors:
  iris-100: "oklch(95% 0.022 293)"
  iris-200: "oklch(86.9% 0.07 293.5)"
  iris-300: "oklch(77.32% 0.129 294.81)"
  iris-500: "oklch(59.6% 0.22 292)"
  iris-700: "oklch(45.5% 0.2 291)"
  aqua-100: "oklch(95.5% 0.03 215)"
  aqua-200: "oklch(91% 0.06 215)"
  aqua-400: "oklch(77.5% 0.13 222)"
  aqua-700: "oklch(48% 0.105 226)"
  ground-day: "oklch(97.65% 0.005 274.97)"
  surface-day: "oklch(99.6% 0.002 280)"
  raised-day: "oklch(95.2% 0.01 280)"
  line-day: "oklch(90.5% 0.014 280)"
  line-strong-day: "oklch(83% 0.02 280)"
  ink-day: "oklch(24% 0.05 292)"
  text-day: "oklch(37% 0.034 288)"
  muted-day: "oklch(49% 0.026 286)"
  on-ink-day: "oklch(98.5% 0.006 290)"
  accent-soft-night: "oklch(26% 0.05 225)"
  ground-night: "oklch(13.85% 0.025 273.24)"
  surface-night: "oklch(17.4% 0.025 277)"
  raised-night: "oklch(21.57% 0.029 280.68)"
  line-night: "oklch(25.5% 0.035 272)"
  line-strong-night: "oklch(33% 0.045 274)"
  ink-night: "oklch(97.65% 0.005 274.97)"
  text-night: "oklch(83% 0.016 266)"
  muted-night: "oklch(71% 0.02 264)"
  on-ink-night: "oklch(16% 0.03 270)"
  media-ground-day: "oklch(19% 0.03 280)"
  media-ground-night: "oklch(9% 0.02 273)"
  on-media-chip: "oklch(98% 0.005 285)"
  on-media-ink: "oklch(20% 0.04 285)"
  media-glass: "oklch(15% 0.02 280 / 0.72)"
typography:
  display:
    fontFamily: "Archivo, Familjen Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(2rem, 1.2rem + 3vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 72"
  page-title:
    fontFamily: "Archivo, Familjen Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 72"
  rail-title:
    fontFamily: "Archivo, Familjen Grotesk, ui-sans-serif, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, Familjen Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.35rem, 1.1rem + 0.8vw, 1.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 72"
  row-title:
    fontFamily: "Archivo, Familjen Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.1rem, 0.9rem + 0.8vw, 1.6rem)"
    fontWeight: 800
    lineHeight: 1.02
    fontVariation: "'wdth' 72"
  body:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum'"
  lede:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body-prose:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 650
    letterSpacing: "0.04em"
  script-live-voice-0:
    fontFamily: "Archivo, Familjen Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.25rem, 1.2rem + 2.8vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 0.98
    fontVariation: "'wdth' 68"
  script-live-voice-1:
    fontFamily: "Young Serif, ui-serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.2rem + 2.8vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.12
  script-live-caption:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.2rem + 2.8vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  script-rest:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.12
rounded:
  container: "3px"
  container-lg: "4px"
  chip: "6px"
  thumb: "8px"
  field: "12px"
  float: "12px"
  portrait: "16px"
  sheet: "22px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 3.2vw, 48px)"
  rail: "272px"
  topbar: "60px"
  tabbar: "62px"
  dock: "68px"
  dock-desktop: "84px"
  row-gap: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink-day}"
    textColor: "{colors.on-ink-day}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.iris-500}"
    textColor: "{colors.ink-day}"
  button-secondary:
    backgroundColor: "{colors.surface-day}"
    textColor: "{colors.ink-day}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  platform-pill:
    textColor: "{colors.ink-day}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1.25rem 0.625rem 1rem"
  icon-button:
    textColor: "{colors.text-day}"
    rounded: "{rounded.pill}"
    size: "40px"
  dock-play:
    backgroundColor: "{colors.ink-day}"
    textColor: "{colors.on-ink-day}"
    rounded: "{rounded.pill}"
    size: "44px"
  stage-play:
    backgroundColor: "{colors.on-media-chip}"
    textColor: "{colors.on-media-ink}"
    rounded: "{rounded.pill}"
    size: "clamp(56px, 6vw, 76px)"
  row-play:
    backgroundColor: "{colors.surface-day}"
    textColor: "{colors.ink-day}"
    rounded: "{rounded.pill}"
    size: "44px"
  row-play-current:
    backgroundColor: "{colors.ink-day}"
    textColor: "{colors.on-ink-day}"
  medium-switch:
    backgroundColor: "{colors.ground-day}"
    textColor: "{colors.muted-day}"
    rounded: "{rounded.pill}"
    padding: "3px"
  medium-switch-selected:
    backgroundColor: "{colors.ink-day}"
    textColor: "{colors.on-ink-day}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.9rem"
  nav-item:
    textColor: "{colors.text-day}"
    rounded: "{rounded.container}"
    padding: "0.55rem 0.7rem"
  nav-item-current:
    backgroundColor: "{colors.iris-100}"
    textColor: "{colors.iris-700}"
  seek-chip:
    backgroundColor: "{colors.iris-100}"
    textColor: "{colors.iris-700}"
    rounded: "{rounded.chip}"
    padding: "1px 0.375rem"
  input:
    backgroundColor: "{colors.surface-day}"
    textColor: "{colors.ink-day}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
---

# Design System: Starpod

## Overview

**Creative North Star: "The Typeset Conversation"**

A podcast is people talking, so Starpod typesets the conversation. The episode stage puts the video (or the show's artwork) beside a live script in which each voice has its own face, the line being heard swells to display size, and spoken lines shrink and soften back into the page. Everything else (the list of episodes, the shell, the pages) speaks in the same condensed, uppercase display voice and a calm grotesque for UI.

One engine runs the whole visit. A single persistent `<video>` element plays the episode's HLS video or MP3, moves physically between the episode stage and the dock, and writes playback state onto `<html data-*>` and a live `--playback-progress` number so CSS can react without islands. Light and dark are both first-class: day uses Iris, night uses Aqua. The styles are still scoped under `<html data-world="stage">`, which is hardcoded; there is one world.

The system is generic by construction. Show artwork and cast photos supply the only imagery colour, shown in full colour, and every surface has to look deliberate for any show's art.

**Key Characteristics:**
- One OKLCH palette, one shell, one Stage world.
- Light is computed, not painted: the scrubber, the dock edge, and the stage light all take their position or colour from real playback.
- Iris by day, Aqua by night. The accent marks interaction, current state, and playback, nothing else.
- Three hover behaviours, never mixed: a gradient ring on outlined controls, a gradient fill on solid ones, a gradient icon on bare icons.
- Condensed uppercase Archivo for every title; Familjen Grotesk for everything you read or operate.
- Fixed navigation keeps play, follow, and navigation on screen at every size.

## Colors

Cool violet-grey neutrals carrying two rationed accents: Iris (violet) owns the light scheme and Aqua (cyan) owns the dark one. Tailwind exposes the live tokens as utilities (`text-ink`, `bg-surface`, `border-line`, `ring-accent-soft`, `from-glow-a` …) through `@theme inline`, so one class follows both schemes.

### Primary
- **Iris** (iris-500): the light-scheme accent. Focus rings, selection, caret, the buffering arc, and the bright end of the day gradient.
- **Deep Iris** (iris-700): light-scheme accent ink, for text in the accent: current nav items, seek chips, the "Video" kind marker, prose links. It is also voice 0's colour by day.
- **Iris Wash** (iris-100): the light-scheme soft accent fill behind current nav items and seek chips, and the focus ring around fields.
- **Pale Iris** (iris-200): the soft end of the day gradient. **Lilac** (iris-300) is voice 0 by night.

### Secondary
- **Aqua** (aqua-400): the dark-scheme accent, playing every role Iris plays by day.
- **Pale Aqua** (aqua-200): dark-scheme accent ink, the bright end of the night gradient, and voice 1 by night.
- **Deep Aqua** (aqua-700): voice 1's colour by day.
- **Night Accent Wash** (accent-soft-night): the dark-scheme soft accent fill.

### Neutral
- **Ground / Surface / Raised** (day and night): page ground, then the shell panels, cards, and fields, then hover fills and keyboard hints. All are faintly violet-tinted so neither scheme reads as dead grey.
- **Line / Line Strong**: hairline dividers and every default border (a bare `border` resolves to Line). Line Strong is for secondary-button and switch borders and the breadcrumb chevron.
- **Ink / Text / Muted**: headings and primary controls, then body, then metadata and secondary labels. **On Ink** is the text on ink-filled controls and flips with the scheme. **On Glow** is the text on the gradient fill (ink by day, on-ink by night).
- **Media Ground** (media-ground-day / -night): the near-black field behind video and artwork in the stage frame and mini player. **On-Media Chip / Ink** form the fixed light play disc over media, and **Media Glass** is the translucent dark "Resume at" chip beside it; all three ignore the scheme.

### Named Rules
**The Two Lamps Rule.** Iris is the only accent by day and Aqua the only accent by night. Accent fills are limited to interaction, the current item, and playback, and never decorate resting content.

**The Computed Light Rule.** Every moving gradient or glow takes its position from `--playback-progress`, from sampled video, or from a hover/focus state. A gradient that no state drives does not belong in the system.

**The OKLCH Only Rule.** Every colour is authored in OKLCH, including shadows, masks, and backdrops. Hex and rgb are never used.

**The One Palette Rule.** Tailwind's theme holds only the token colours above. There are no parallel light/dark colour pairs; a single token class follows both schemes.

## Typography

**Display Font:** Archivo variable, with weight and width axes (falls back to Familjen Grotesk)
**UI / Body Font:** Familjen Grotesk (with ui-sans-serif, system-ui)
**Voice 1:** Young Serif (with ui-serif, Georgia)

**Character:** Archivo, condensed to 72% width and set uppercase at 800, is the loud stage voice for every title. Familjen Grotesk is the calm voice for reading and operating. Young Serif answers Archivo as the second speaker in the script. All numerals are tabular.

### Hierarchy
- **Display** (800, 72% width, uppercase, `display`): the episode title on the stage, max 18ch.
- **Page title** (800, 72% width, uppercase, `page-title`): the `PageHeader` on About, Contact, and other standalone pages, max 18ch, balanced. The 404 heading uses the same face one step smaller.
- **Rail title** (900, 62% width, `rail-title`): the show name in the desktop rail.
- **Headline** (800, 72% width, uppercase, `headline`): section titles ("Show notes", "Listen on", "Meet the hosts").
- **Row title** (800, 72% width, uppercase, `row-title`): episode titles in the list; the current episode's title takes the voice-0 colour.
- **Lede** (1.125rem/1.625, max 62ch, Text): the paragraph under a page title.
- **Body** (400, 1rem/1.55): UI text. Stage descriptions are 1.0625rem, max 62ch. Show notes and transcripts use `body-prose` via Tailwind `prose` (max ~70–76ch).
- **Label** (650, 0.75rem, 0.04em tracking): rail group labels ("Hosted by", "Follow the show"), "Presented by", Host/Guest tags (uppercase), and field labels at 0.875rem 600.
- **Script**: the live line (`data-d="0"`) sets at `script-live-*` in its voice's face. One and two lines back step down to 1.4rem and 1.15rem; three to five back drop to 0.9rem with a 0.4px blur; upcoming lines sit at 0.95rem. Long live lines cap at clamp(1.75rem, 1rem + 1.9vw, 2.75rem).

### Named Rules
**The One Face Per Voice Rule.** In the script and the cast, voice 0 is condensed Archivo in the voice-0 colour, voice 1 is Young Serif in the voice-1 colour and right-aligned, and further voices or unattributed captions are Familjen in ink. A voice face always identifies a speaker.

**The Volume Rule.** Size, width, and opacity carry distance from the live line. They are set by the engine's `data-d` attribute and never by hand.

**The Upright Time Rule.** Every timestamp is upright, tabular, and in `HH:MM:SS` on seek chips.

## Layout

Layout is an app shell with a single main column.

- **Desktop (≥1024px):** a sticky full-height rail (272px) holds the show art (with a tilt on hover), show name, blurb, search, navigation, follow links, and hosts. The dock spans the remaining width at the bottom (84px). The main column pads by the dock height plus 64px and caps at 1280px on pages.
- **Below 1024px:** a sticky blurred top bar (60px plus safe area) carries the show and an ink "Follow" pill. A fixed three-up tab bar (Episodes, Search, More; 62px plus safe area) sits at the bottom with the dock (68px) above it. Sheets rise from the bottom as native popovers, max 560px wide.
- **Gutter:** clamp(16px, 3.2vw, 48px). Breadcrumbs, page titles, and content share one left edge.
- **Home:** the episode list is the page: hairline-ruled rows with art, facts, title, two-line description, and a play disc.
- **Episode stage (desktop):** the frame and meta sit on the left beside a sticky script column at 0.95fr. With no transcript the stage collapses to one column, max 1100px. On phones the script performs directly under the picture (max 34vh), then the meta.
- **Standalone pages:** `PageHeader`, then sections separated by 4–5rem. About lays hosts out in two columns from 1024px. Contact keeps the form to 36rem with name and email side by side from 640px.
- **Mini player:** when a watched episode's stage scrolls away, the video floats bottom-right at clamp(260px, 24vw, 400px) on desktop or min(52vw, 360px) on phones. It is fixed above the page and never changes the page's layout.
- **Foldables** (two viewport segments, or a coarse-pointer tablet aspect): the stage becomes two pages either side of a hinge gap of at least 40px; voice 0 takes the left page and voice 1 the right.
- **Breakpoints:** 640px, 768px, 1024px, 1100px.

**The Never-Hidden CTA Rule.** Play, follow, and navigation are fixed chrome at every size: the rail on desktop, the top bar plus tab bar plus dock below that. Page content pads for every fixed layer it could sit under.

## Elevation & Depth

Depth comes mainly from tone (Ground → Surface → Raised) and from light sampled out of the media. Shadows are reserved for objects that float above the page.

### Shadow Vocabulary
- **Soft** (`--shadow-soft`, two-layer violet-tinted by day, black by night): the stage frame, show art, and mini-player chrome.
- **Float** (`--shadow-float`): things lifted off the page, such as the artwork in the stage frame, the stage play disc, bottom sheets, and the floating mini video.
- **Dock lip** (a single upward shadow, `0 -12px 32px -24px`): separates the dock from content scrolling under it.

### Named Rules
**The Stage Light Rule.** The glow behind the stage frame is sampled from the playing video into a 32×18 canvas (artwork glow when nothing plays). It is the only ambient colour on the page and it is always computed.

**The Two Shadows Rule.** Soft and Float are the only elevation shadows. A hover is shown by the ring, the gradient fill, or a Raised fill, never by a deeper shadow or a lift.

## Shapes

Interactive controls are pills or circles (999px): buttons, play discs, the medium switch, platform pills, search, and the Follow pill. Containers are near-square (3px, or 4px for large surfaces like the frame). Fields are softer (12px), host portraits on About are 16px, show art and the mini player 12px, row and dock art 8px, seek chips 6px, sheets 22px at the top. Cast photos on the stage take the container radius. Iconography is one 24px, 1.75-stroke outline set (`icons.tsx`), with filled play and pause glyphs and skip icons that print their seconds inside.

**The Pill Controls Rule.** If it can be pressed, it is round. Corner radius on containers is near-square; corner radius on controls is full.

**The Shape-Keeping Focus Rule.** Focus never changes an element's shape. The global ring is a 2px accent outline at 3px offset that follows the element's own radius; fields replace it with an accent border and a 4px Accent Wash ring.

## Components

### Buttons
- **Shape:** full pill (999px), 0.75rem × 1.25rem padding, 0.9375rem at 700.
- **Primary (solid):** ink fill with On Ink text ("Play episode", "Send message"). Hover and focus fade the fill into the Glow A→B gradient over 300ms (registered `--fill-a/--fill-b`) and the text to On Glow. Press scales to 0.97 on the spring.
- **Secondary (outlined):** surface fill, 1px Line Strong border, ink text ("Read the full transcript", "Go back"). Hover and focus draw the ring.
- **Icon button:** a 40px circle with no fill at rest. Hover turns the icon itself into the gradient (each SVG carries its own `linearGradient`, stops transition 300ms).
- **Text button:** a 34px pill with a Line border, used for the playback rate; wears the ring.

### Play discs
- **Stage play:** clamp(56px, 6vw, 76px) circle with the fixed light On-Media disc and Float shadow, bottom-left on the frame. It fades out while a video plays and returns on frame hover or focus. A Media Glass "Resume at" chip sits beside it.
- **Dock play:** 44px ink circle; hover fills with the gradient. Press scales it to 0.92.
- **Row play:** 44px surface circle with a Line Strong border and the ring on hover. On the current episode it turns into a solid ink disc with three on-air bars that pulse while playing and give way to the glyph on hover.
- **Buffering:** a 2px accent arc spins around the disc (`.play-toggle[data-buffering]::before`, 900ms linear).
- **Glyph:** play and pause spring between each other.

### Medium switch (Watch / Listen)
A pill track on Ground with a Line Strong border and 3px inset. An ink thumb slides under the chosen option on the spring (520ms) and the chosen label turns On Ink. Wears the ring. A compact size is used in the dock.

### Inputs
- **Style:** 1px Line border, Surface fill, 12px radius, 0.75rem × 1rem padding, with a visible label above (0.875rem 600 ink). Placeholders are Muted and only add an example.
- **Focus:** the border turns Accent and a 4px Accent Wash ring appears (200ms); the outline is removed so the field keeps its radius.
- **States:** the submit button disables and reads "Sending…"; errors appear as a bordered note above the button with `role="alert"`; success replaces the form with a Surface panel.
- **Search dialog:** a Surface panel with a Line border; the field has no ring of its own, and the hairline under it turns Accent while focused.

### Navigation
Rail and sheet links are 600 weight with a 24px muted icon and container radius. Hover gives a Raised fill and ink text. The current page gets the Accent Wash fill and accent-ink text and icon. Config `links` choose an icon (`external`, `heart`, `link`, `sponsor`, `store`; default `external` for URLs, `link` for local pages). The tab bar is three even cells with a 0.6875rem label; the current cell is accent ink.

### Breadcrumbs
0.8125rem Muted links with a Line Strong chevron, an even 8px either side; the current crumb is Text at 500. Hover turns a crumb Ink. Hidden on the episode stage.

### Episode rows
Hairline-ruled rows: full-colour art (56/72px, 8px radius), facts in Muted 0.8125rem with the number in ink and a "Video" kind marker in accent ink, the condensed uppercase title, a two-line description from 768px up, and a row play disc. The whole row is the link. Clicking a row morphs its art into the stage frame's artwork and its title into the stage title (480ms).

### Platform pills
Labelled pills (About, the follow sheet): 1px Line border, an 18px platform glyph in Muted, ink label, the ring on hover. In the rail they are 40px icon-only circles on Ground.

### Seek chips
Timestamps in show notes and transcripts are 6px-radius chips in Accent Wash with accent-ink 600 tabular `HH:MM:SS`. Hover and focus fill them with the gradient. Brackets around a chapter time are absorbed into the chip. Clicking seeks the player.

### Cast and sponsors
The stage lists the episode's hosts (configured order, then guest hosts) and guests (alphabetical) with full-colour 52px photos, names in their voice's face when they speak as voice 0 or 1, and a "Host"/"Guest" label. "Presented by" lists the episode's sponsors with inline logos (filled in ink) and hides when empty.

### Dock and mini player
The dock is a fixed transport bar on Surface that slides in once per visit (600ms). On phones, progress is a 2px gradient light along its top edge. On desktop it has a full scrubber: a 4px track filled with the gradient to the playhead, a 14px ink thumb that grows to 1.25× on hover, tabular times, and a transcript preview of the line at the hovered time. The mini video sits on Media Ground with Float shadow under a Surface chrome strip (title, fullscreen, close). Clicking the video opens its episode. Close pauses playback and hides the video; any play brings it back. Keyboard: K/space play, J/L skip, M mute, W watch/listen, F fullscreen.

### Signature: the ring
A 1px gradient ring (Glow A to Glow B, to bottom right) that follows the element's own radius. On hover (pointer devices only) or keyboard focus it sweeps itself on over 500ms along `--ease-halo`, an animated `@property --halo` with `inherits: true`. It belongs only on outlined controls sitting on the page background.

**The Three Hovers Rule.** Outlined controls draw the ring; solid controls fill with the gradient; bare icons turn the icon to the gradient. A control gets exactly one, and every one transitions.

### Signature: the live script
The script column bottom-aligns its lines under a top fade mask and performs the conversation by distance. When the live line changes, each line FLIPs from its old box to its new one with transforms only (720ms, `cubic-bezier(0.25, 1, 0.5, 1)`), arrivals rise from below, and a jump of more than three lines crossfades instead. Hovering or focusing a line reveals its speaker and time; clicking seeks. It follows seeks and skips immediately.

### Signature: page transitions
Navigations play a curtain: the old page drops away (240ms) and the new one rises in (640ms ease-out, slight blur), reversed on back. The rail, top bar, and tab bar cross-fade in 180ms, unpaired elements fade solo, and the dock never animates.

### Signature, foldables: the unfold
On first detecting the spread, each page swings open once from the hinge (rotateY 62deg to 0, 1000ms expo-out), keyed by a one-shot `data-unfolding` attribute.

## Do's and Don'ts

### Do:
- **Do** read state from the engine: style `[data-current]`, `[data-playing]`, `[data-watching]`, `[data-buffering]`, `html[data-medium]`, `html[data-host]`, and `--playback-progress` instead of adding new JS-driven classes.
- **Do** style new work with Tailwind utilities on the token colours; keep custom CSS for what Tailwind cannot express (`@property` animations, the ring, view transitions, voice typography).
- **Do** choose the hover by the control's shape: ring for outlined, gradient fill for solid, gradient icon for bare icons, always with a transition.
- **Do** use the easings: expo-out (`cubic-bezier(0.16, 1, 0.3, 1)`) for state and reveal, the `--ease-halo` curve for the ring, and the overshooting `linear()` spring for press, thumb, and glyph motion. Everything collapses to 1ms under `prefers-reduced-motion`.
- **Do** open standalone pages with `PageHeader` and align them to the breadcrumbs.
- **Do** give fields visible labels and the accent border plus Accent Wash ring on focus.

### Don't:
- **Don't** author colour in hex, rgb, or hsl anywhere, including docs, shadows, and masks.
- **Don't** reintroduce parallel light/dark Tailwind colours (`bg-light-*`, `dark:bg-dark-*`). Use the single token class.
- **Don't** let an accent fill decorate resting content.
- **Don't** reshape an element on focus or put a ring on a control that already fills or has no outline.
- **Don't** add a third elevation shadow or a hover lift.
- **Don't** desaturate or duotone show art or cast photos; show imagery in full colour.
- **Don't** use a voice face (Archivo condensed as a speaker, Young Serif) for anything other than a speaker or their name; Archivo as a title face is fine.
- **Don't** hide play, follow, or navigation behind scroll.
- **Don't** add show-specific copy, colour, or imagery to the package. Show artwork and the site's own data are the only imagery and content sources.
