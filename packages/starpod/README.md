# Starpod

Turn an RSS feed into a full podcast website. Starpod is an
[Astro](https://astro.build) integration: install it, point it at your feed,
and it generates your whole site — episode pages, a persistent audio player,
search, transcripts with clickable timestamps, and a suite of agent-friendly
endpoints (llms.txt, markdown twins of every page, an OpenAPI-documented JSON
API).

The reference deployment is [whiskey.fm](https://whiskey.fm).

## New project

```bash
npx starpod new my-podcast
cd my-podcast
pnpm install
pnpm dev
```

The scaffolder asks for your show's name and RSS feed and generates a
ready-to-deploy project.

## Existing Astro project

```bash
pnpm add starpod @astrojs/preact preact
pnpm add -D sharp
```

Create `starpod.config.ts` at your project root:

```ts
import { defineStarpodConfig } from 'starpod/config';

export default defineStarpodConfig({
  blurb: 'A one-line tagline for your show.',
  description: 'A few sentences about your show.',
  hosts: [
    {
      name: 'Your Name',
      bio: 'A short bio.',
      // A filename inside your site's src/img/people/
      img: 'your-name.jpg'
    }
  ],
  platforms: {
    // Links for the platforms your show is on; unset ones are hidden.
    // apple, appleIdNumber, overcast, pocketCasts, spotify, youtube
  },
  rssFeed: 'https://example.com/feed.xml'
});
```

Then wire it up in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import starpod from 'starpod';

import starpodConfig from './starpod.config';

export default defineConfig({
  site: 'https://your-podcast.com',
  integrations: [starpod(starpodConfig)]
});
```

Finally, pin `fast-xml-parser` to the version the feed parser was built
against (real-world feeds exceed newer versions' entity-expansion limit) —
in `package.json`:

```json
"pnpm": { "overrides": { "fast-xml-parser": "4.5.4" } },
"overrides": { "fast-xml-parser": "4.5.4" }
```

## Configuration

Every config field is documented in the
[`StarpodConfig` type](./src/utils/config.ts); `defineStarpodConfig`
validates your config and lists every problem with its field path.

- `blurb` — one-line tagline
- `description` — a few sentences about the show
- `hosts` — name, bio, image filename (from `src/img/people/`), and social
  links per host
- `platforms` — links to Apple Podcasts, Spotify, Overcast, Pocket Casts,
  and YouTube
- `rssFeed` — the feed your episodes are read from at build time
- `links` (optional) — extra navigation links after About and Contact, e.g.
  `[{ label: 'Store', href: 'https://example.com/store', icon: 'store' }]`.
  `icon` is one of `external`, `heart`, `link`, `sponsor`, or `store`; it
  defaults to `external` for URLs and `link` for local pages.

## Video

Starpod is video-first with no setup. When an episode's feed item carries a
`<podcast:alternateEnclosure>` with a video or HLS type, its page leads with
the video and offers a Watch / Listen switch; the visitor's choice is
remembered. Episodes without video lead with their artwork and play the
audio enclosure. Playback continues across pages: the video floats into a
mini player when its stage scrolls away or the visitor navigates.

## Integration options

```js
starpod(starpodConfig, {
  // Per-episode guests and sponsors stored in Turso (see Database below).
  database: true,
  // Replace built-in components with your own.
  components: { Hosts: './src/components/MyHosts.astro' },
  // Stylesheets loaded after the built-in ones — override the theme's CSS
  // custom properties here.
  customCss: ['./src/styles/theme.css']
});
```

Overridable components: `Breadcrumbs`, `EpisodeList`, `Hosts`,
`InfoCard`, `LargePlatforms`, `NotFoundContent`, `Platforms`, `ShowArtwork`.

### Overrides in the sidebar

`InfoCard` (the sidebar's links after Episodes), `Platforms` and `Hosts`
also render in the desktop sidebar, where the layout passes them an
optional `anchored` prop. An override can ignore it and render plain
content. The layout keeps everything the sidebar needs on its own
wrappers:

- the "Follow the show" label;
- the anchors that the collapsed sidebar's stacks and flyouts open from;
- making a group unfocusable while it's collapsed.

Without `anchored`, your markup simply lays out in place. When the sidebar
collapses:

- each group keeps to the icon column;
- its stack opens a flyout with your component rendered in full (that
  copy gets no `anchored` prop).

What `anchored` buys: the built-in components use it to make each link,
mark and face a piece on its own anchored slot (anchored-auto-layout's
`data-⚓️-*` attributes). The pieces then glide between the open and
icon sidebar, the follow marks gather into a deck, and the host faces
gather into a co-author stack. The nav links get a sliding highlight and
tooltips in the icon sidebar. See the built-in `Platforms.astro`,
`Hosts.astro` and `InfoCard.astro` for the markup this takes.

For an overriding `InfoCard`, give each link an icon `<svg>` and its label
in a `<span>`, as the built-in does. The icon sidebar then shows the icon
alone and names the link in a tooltip. A link with bare text keeps its
text, cut to the icon column, and is still named by the tooltip.

## Custom pages

Starpod injects the core routes; anything else is a normal Astro page in
your own `src/pages/`, composed from the package's building blocks:

```astro
---
// src/pages/sponsor.astro
import Layout from 'starpod/layout';
---

<Layout title="Sponsor">
  <div class="relative z-10 px-8 lg:px-18">Your pitch here.</div>
</Layout>
```

Supported imports for custom pages: `starpod/layout`,
`starpod/components/AdPackageCard`, and `starpod/rss` (feed data). Link
custom pages from the nav via `links` in your config. See
[whiskey.fm's sponsor page](https://github.com/shipshapecode/starpod/blob/main/src/pages/sponsor.astro)
for a full reference.

## Transcripts

Drop `<episode-number>.md` files into `src/content/transcripts/` and add a
`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { transcriptsLoader } from 'starpod/content';

export const collections = {
  transcripts: defineCollection({ loader: transcriptsLoader() })
};
```

`[HH:MM:SS]` timestamps become clickable and seek the player. Without a
file, Starpod falls back to the transcript referenced by the feed's
`<podcast:transcript>` tag. Write speakers as `[00:01:23] **Name:** text` and
the two most frequent speakers each get their own typeface in the live
transcript beside the player.

## Database (guests & sponsors)

Optional, via [Turso](https://turso.tech) + Drizzle. Enable with
`database: true`, set `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`, point
drizzle-kit at `./node_modules/starpod/src/db/schema.ts`, and seed with your
own data (the scaffolder generates all of this — run
`npx starpod new --database`). When disabled, episode pages simply render
without the guests and sponsors sections.

## Environment variables

| Variable | Used for |
|----------|----------|
| `DISCORD_WEBHOOK` | Contact form submissions (posted to Discord) |
| `ASTRO_DB_REMOTE_URL` | Turso database URL (`database: true` only) |
| `ASTRO_DB_APP_TOKEN` | Turso auth token (`database: true` only) |

## Deployment

Built and tested with the Vercel adapter. On Vercel, pages with markdown
twins are also served via `Accept: text/markdown` content negotiation
(per [acceptmarkdown.com](https://acceptmarkdown.com)) — the integration
patches the build output automatically. On other hosts everything works
except that negotiation; the `.html.md` URLs are always available.

## Testing your site

`starpod/src/*` exposes the package internals for unit tests (the scaffolded
`tsconfig.json` maps it for TypeScript; add the same mapping as a Vitest
alias). Note that `starpod/src/*` is internal API — it can change in any
release. The stable surface is `starpod`, `starpod/config`,
`starpod/content`, `starpod/db`, `starpod/db/schema`, `starpod/layout`,
`starpod/components/AdPackageCard`, and `starpod/rss`.

## License

MIT
