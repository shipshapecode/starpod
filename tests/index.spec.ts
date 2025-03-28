import { expect, test } from '@playwright/test';

const indexMeta = {
  title: 'Whiskey Web and Whatnot: Web Development, Neat',
  description:
    /^Veteran web developers RobbieTheWagner and Charles William Carpenter III host this informal, whiskey-fueled fireside chat with your favorite web devs/,
  image:
    'https://image.simplecastcdn.com/images/52773714-0345-45e1-b421-a089414e7921/379e24dd-059a-4c09-aa37-8ed48fcaadac/3000x3000/b40498aacdad2076.png?aid=rss_feed'
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
