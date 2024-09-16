import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb: 'A whiskey fueled fireside chat with your favorite web developers.',
  description:
    'Veteran web developers RobbieTheWagner and Charles William Carpenter III host this informal, whiskey-fueled fireside chat with your favorite web devs. They discuss all things web development including JavaScript, TypeScript, EmberJS, React, Astro, SolidJS, CSS, HTML, Web3, and more. They take a unique approach and focus on getting to know the human side of developers and their hobbies outside of work, all while sampling a new whiskey that they rate on their unique tentacle scale.',
  hosts: [
    {
      name: 'RobbieTheWagner',
      bio: 'Huge Ember and Tailwind fanboy. I work at Amazon btw.',
      img: 'robbiethewagner.jpg',
      github: 'https://github.com/RobbieTheWagner',
      twitter: 'https://twitter.com/RobbieTheWagner',
      website: 'https://robbiethewagner.dev'
    },
    {
      name: 'Charles William Carpenter III',
      bio: 'Third of his name, user of gifs, hater of ESM.',
      img: 'chuckcarpenter.jpg',
      github: 'https://github.com/chuckcarpenter',
      twitter: 'https://twitter.com/CharlesWthe3rd'
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
  rssFeed: 'https://anchor.fm/s/e329dea0/podcast/rss'
});
