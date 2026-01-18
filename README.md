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

## Polar.sh Checkout Integration

This site uses Polar.sh for sponsor checkout. To set it up:

1. **Get your Polar credentials:**
   - Log in to your [Polar dashboard](https://polar.sh)
   - Go to Settings → API to get your access token
   - Create two products for your sponsorship packages (30-second and 60-second
     ads)
   - Note the product IDs from each product's page

2. **Configure environment variables:** Create a `.env` file in the root
   directory with:

   ```env
   POLAR_ACCESS_TOKEN=your_polar_access_token_here
   POLAR_30SEC_PRODUCT_ID=your_30sec_product_id_here
   POLAR_60SEC_PRODUCT_ID=your_60sec_product_id_here
   POLAR_BOTTLEDROP_PRODUCT_ID=your_bottledrop_product_id_here
   POLAR_CRATE_PRODUCT_ID=your_crate_product_id_here
   POLAR_FULLBARREL_PRODUCT_ID=your_fullbarrel_product_id_here
   POLAR_LABEL_PRODUCT_ID=your_label_product_id_here
   POLAR_SUCCESS_URL=https://whiskey.fm/sponsor/success
   ```

3. **Test the integration:**
   - For testing, you can set `PUBLIC_POLAR_SERVER=sandbox` in your `.env`
   - Visit `/sponsor` and click on either sponsorship option
   - You'll be redirected to Polar's checkout page
   - After successful payment, users return to `/sponsor/success`

4. **Go live:**
   - Remove `PUBLIC_POLAR_SERVER` or set it to `production`
   - Ensure your product IDs are for production products
   - Test with a real payment to confirm everything works

The integration uses the `@polar-sh/astro` package which provides:

- Server-side checkout session creation at `/api/checkout`
- Automatic tax compliance through Polar's Merchant of Record service
- Support for multiple products and dynamic pricing
