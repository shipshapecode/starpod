import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb: 'Your podcast tagline goes here.',
  description:
    'A brief description of your podcast. Tell listeners what your show is about, who hosts it, and what topics you cover.',
  hosts: [
    {
      name: 'Jane Smith',
      bio: 'Host bio goes here.',
      img: 'avatar-light.png',
      github: 'https://github.com',
      twitter: 'https://x.com',
      website: 'https://example.com'
    },
    {
      name: 'John Doe',
      bio: 'Co-host bio goes here.',
      img: 'avatar-light.png',
      github: 'https://github.com',
      twitter: 'https://x.com',
      website: 'https://example.com'
    }
  ],
  platforms: {
    apple: 'https://podcasts.apple.com/us/podcast/your-podcast/id0000000000',
    spotify: 'https://open.spotify.com/show/your-show-id',
    youtube: 'https://www.youtube.com/@YourPodcast'
  },
  rssFeed: 'https://your-podcast-rss-feed-url.com/feed.xml'
});
