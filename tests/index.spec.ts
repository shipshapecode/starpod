import { expect, test } from '@playwright/test';

const indexMeta = {
  title: 'Whiskey Web and Whatnot: Web Development, Neat',
  description:
    /^Veteran web developers RobbieTheWagner and Charles William Carpenter III host this informal, whiskey-fueled fireside chat with your favorite web devs/,
  image:
    'https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/38011720/b40498aacdad2076.png'
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
  await expect(ogImage).toHaveAttribute('content', indexMeta.image);

  const twitterImage = page.locator('meta[name="twitter:image:src"]');
  await expect(twitterImage).toHaveAttribute('content', indexMeta.image);
});
