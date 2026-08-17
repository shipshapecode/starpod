---
name: Starpod
description: An adaptable, content-first podcast website template.
colors:
  iris-accent: "oklch(60.5% 0.213 293)"
  iris-accent-soft: "oklch(86% 0.073 293)"
  aqua-accent: "oklch(76.5% 0.122 223)"
  aqua-accent-soft: "oklch(91% 0.05 220)"
  white: "oklch(100% 0 0)"
  light-card: "oklch(97.65% 0.005 274.97)"
  light-player: "oklch(95.94% 0.009 279.69)"
  light-text-heading: "oklch(30.55% 0.052 292.57)"
  light-text-body: "oklch(59.68% 0.017 285.89)"
  light-icon: "oklch(67.65% 0.043 285.21)"
  light-input-border: "oklch(88.09% 0.018 234.53)"
  light-input-border-focused: "oklch(57.79% 0.03 234.37)"
  dark-background: "oklch(13.85% 0.025 273.24)"
  dark-card: "oklch(18.74% 0.024 280.08)"
  dark-player: "oklch(22.61% 0.035 280.78)"
  dark-button: "oklch(21.57% 0.029 280.68)"
  dark-border: "oklch(23.8% 0.04 266.76)"
  dark-text-body: "oklch(61.91% 0.019 264.42)"
  dark-icon: "oklch(71.44% 0.019 264.45)"
  dark-input-bg: "oklch(21.63% 0.031 280.68)"
  dark-input-border: "oklch(28.08% 0.048 281.19)"
  dark-input-border-focused: "oklch(45.84% 0.078 281.04)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "normal"
  section-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.05em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "3rem"
  xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.light-text-heading}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem 0.5rem 0.5rem"
  play-button:
    backgroundColor: "{colors.light-text-heading}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    height: "3.5rem"
    width: "3.5rem"
  play-button-hover:
    backgroundColor: "{colors.iris-accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    height: "4rem"
    width: "4rem"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.light-text-body}"
    rounded: "{rounded.sm}"
    padding: "1rem"
  input-focus:
    backgroundColor: "{colors.white}"
    textColor: "{colors.light-text-body}"
    rounded: "{rounded.sm}"
    padding: "1rem"
  card:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.light-text-body}"
    rounded: "{rounded.md}"
    padding: "1rem"
  nav-link:
    textColor: "{colors.light-text-heading}"
    typography: "{typography.body}"
    padding: "1.25rem 0"
---

# Design System: Starpod

## 1. Overview

**Creative North Star: "The Quiet Stage"**

Starpod is a stage, not a performer. The interface provides the lighting, the
structure, and the seating; the podcast itself is the act. Every surface is built
so a show's own artwork, voice, and episodes take center stage while the UI holds
the wings. When a design decision is unclear, the test is always: *is the UI
getting out of the show's way?*

Because Starpod is a **template adopted by many shows**, neutrality is a feature,
not a limitation. The system leans on a near-monochrome, low-chroma foundation
(soft off-white cards in light mode, deep indigo-slate surfaces in dark mode)
with a single adaptive accent that shifts from violet by day to cyan by night.
Color is rationed; the show's cover art is usually the most saturated thing on
screen, and that is intentional. The layout is a calm two-part composition: a
fixed identity rail (artwork, title, listen links, hosts) on the left, and a
scrollable content column on the right, with a persistent media player anchored
to the bottom.

This system explicitly rejects the generic-SaaS-landing look (no cream
backgrounds, no tracked-uppercase eyebrows over every section, no identical
icon-card grids, no hero-metric template), it rejects the dated podcast-directory
look (tiny artwork, link-soup, afterthought players), and it rejects clutter.
It is also deliberately *not* locked to any one show's personality — the
reference deployment (Whiskey Web and Whatnot) supplies the demo copy, never the
brand rules.

**Key Characteristics:**
- Content-first: artwork and the play action outrank all chrome.
- Adaptive single accent: Iris (violet) in light mode, Aqua (cyan) in dark mode.
- Calm, low-chroma neutral surfaces with tonal layering instead of heavy shadow.
- Refined-but-playful motion: gradient rings, a tilting cover, a growing play button.
- Native and familiar interactions over invented ones.
- Dark mode is a first-class, co-equal theme (not an afterthought).

## 2. Colors

A near-monochrome violet-leaning neutral system with one adaptive accent; the
palette stays quiet so the show's artwork carries the saturation.

### Primary
- **Iris** (`oklch(60.5% 0.213 293)`, soft stop `oklch(86% 0.073 293)`): The
  light-mode accent. Appears only on interaction — the play button's hover
  gradient, the button progress ring, the growing-underline on nav links, and
  platform-icon hover. Rationed, never a background fill.
- **Aqua** (`oklch(76.5% 0.122 223)`, soft stop `oklch(91% 0.05 220)`): The
  dark-mode counterpart to Iris.
  The accent role swaps to Aqua under `prefers-color-scheme: dark` so the same
  interactions read correctly on a dark surface.

### Neutral — Light Mode
- **Deep Indigo Ink** (`oklch(30.55% 0.052 292.57)`): Headings and high-emphasis
  text; also the resting fill of the round play button.
- **Muted Slate Body** (`oklch(59.68% 0.017 285.89)`): Body copy and secondary
  text.
- **Off-White Card** (`oklch(97.65% 0.005 274.97)`): The primary surface — the
  content panel and identity rail sit on it, lifted just off pure white.
- **Player Mist** (`oklch(95.94% 0.009 279.69)`): The translucent backdrop of the
  bottom player bar (used at ~90% with a backdrop blur).
- **Cool Hairline** (`oklch(88.09% 0.018 234.53)`): Input borders and dividers;
  shifts to `oklch(57.79% 0.03 234.37)` on focus.

### Neutral — Dark Mode
- **Midnight Slate** (`oklch(13.85% 0.025 273.24)`): The body background.
- **Raised Slate Card** (`oklch(18.74% 0.024 280.08)`): Surfaces lifted off the
  background by lightness, not shadow.
- **Player Slate** (`oklch(22.61% 0.035 280.78)`) / **Button Slate**
  (`oklch(21.57% 0.029 280.68)`): The player bar and resting button fills.
- **Dim Body** (`oklch(61.91% 0.019 264.42)`): Dark-mode body copy; headings go
  to pure white (`oklch(100% 0 0)`).

### Named Rules
**The Rationed Accent Rule.** Iris/Aqua appear on interaction states and active
indicators only — never as a section background or a large fill. The accent's
rarity is what makes a play or a hover feel alive. If a screen reads as "purple"
or "cyan" at rest, the accent has been overused.

**The Artwork-Is-Loudest Rule.** On any given view, the show's cover art should be
the most saturated element. The chrome stays low-chroma so nothing competes with
the content.

## 3. Typography

**Display / Body / Label Font:** Inter (with `system-ui, sans-serif` fallback),
loaded via Astro's font pipeline as `--astro-font-inter`.

**Character:** One family, worked across weights and sizes. Inter is neutral,
highly legible, and brand-agnostic — exactly right for a template that must wear
many shows' identities. Hierarchy comes from weight (400 vs 700) and scale, not
from a second typeface. Display sizes pull letter-spacing slightly negative for a
modern, set-tight feel; body stays at default tracking for readability.

### Hierarchy
- **Display** (700, `clamp(1.5rem, 4vw, 3rem)` — `text-2xl` → `lg:text-5xl`,
  line-height ~1.1): The episode-page H1. The single largest type on a page.
- **Headline** (700, `1.5rem` / `text-2xl`): The show title in the identity rail.
- **Title** (700, `1.125rem` / `text-lg`): Episode titles in the list; the
  primary scannable link.
- **Body** (400, `1rem`, line-height ~1.6): Descriptions, show notes, transcripts.
  Cap measure at 65–75ch in prose blocks.
- **Label** (700, `0.875rem` / `text-sm`): Button text and inline actions
  ("Show notes", "Play Episode").
- **Section Label** (700, `0.75rem` / `text-xs`, tracking `0.05em`): The
  `section-heading` utility — small, slightly tracked, used for "Listen", "Show
  Notes", "Episode Transcript". This is the *one* sanctioned small-caps-ish label
  and is deliberate, not an eyebrow on every section.

### Named Rules
**The One-Family Rule.** Inter only. Do not introduce a second typeface to add
"character"; character belongs to each adopting show, expressed through its
content and artwork, not through Starpod's font choices.

## 4. Elevation

This is a **tonal-first, flat-by-default** system. Depth is conveyed primarily by
lightness layering — in dark mode the background, card, player, and button are
four steps up the same low-chroma indigo ramp, so surfaces separate without a
single shadow. Shadows are reserved for elements that genuinely float above the
page: interactive buttons and the media player.

### Shadow Vocabulary
- **Button lift** (light: `box-shadow: 0 1px 2px 0 oklch(91% 0.015 248 / 0.9)`
  via `shadow-sm`; dark: `shadow-md` at `oklch(0% 0 0 / 0.25)`): The resting lift
  on pill buttons.
- **Player / video lift** (`shadow-lg`): The bottom player bar and the expanded
  video pane, which sit above all page content.
- **Backdrop blur** (`backdrop-blur-xs` over a ~90% player surface): The player
  bar reads as frosted glass over scrolling content — the one sanctioned use of
  blur, because it is functional (legibility over moving content), not decorative.

### Named Rules
**The Lightness-Before-Shadow Rule.** To separate two surfaces, move them a step
on the tonal ramp before reaching for a shadow. Shadows mean "this floats," not
"this is a box."

## 5. Components

The component feel is **refined and playful**: a polished, quiet base with small,
tasteful moments of motion that reward interaction. Motion is a feature here, used
sparingly.

### Buttons
- **Shape:** Fully rounded pills (`rounded-full`).
- **Primary (`.btn`):** White fill in light mode, Button Slate in dark mode, with
  Label type. Its signature is an **animated conic-gradient ring**: on hover/focus
  a 1px gradient border sweeps in (`--complete` 0→100 over 500ms with a custom
  ease), Iris in light mode, Aqua in dark. Carries the Button-lift shadow at rest.
- **Hover / Focus:** The progress ring completes; transition uses a long
  decelerating `linear()` curve. Focus-visible triggers the same ring as hover.

### Play Buttons (signature)
- **Round play button:** A `3.5rem` circle, Deep Indigo Ink fill (white icon) in
  light mode / white fill (slate icon) in dark mode. On hover it **grows to `4rem`
  and the fill becomes the Iris→Aqua gradient** over 300ms. Used in the episode
  list and the episode-page header.
- **Full play button:** A pill combining a circular icon badge with a "Play
  Episode" / "Pause Episode" label; toggles icon and copy from shared player
  signals. Used as the primary CTA on episode pages and list rows.

### Inputs / Fields
- **Style (`.input`):** White (light) / Input Slate (dark) fill, Cool Hairline
  border, `rounded-sm`, `1rem` padding.
- **Focus:** Border color shifts to the focused hairline tone; **ring and outline
  are explicitly suppressed** (`!ring-0`, `!outline-none`) — the border shift is
  the entire focus signal. Maintain a visible, AA-contrast focus indicator when
  adapting this.

### Cards / Containers
- **Corner Style:** `rounded-md` (`0.5rem`); the show artwork steps up to
  `rounded-2xl` at large sizes.
- **Background:** Off-White Card (light) / Raised Slate Card (dark), set off the
  page by lightness.
- **Border:** Hairline dividers between episode rows; otherwise borderless.
- **Shadow Strategy:** None at rest — see Elevation. Cards are flat.

### Navigation
- **Identity rail:** A fixed left column (`28rem`/`lg`, `30rem`/`xl`) holding
  artwork, title, blurb, listen links, and hosts. On mobile it collapses; rail
  content (hosts, info) moves into the footer.
- **Nav links (`.animated-bottom-border`):** Body type with an **underline that
  grows from left to right on hover** (gradient: Iris in light, Aqua in dark,
  500ms ease).
- **Platform icons (`.gradient-icon`):** Masked SVGs filled with a vertical
  neutral gradient that **animates to the accent on hover** (`@property`-driven
  color transition, 300ms).

### Show Artwork (signature)
The cover art uses **Atropos** for a subtle 3D parallax tilt that tracks the
pointer — the single most physical interaction in the system. It is decorative
delight applied to the one element that should command attention.

## 6. Do's and Don'ts

### Do:
- **Do** keep the show's cover art the most saturated element on screen.
- **Do** ration Iris/Aqua to interaction and active states; keep resting surfaces
  low-chroma.
- **Do** separate surfaces by stepping the tonal ramp before adding a shadow.
- **Do** use Inter across the whole system, varying weight and size for hierarchy.
- **Do** treat dark mode as co-equal: every accent and component has a defined
  dark-mode counterpart (Aqua, slate fills, lighter shadows).
- **Do** keep motion refined and purposeful (gradient ring, artwork tilt, growing
  play button) and provide a `prefers-reduced-motion` alternative for each.
- **Do** lean on native, familiar media affordances (click-to-play, fullscreen,
  standard controls).

### Don't:
- **Don't** make the UI look like a generic SaaS landing page: no cream/sand
  backgrounds, no tracked-uppercase eyebrow over every section, no identical
  icon-heading-text card grids, no hero-metric template.
- **Don't** ship the dated podcast-directory look: tiny artwork, undifferentiated
  link-soup of platform buttons, or an afterthought player.
- **Don't** hard-code one show's personality, palette, or copy into component
  structure — brand-specific values belong in config and tokens so the template
  re-skins cleanly.
- **Don't** let a screen read as "purple" or "cyan" at rest; that means the accent
  is overused.
- **Don't** add a second typeface for "character."
- **Don't** use blur or shadow decoratively — the only sanctioned blur is the
  functional frosted player bar.
- **Don't** remove focus visibility: the inputs suppress the default ring, so any
  adaptation must keep an AA-contrast focus signal.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent
  stripe, and never use gradient-filled text.
