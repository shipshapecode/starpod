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
blurb: 'Your podcast tagline goes here.',
```

##### description

A somewhat longer description of what your show is about. This should still
ideally be fairly short, and should usually be 2-4 sentences.

**Example:**

```ts
description:
  'A brief description of your podcast. Tell listeners what your show is about, who hosts it, and what topics you cover.',
```

##### hosts

A list of your show's hosts and their info.

**Example:**

```ts
hosts: [
  {
    name: 'Jane Smith',
    bio: 'Host bio goes here.',
    img: 'avatar-light.png',
    github: 'https://github.com/janesmith',
    twitter: 'https://x.com/janesmith',
    website: 'https://janesmith.dev'
  },
  {
    name: 'John Doe',
    bio: 'Co-host bio goes here.',
    img: 'avatar-light.png',
    github: 'https://github.com/johndoe',
    twitter: 'https://x.com/johndoe'
  }
],
```

##### platforms

Links to the platforms your show is available on.

**Example:**

```ts
platforms: {
  apple:
    'https://podcasts.apple.com/us/podcast/your-podcast/id0000000000',
  spotify: 'https://open.spotify.com/show/your-show-id',
  youtube: 'https://www.youtube.com/@YourPodcast'
},
```

##### rssFeed

The url to the RSS feed where your podcast is hosted.

**Example:**

```ts
rssFeed: 'https://your-podcast-rss-feed-url.com/feed.xml';
```

#### Setting up the contact form

The contact form hits an APIRoute at `/api/contact`. It is currently configured
to send the form data to a Slack channel webhook I had setup. It reads the url
from `import.meta.env.SLACK_WEBHOOK`, so if you define a `SLACK_WEBHOOK`
environment variable it should work for you. Of course, feel free to customize
the code [here](./src/pages/api/contact.ts) to send the data elsewhere as you
see fit.

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
