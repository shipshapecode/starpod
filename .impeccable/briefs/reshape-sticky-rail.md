# Design Brief — Starpod Reshape: "Sticky Rail + Mobile App-Bar"

> Status: awaiting confirmation. Scope: full-site restructure. Register: brand.
> Anchors: PRODUCT.md ("The Quiet Stage"), DESIGN.md (OKLCH, Iris/Aqua rationed,
> Inter, tonal-first, refined-but-playful). Selected from a 4-direction
> multi-agent comparison (this direction ranked #1, 7.3 avg).

## 1. Feature Summary

A full-site restructure of the Starpod podcast template that keeps the brand,
OKLCH tokens, and component vocabulary intact but reworks layout and navigation
so that: (a) video is co-equal with audio with native controls in an intentional
spot, (b) mobile navigation is reachable without scrolling past episodes, (c) a
configurable CTA is a first-class affordance, and (d) episode artwork appears on
the episode page. It serves both first-time visitors (find + play in seconds, on
any device) and the podcasters who adopt the template (clean, adaptable defaults).

## 2. Primary User Action

**Start an episode — listening or watching — within seconds, from any device,
without hunting.** Navigation, subscribing (CTA), and search are always one tap
away; they support that action, never compete with it.

## 3. Design Direction

- **Color strategy:** Restrained (project default). One rationed accent — Iris
  (light) / Aqua (dark) — appears only on interaction and on the single CTA pill.
  The show's artwork stays the most saturated element ("Artwork-Is-Loudest").
- **Scene sentence:** A listener on their phone, half-distracted on a couch or
  commute, glancing at a podcast someone just shared — they should see what the
  show is, hit play, and optionally watch, without thinking. (Forces: calm,
  content-first, dark-mode co-equal, zero-friction.)
- **Anchor references:** the current whiskey.fm rail identity (preserve its
  artwork-forward calm); Apple Podcasts / Pocket Casts (familiar, native media
  affordances); a frosted sticky mobile app-bar as in well-built reading apps
  (always-reachable chrome). Not a reference: SaaS marketing landing pages.
- **Winning direction vs others:** chosen over Featured-Hero (its hero risks the
  rejected SaaS-landing pattern and demotes identity), Top Bar + Stage and
  Watch/Listen Dual Shell (both retire the always-on artwork rail and bet on
  unproven cross-island video relocation). This direction refines rather than
  reimagines, so it preserves brand presence and minimizes regression risk.

## 4. Scope

- **Fidelity:** production-ready (explore → then build).
- **Breadth:** whole surface — shell/nav (desktop rail + mobile app-bar), home,
  episode page, and the persistent player.
- **Interactivity:** shipped-quality components (focus-trapped slide-over, native
  video theater, expandable dock).
- **Time intent:** polish until it ships.

## 5. Layout Strategy

**Desktop** — preserve the two-column composition, but promote the left rail from
a passive identity panel to a **sticky navigation spine** with a deliberate
vertical order:

1. Sticky utility row (never scrolls away inside the rail): search trigger +
   configurable CTA pill.
2. Show artwork (Atropos tilt retained) — loudest element.
3. Show title + blurb.
4. Listen platform links.
5. Primary nav links (About / Contact / Store / Sponsor) — promoted out of the
   buried footer.
6. Hosts.

The right content well is unchanged in spirit (gradient + Dots wash, episode list
on home, episode body on detail). **Nothing moves to a footer anymore** — that's
the core structural fix. The CTA pill is the one persistent accented element in
the chrome (justified: a single rationed action, not a fill).

**Mobile** — the rail does not collapse into a footer. It becomes a **compact
frosted sticky top app-bar** (uses the sanctioned player-bar blur), always visible
at first paint and pinned on scroll: `[artwork chip + show title] [search] [CTA] [≡]`.
The `≡` opens a right-side **slide-over** containing the full rail content (larger
artwork, blurb, Listen links, nav links, Hosts) in the same vertical order as
desktop. An optional compact identity strip (artwork + title + blurb) shows once
at the top of the content for first-paint context, then the episode list, then the
full-width docked player.

## 6. Key States

- **Home / default:** rail or app-bar + "Latest Episodes" list.
- **Episode page:** breadcrumbs → episode artwork block → date → H1 → description →
  (video episodes) inline theater OR (audio) FullPlayButton → guests → sponsors →
  show notes → transcript.
- **Audio-only episode:** episode art renders as a tilt-enabled cover; no video
  theater, **no audio/video toggle shown** (omit, don't disable — a greyed tab
  reads as broken).
- **Video episode:** episode art is the **poster**; on play it becomes the inline
  16:9 native-controls theater.
- **Empty (no episodes):** existing UFO illustration empty state, preserved.
- **Mobile menu open:** focus-trapped, scrim-backed slide-over; Escape + scrim
  dismiss; focus restored to `≡` on close.
- **Player expanded (video):** centered aspect-correct theater pinned above the
  player bar (replaces the crude `w-44` box).
- **CTA unconfigured:** falls back to "Subscribe" → primary platform link / RSS.
- **Reduced motion:** slide-over opens instantly; artwork tilt and any reveal
  motion fall back to fade/none.

## 7. Interaction Model

- **Video (co-equal, native):** use native HTML5 `controls` on the `<video>` —
  click-to-play/pause, scrub, volume, captions, PiP, fullscreen all come free
  (Native-and-Familiar principle; no custom video chrome). Starting playback in
  the inline theater adopts the episode into the shared signals
  (`currentEpisode`, `mediaMode='video'`), keeping one source of truth.
- **Single-video architecture (locked technical approach):** keep the existing
  single persistent `<video>` and signals. **Do NOT reparent the node between the
  inline theater and the dock.** Instead, keep the element docked and render the
  inline theater as a **sized container the docked video visually fills**
  (evaluate this first — it sidesteps `transition:persist` / scroll-flicker risk,
  the bug class from commit `a42412c`). Reconcile the custom rAF transport
  (Slider/PlayButton/Rewind/Forward/Rate) with native events by having the slider
  listen to `timeupdate`/`play`/`pause` and suppressing whichever control surface
  isn't the active context.
- **CTA:** single gradient-ring (`.btn`) pill; config-driven `{ label, href,
  behavior }`; persists in rail + app-bar on every route; carries focus-visible
  ring (AA).
- **Mobile nav:** app-bar actions reachable with zero scroll; secondary links one
  tap into the slide-over.
- **Nav links:** existing animated growing-underline (Iris/Aqua).

## 8. Content Requirements

- **CTA copy:** default label "Subscribe"; podcaster-configurable label/href/behavior.
- **"Latest Episodes"** section label (existing `section-heading` utility — the
  one sanctioned small tracked label; not an eyebrow on every section).
- **Episode artwork:** `episode.episodeImage`, falling back to `show.image` (as
  list thumbnails already do). Add `episodeImage` to the `currentEpisode` signal.
- **Slide-over:** accessible name ("Menu"), labelled close control.
- **Media:** episode artwork (real content) doubles as video poster; no new
  illustrations needed beyond the existing UFO empty state.

## 9. Recommended References (for build)

- `layout.md` — rail-to-app-bar restructure, spatial rhythm.
- `adapt.md` — the desktop-rail ↔ mobile-app-bar responsive transform.
- `interaction-design.md` / `harden.md` — focus-trapped slide-over, AA dialog
  semantics, reduced-motion, safe-area insets.
- `animate.md` — slide-over + theater transitions with reduced-motion fallbacks.

## 10. Open Questions (with proposed defaults)

1. **Config validation:** `defineStarpodConfig` is currently an identity function
   (no Valibot), despite CLAUDE.md. **Default:** keep the identity-function pattern
   for the new `cta` field; don't introduce Valibot in this pass.
2. **Hard-coded Store link:** `InfoCard.astro` hard-codes `whiskey.fund`.
   **DECIDED (user):** defer — keep nav links hard-coded this pass; revisit
   config-driven nav later. Nav links centralized in a shared module to make the
   future migration trivial.
3. **Video element host:** **Default:** option (b) — docked element fills a sized
   theater container; only fall back to relocation if (b) proves visually
   impossible.
4. **Mobile above-the-fold:** the win is nav reachability, not "first episode above
   the fold." **Default:** keep a compact identity strip; ensure the first Play
   affordance is reachable with minimal scroll.
