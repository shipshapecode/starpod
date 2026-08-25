# Your Starpod site

A podcast website powered by [Starpod](https://github.com/shipshapecode/starpod),
an Astro integration that turns an RSS feed into a full site: episode pages,
transcripts with clickable timestamps, search, an audio player, LLM-friendly
markdown twins of every page, and an OpenAPI-documented JSON API.

## Commands

- `pnpm dev` — start the dev server on localhost:4321
- `pnpm build` — type-check and build for production
- `pnpm preview` — preview the production build

## Configure your show

Everything starts in `starpod.config.ts`: title blurb, description, hosts, and
the RSS feed URL. The site rebuilds its episode pages from the feed on every
build.

- **Host photos** go in `src/img/people/` and are referenced by filename from
  the `hosts` array in `starpod.config.ts`. A placeholder avatar is shown for
  any missing photo.
- **Favicons** and other static files go in `public/`.
- **Transcripts**: drop `<episode-number>.md` files into
  `src/content/transcripts/`. `[HH:MM:SS]` timestamps become clickable and
  seek the player. Without a file, the site falls back to the transcript
  referenced by the feed's `<podcast:transcript>` tag.

## Options

Pass options as the second argument to `starpod()` in `astro.config.mjs`:

- `database: true` — per-episode guests and sponsors stored in
  [Turso](https://turso.tech) (see `.env.example`). When off, those sections
  simply don't render.
- `components: { Hosts: './src/components/MyHosts.astro' }` — replace built-in
  components with your own. Overridable: Dots, EpisodeList, Hosts, InfoCard,
  LargePlatforms, NotFoundContent, Platforms, ShowArtwork.
- `customCss: ['./src/styles/theme.css']` — stylesheets loaded after the
  built-in styles, for theming via CSS custom properties.

## Writing your own tests

The `tsconfig.json` maps `starpod/src/*` to the package source, so unit tests
can import any engine module directly, e.g.
`import { getAllEpisodes } from 'starpod/src/lib/rss';`. If you use Vitest,
add the same mapping as a `resolve.alias` entry in `vitest.config.ts`.
