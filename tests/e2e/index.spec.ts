import { expect, test } from '@playwright/test';

const indexMeta = {
  title: 'Whiskey Web and Whatnot: Web Development, Neat',
  description:
    /^Veteran web developers RobbieTheWagner, Charles William Carpenter III, and Adam Argyle host this informal, whiskey-fueled fireside chat with your favorite web devs. They discuss all things web development including JavaScript, TypeScript, EmberJS, React, Astro, SolidJS, CSS, HTML, Web3, and more. They take a unique approach and focus on getting to know the human side of developers and their hobbies outside of work, all while sampling a new whiskey that they rate on their unique tentacle scale./,
  image: 'https://assets.flightcast.com/static/fx4npv5dbjrucewh4372wfv9.jpg'
};

test('index page has correct meta', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(indexMeta.title);

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute('content', indexMeta.title);

  const twitterTitle = page.locator('meta[name="twitter:title"]');
  await expect(twitterTitle).toHaveAttribute('content', indexMeta.title);

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', indexMeta.description);

  const ogImage = page.locator('meta[property="og:image"]');
  await expect(ogImage).toHaveAttribute(
    'content',
    `/_image?href=${encodeURIComponent(indexMeta.image)}&w=640&q=75`
  );

  const twitterImage = page.locator('meta[name="twitter:image:src"]');
  await expect(twitterImage).toHaveAttribute(
    'content',
    `/_image?href=${encodeURIComponent(indexMeta.image)}&w=640&q=75`
  );

  const firstEpisodeThumbnail = page.locator(
    '[aria-label="EpisodeList"] li:first-of-type > div > img'
  );
  await expect(firstEpisodeThumbnail).toHaveAttribute(
    'src',
    RegExp('^/_image[?]href=.*w=160&q=75$')
  );
});
