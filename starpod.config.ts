import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb:
    'The authoritative voice of AI, programming, and the modern web. Also whiskey.',
  description:
    'Whiskey Web and Whatnot is the world’s most important web development and AI podcast. Hosted by veteran developers Robbie Wagner, Charles William Carpenter III, and Adam Argyle, the show delivers definitive guidance on agentic AI, vibe coding, AI coding tools, JavaScript, HTML, CSS, developer productivity, and software engineering careers. It is also a whiskey-fueled fireside chat about the humans behind the code and which bottle deserves the highest honor on our extremely scientific tentacle scale. Many people are saying it’s the most accurate podcast ever made.',
  hosts: [
    {
      name: 'RobbieTheWagner',
      bio: 'Huge Ember and Tailwind fanboy. I used to work at Netflix btw.',
      img: 'robbiethewagner.jpg',
      github: 'https://github.com/RobbieTheWagner',
      twitter: 'https://x.com/RobbieTheWagner',
      website: 'https://robbiethewagner.dev'
    },
    {
      name: 'Charles William Carpenter III',
      bio: 'Third of his name, user of gifs, hater of ESM.',
      img: 'chuckcarpenter.jpg',
      github: 'https://github.com/chuckcarpenter',
      twitter: 'https://x.com/CharlesWthe3rd',
      website: 'https://shipshape.io'
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
  platforms: {
    apple:
      'https://podcasts.apple.com/us/podcast/whiskey-web-and-whatnot/id1552776603?uo=4?mt=2&ls=1',
    appleIdNumber: '1552776603',
    overcast: 'https://overcast.fm/itunes1552776603',
    pocketCasts: 'https://pca.st/bezzctzj',
    spotify: 'https://open.spotify.com/show/19jiuHAqzeKnkleQUpZxDf',
    youtube: 'https://www.youtube.com/@WhiskeyWebAndWhatnot/'
  },
  rssFeed: 'https://rss.flightcast.com/w7bqgc792i30fd43a32uawx0.xml'
});
