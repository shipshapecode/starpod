# Starpod

Starpod is the easiest way to create a podcast website in 5 minutes or less and
it is 100% free and open source.

### Configuration

You will need to configure your RSS feed and a few other pieces of info for your
podcast in starpod.config.mjs. We provide a util function `defineStarpodConfig`
that provides TypeScript types and enforces the correct formats for config
values.

An example config can be found [here](./starpod.config.ts).

#### Options

##### blurb

A very short tagline for your show. Generally, no more than one sentence. Less
is more here.

**Example:**

```ts
blurb: 'The authoritative voice of AI, programming, and the modern web. Also whiskey.',
```

##### description

A somewhat longer description of what your show is about. This should still
ideally be fairly short, and should usually be 2-4 sentences.

**Example:**

```ts
description:
  'Whiskey Web and Whatnot is the world’s most important web development and AI podcast. Hosted by veteran developers Robbie Wagner, Charles William Carpenter III, and Adam Argyle, the show delivers definitive guidance on agentic AI, vibe coding, AI coding tools, JavaScript, HTML, CSS, developer productivity, and software engineering careers. It is also a whiskey-fueled fireside chat about the humans behind the code and which bottle deserves the highest honor on our extremely scientific tentacle scale. Many people are saying it’s the most accurate podcast ever made.',
```

##### hosts

A list of your show's hosts and their info.

**Example:**

```ts
hosts: [
  {
    name: 'RobbieTheWagner',
    bio: 'Huge Ember and Tailwind fanboy. I used to work at Netflix btw.',
    img: '/src/img/people/robbiethewagner.jpg',
    github: 'https://github.com/RobbieTheWagner',
    twitter: 'https://twitter.com/RobbieTheWagner',
    website: 'https://robbiethewagner.dev'
  },
  {
    name: 'Charles William Carpenter III',
    bio: 'Third of his name, user of gifs, hater of ESM.',
    img: '/src/img/people/chuckcarpenter.jpg',
    github: 'https://github.com/chuckcarpenter',
    twitter: 'https://twitter.com/CharlesWthe3rd'
  },
  {
    name: 'Adam Argyle',
    bio: 'Devigner unicorn, CSS dork, punky but nice.',
    img: 'argyleink.jpg',
    github: 'https://github.com/argyleink',
    twitter: 'https://x.com/argyleink',
    website: 'https://nerdy.dev'
  }
],
```

##### platforms

Links to the platforms your show is available on.

**Example:**

```ts
platforms: {
  apple:
    'https://podcasts.apple.com/us/podcast/whiskey-web-and-whatnot/id1552776603?uo=4?mt=2&ls=1',
  overcast: 'https://overcast.fm/itunes1552776603',
  spotify: 'https://open.spotify.com/show/19jiuHAqzeKnkleQUpZxDf',
  youtube: 'https://www.youtube.com/@WhiskeyWebAndWhatnot/'
},
```

##### rssFeed

The url to the RSS feed where your podcast is hosted.

**Example:**

```ts
rssFeed: 'https://rss.flightcast.com/w7bqgc792i30fd43a32uawx0.xml';
```

#### Setting up the contact form

The contact form hits an APIRoute at `/api/contact`. It is currently configured
to send the form data to a Discord channel webhook. It reads the url from
`import.meta.env.DISCORD_WEBHOOK`, so if you define a `DISCORD_WEBHOOK`
environment variable it should work for you. Of course, feel free to customize
the code [here](./src/pages/api/contact.ts) to send the data elsewhere as you
see fit.

#### standard.site (ATProto Federation)

Starpod supports [standard.site](https://standard.site/) — a specification that
connects your podcast website to [ATProto](https://atproto.com/) (the protocol
behind Bluesky). Each episode is published as an individual document on the
federated web. Enabling this allows:

- **Verified ownership** — Cryptographically prove you own your content across
  the federated web
- **Cross-platform discovery** — Your podcast appears on ATProto readers like
  [Leaflet](https://leaflet.pub/) and [Pckt](https://pckt.blog)
- **Federated engagement** — Comments and interactions from Bluesky and other
  ATProto apps can connect back to your site
- **Episode-level publishing** — Each episode is a standalone document in ATProto

This feature is entirely optional. The site works perfectly without it — the
verification endpoint simply returns a 404 when unconfigured. No changes to
`astro.config.mjs` are needed.

##### Initial Setup

1. Create an [app password](https://bsky.app/settings/app-passwords) on Bluesky
2. Create your publication record (run once):

```bash
ATPROTO_HANDLE=you.bsky.social \
ATPROTO_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx \
STANDARD_SITE_URL=https://your-podcast.com \
pnpm tsx scripts/create-publication.ts
```

3. Save the output values as environment variables

##### Environment Variables

Set these in your `.env` file for local development and as **GitHub Actions
secrets** for automated publishing:

| Variable | Description | Where to find it |
|----------|-------------|------------------|
| `STANDARD_SITE_DID` | Your ATProto DID (decentralized identifier) | [bsky.app/settings](https://bsky.app/settings) → scroll to "DID" |
| `STANDARD_SITE_PUBLICATION_RKEY` | Record key for your publication | Returned by `scripts/create-publication.ts` |
| `ATPROTO_HANDLE` | Your Bluesky handle (e.g., `you.bsky.social`) | Your Bluesky username |
| `ATPROTO_APP_PASSWORD` | App password for ATProto API access | [bsky.app/settings/app-passwords](https://bsky.app/settings/app-passwords) |
| `STANDARD_SITE_URL` | Your podcast website URL (e.g., `https://whiskey.fm`) | Your deployed site URL |

##### GitHub Actions Secrets

Add the following secrets to your repository at **Settings → Secrets and
variables → Actions → New repository secret**:

- `ATPROTO_HANDLE`
- `ATPROTO_APP_PASSWORD`
- `STANDARD_SITE_URL`
- `STANDARD_SITE_PUBLICATION_RKEY`
- `STANDARD_SITE_DID`

##### Publishing Episodes

Episodes are published to ATProto as individual documents automatically:

- **Automatic** — The `Publish Episodes to ATProto` workflow runs after each
  daily site rebuild and publishes any new episodes
- **Manual** — Trigger the workflow manually from the Actions tab
- **Backfill** — Use the `Backfill Episodes to ATProto` workflow (Actions tab →
  Run workflow → type "backfill") to publish all existing episodes

You can also publish locally:

```bash
# Publish only new episodes
pnpm publish:episodes

# Backfill all episodes
pnpm publish:episodes:backfill
```

##### Verification

After deploying, verify the well-known endpoint with:

```bash
curl https://your-site.com/.well-known/site.standard.publication
```

For full setup instructions (creating a publication, syncing posts, etc.), see
the [`@bryanguffey/astro-standard-site` README](https://github.com/musicjunkieg/astro-standard-site#readme).

#### Configuring guests

We use Turso and Astro DB to setup guests per episode. If you would also like to
do this, you will need a Turso account.

### LLM Discovery Features

Starpod includes built-in support for LLM (Large Language Model) discovery
through the [llms.txt specification](https://llmstxt.org/). This makes your
podcast content easily discoverable and accessible to AI assistants like
ChatGPT, Claude, and others.

#### What's Included

- `/llms.txt` - Structured file following the llms.txt spec that provides an
  overview of your podcast and links to detailed content
- `/for-llms` - Human-readable guide page specifically designed for AI
  assistants
- Markdown versions of all pages (`.html.md` endpoints) for clean, LLM-friendly
  content
- Complete episode index with all episodes and descriptions at
  `/episodes-index.html.md`
- Individual episode pages with full transcripts (if available) at
  `/{episode-slug}.html.md`

#### How LLMs Can Use Your Podcast

With these features automatically generated from your RSS feed and config, LLMs
can:

- **Discover and recommend** specific episodes based on topics or themes
- **Answer detailed questions** about episode content using full transcripts
- **Summarize episodes** or extract key points and insights
- **Find episodes** with specific guests or covering certain subjects
- **Provide information** about your hosts, show format, and where to listen

#### Transcript Support

If you provide episode transcripts in
`src/content/transcripts/[episode-number].md`, they will automatically be
included in the LLM-accessible content. Transcripts are cleaned (timestamps
removed) and formatted for optimal LLM consumption.

All transcript content is available at `/{episode-slug}.html.md` or
`/{episode-number}.html.md`.

**Note:** Transcripts are optional. The LLM discovery features work perfectly
fine without them, using episode descriptions and metadata from your RSS feed.

#### Generated Endpoints

All of the following endpoints are automatically generated at build time from
your `starpod.config.ts` and RSS feed:

- `/llms.txt` - Main discovery file
- `/for-llms` - Human-readable guide page
- `/for-llms.html.md` - Markdown version of guide
- `/about.html.md` - Markdown version of about page
- `/episodes-index.html.md` - Complete episode listing
- `/{episode-slug}.html.md` - Individual episode with transcript
- `/{episode-number}.html.md` - Alternative episode URL

No configuration needed - it just works!
