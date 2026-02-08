import { expect, test } from '@playwright/test';

test('episode page has correct meta', async ({ page }) => {
  // Navigate to the main page first to find an episode link
  await page.goto('/');

  const firstEpisodeLink = page.locator(
    '[aria-label="EpisodeList"] li:first-of-type a'
  );
  const href = await firstEpisodeLink.getAttribute('href');

  if (href) {
    await page.goto(href);

    // Verify the episode page has basic meta tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  }
});
