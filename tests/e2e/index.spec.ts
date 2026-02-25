import { expect, test } from '@playwright/test';

const indexMeta = {
  title: 'Whiskey Web and Whatnot',
  description:
    /^Whiskey Web and Whatnot is the world’s most important web development and AI podcast. Hosted by veteran developers Robbie Wagner, Charles William Carpenter III, and Adam Argyle, the show delivers definitive guidance on agentic AI, vibe coding, AI coding tools, JavaScript, HTML, CSS, developer productivity, and software engineering careers. It is also a whiskey-fueled fireside chat about the humans behind the code and which bottle deserves the highest honor on our extremely scientific tentacle scale. Many people are saying it’s the most accurate podcast ever made./,
  image:
    'https://assets.flightcast.com/workspaces/w3c9dshmqkhqsgbaue0txwq5/podcasts/w7bqgc792i30fd43a32uawx0/fx4npv5dbjrucewh4372wfv9.jpg'
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

  const twitterCard = page.locator('meta[name="twitter:card"]');
  await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');

  const firstEpisodeThumbnail = page.locator(
    '[aria-label="EpisodeList"] li:first-of-type > div > img'
  );
  await expect(firstEpisodeThumbnail).toHaveAttribute(
    'src',
    RegExp('^/_image[?]href=.*w=160&q=75$')
  );
  await expect(firstEpisodeThumbnail).toHaveAttribute('loading', 'eager');
  await expect(firstEpisodeThumbnail).toHaveAttribute('fetchpriority', 'high');

  const secondEpisodeThumbnail = page.locator(
    '[aria-label="EpisodeList"] li:nth-of-type(2) > div > img'
  );
  await expect(secondEpisodeThumbnail).toHaveAttribute('loading', 'lazy');
});
