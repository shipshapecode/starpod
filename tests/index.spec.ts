import { expect, test } from '@playwright/test';

const indexMeta = {
  title: 'Whiskey Web and Whatnot: Web Development, Neat',
  description:
    /^Veteran web developers RobbieTheWagner and Charles William Carpenter III host this informal, whiskey-fueled fireside chat with your favorite web devs/,
  image:
    'https://content.production.cdn.art19.com/images/68/ab/83/a8/68ab83a8-c791-4d25-bca6-c0c7e2b16306/6b4c27783b4d53afdc6b82c0d44991f8fac363f181cbc7e6905933cf064b5831271186d9efe568d4bf138e059dc9195f6143993ceab5288c21e5ef47ee532e5f.jpeg'
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
