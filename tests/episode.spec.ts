import { expect, test } from '@playwright/test';

const episode1 = {
  title:
    'Throwback Frameworks, Tailwind Fandom, and CSS with Jhey Tompkins - Whiskey Web and Whatnot: Web Development, Neat - Episode 120',
  description:
    /^Have you ever reflected on the tools that shaped your journey as a developer?/,
  image:
    'https://content.production.cdn.art19.com/images/e9/7a/78/16/e97a7816-1ca2-4fcd-8409-1a02e316b81a/03e2640740b7dea50ee910533c52edd18c88e77189b1ebbbde4e2af3558df57d0e2f4153148176d1f748fd8585ca7f4c6107adaaf585712da966012f033c6603.jpeg'
};

const episode2 = {
  title:
    'FEHH x WWW: AI, VR, and the Future of Web Development - Whiskey Web and Whatnot: Web Development, Neat - Episode Bonus',
  description:
    /^In this crossover episode, Chuck and Robbie join Jem Young and Ryan Burgess from/,
  image:
    'https://content.production.cdn.art19.com/images/2c/b5/34/ed/2cb534ed-fda4-4af2-84b0-f95365ea53d3/b7880054d69de3799ab4a66c709bbd0d6076b8066c9bf82e558f54a153bea321ae8623f681f4a454dc911c92209e676833daf42c4f9f61bfdc1b7189d3c3f158.jpeg'
};

test('works with episode numbers', async ({ page }) => {
  await page.goto('/120');

  await expect(page).toHaveTitle(episode1.title);

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute('content', episode1.title);

  const twitterTitle = page.locator('meta[name="twitter:title"]');
  await expect(twitterTitle).toHaveAttribute('content', episode1.title);

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', episode1.description);

  const ogImage = page.locator('meta[property="og:image"]');
  await expect(ogImage).toHaveAttribute('content', episode1.image);

  const twitterImage = page.locator('meta[name="twitter:image:src"]');
  await expect(twitterImage).toHaveAttribute('content', episode1.image);
});

test('works with episode slugs', async ({ page }) => {
  await page.goto(
    '/throwback-frameworks-tailwind-fandom-and-css-with-jhey-tompkins'
  );

  await expect(page).toHaveTitle(episode1.title);

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute('content', episode1.title);

  const twitterTitle = page.locator('meta[name="twitter:title"]');
  await expect(twitterTitle).toHaveAttribute('content', episode1.title);

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', episode1.description);

  const ogImage = page.locator('meta[property="og:image"]');
  await expect(ogImage).toHaveAttribute('content', episode1.image);

  const twitterImage = page.locator('meta[name="twitter:image:src"]');
  await expect(twitterImage).toHaveAttribute('content', episode1.image);
});

test('works for bonus episodes with no episode number', async ({ page }) => {
  await page.goto('/fehh-x-www-ai-vr-and-the-future-of-web-development');

  await expect(page).toHaveTitle(episode2.title);

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute('content', episode2.title);

  const twitterTitle = page.locator('meta[name="twitter:title"]');
  await expect(twitterTitle).toHaveAttribute('content', episode2.title);

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute('content', episode2.description);

  const ogImage = page.locator('meta[property="og:image"]');
  await expect(ogImage).toHaveAttribute('content', episode2.image);

  const twitterImage = page.locator('meta[name="twitter:image:src"]');
  await expect(twitterImage).toHaveAttribute('content', episode2.image);
});
