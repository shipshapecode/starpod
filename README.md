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

### Push Notifications

Starpod includes support for native web push notifications to alert subscribers when new episodes are published. The bell icon button appears as the first icon in the "Listen" platforms list when the browser supports push notifications.

#### How It Works

- **Enable Notifications**: Click the bell icon to request permission and subscribe to push notifications
- **Welcome Message**: Immediately receive a welcome notification with the show logo confirming your subscription
- **Disable Notifications**: Click the bell icon again (when enabled) to unsubscribe after confirming
- **Visual Feedback**: The bell icon fills when notifications are enabled, and shows outlined when disabled
- **Rich Notifications**: Episode notifications include episode artwork, full title, and description
- **Browser Support**: The button only appears if the browser supports the Web Push API and Service Workers

#### Features

- **Welcome notification** with brand logo when user subscribes
- **Episode artwork** displayed in push notifications
- **Detailed episode information** including title and description
- **Integrated design** - bell icon is first in the platforms list
- **Stateful behavior** - visual feedback for subscription status

#### Implementation Notes

The current implementation includes:
- Client-side subscription management using the Push API
- Service worker for receiving and displaying notifications (`public/sw.js`)
- Persistent state using Preact signals
- Welcome notification shown immediately after subscription
- Support for episode artwork and detailed content in notifications

**TODO for Production Use:**
1. Configure a VAPID key pair for your application (currently uses a placeholder)
2. Implement server-side API endpoints to:
   - Store push subscriptions when users enable notifications
   - Remove subscriptions when users disable notifications
   - Trigger push notifications when new episodes are published
3. Set up a backend service to monitor your RSS feed and send notifications with episode data

When sending episode notifications from your server, include:
```javascript
{
  title: "New Episode: Episode Title",
  body: "Episode description...",
  icon: "/android-chrome-192x192.png",  // Brand logo
  badge: "/favicon-32x32.png",
  image: "https://cdn.example.com/episode-art.jpg",  // Episode artwork
  url: "/episode-slug",  // Link to episode page
  tag: "new-episode"
}
```

See `src/components/PushNotificationButton.tsx` for TODOs and implementation details.


