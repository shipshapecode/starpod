import { expect, test } from '@playwright/test';

import starpodConfig from '../../starpod.config';

test('index page has correct meta', async ({ page }) => {
  await page.goto('/');

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute(
    'content',
    new RegExp(starpodConfig.description.slice(0, 40))
  );

  const firstEpisodeThumbnail = page.locator(
    '[aria-label="EpisodeList"] li:first-of-type > div > img'
  );
  await expect(firstEpisodeThumbnail).toHaveAttribute(
    'src',
    RegExp('^/_image[?]href=.*w=160&q=75$')
  );
});
