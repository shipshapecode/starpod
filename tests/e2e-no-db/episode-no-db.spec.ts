import { expect, test } from '@playwright/test';

const episode1 = {
  title:
    'Throwback Frameworks, Tailwind Fandom, and CSS with Jhey Tompkins - Whiskey Web and Whatnot: Web Development, Neat - Episode 120',
  description:
    /^Have you ever reflected on the tools that shaped your journey as a developer?/,
  image:
    'https://play.cdnstream1.com/zjb/image/download/d6/c4/9e/d6c49e16-ed89-45f9-b5d4-60dac61e44b0_1400.jpg'
};

test('episode page works without astro:db sections', async ({ page }) => {
  await page.goto('/120');

  // Core episode content should always be present
  await expect(page.locator('h1')).toContainText('120:');
  await expect(page.locator('h3:has-text("Show Notes")')).toBeVisible();
  await expect(page.locator('h3:has-text("Episode Transcript")')).toBeVisible();

  // The page should load successfully
  await expect(page).toHaveTitle(episode1.title);
});

test('hosts and guests section should not appear without astro:db', async ({
  page
}) => {
  await page.goto('/120');

  // Check that the "Creators and Guests" section does NOT exist
  const creatorsSection = page.locator('h3:has-text("Creators and Guests")');
  await expect(creatorsSection).not.toBeVisible();
});

test('sponsors section should not appear without astro:db', async ({
  page
}) => {
  await page.goto('/120');

  // Check that the "Sponsors" section does NOT exist
  const sponsorsSection = page.locator('h3:has-text("Sponsors")');
  await expect(sponsorsSection).not.toBeVisible();
});

test('episode page meta data works without astro:db', async ({ page }) => {
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
