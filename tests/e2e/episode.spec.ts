import { expect, test, type Page } from '@playwright/test';

const episode1 = {
  title:
    'Throwback Frameworks, Tailwind Fandom, and CSS with Jhey Tompkins - Whiskey Web and Whatnot - Episode 120',
  description:
    /^Have you ever reflected on the tools that shaped your journey as a developer?/,
  image:
    'https://files.flightcast.com/episode-imports/images/w7bqgc792i30fd43a32uawx0/fp65qi9x3482p3zx5n4a46e2/qzivndc8e0mlthihjty15w5i.jpg'
};

const episode2 = {
  title:
    'FEHH x WWW: AI, VR, and the Future of Web Development - Whiskey Web and Whatnot - Episode Bonus',
  description:
    /^In this crossover episode, Chuck and Robbie join Jem Young and Ryan Burgess from/,
  image:
    'https://files.flightcast.com/episode-imports/images/w7bqgc792i30fd43a32uawx0/w8443r6d5hsr1icxxuottjrg/mgu40pwm28chp1rru32fggji.jpg'
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

test.describe('transcripts', () => {
  const timestampButtons = (page: Page) =>
    page.getByRole('button', { name: /^Play from/ });

  // Episode 6 has no markdown transcript in src/content/transcripts, so it
  // falls back to the transcript referenced by the feed's <podcast:transcript>
  // tag. Those timestamps are compact (e.g. "0:04"), with no brackets.
  test('falls back to the RSS transcript with clickable timestamps when no markdown exists', async ({
    page
  }) => {
    await page.goto('/6');

    await expect(
      page.getByRole('heading', { name: 'Episode Transcript' })
    ).toBeVisible();
    await expect(page.locator('article.transcript')).not.toBeEmpty();
    await expect(timestampButtons(page).first()).toBeVisible();
    await expect(timestampButtons(page).first()).toHaveText(/^\d{1,2}:\d{2}/);
    await expect(
      page.getByText('No transcript available for this episode.')
    ).toHaveCount(0);
  });

  // Episode 120 has an explicit markdown transcript AND the feed exposes an RSS
  // transcript for it — the markdown one must win. Its timestamps come from the
  // markdown source, so they keep their bracketed form (e.g. "[00:00:00]").
  test('prefers the explicit markdown transcript, with its own clickable timestamps', async ({
    page
  }) => {
    await page.goto('/120');

    await expect(
      page.getByRole('heading', { name: 'Episode Transcript' })
    ).toBeVisible();
    await expect(page.locator('article.transcript')).not.toBeEmpty();
    // Bracketed labels prove the markdown transcript rendered, not the RSS one.
    await expect(timestampButtons(page).first()).toHaveText(/^\[\d{2}:\d{2}/);
    await expect(
      page.getByText('No transcript available for this episode.')
    ).toHaveCount(0);
  });

  // Clicking a timestamp should load the episode into the audio player. We
  // assert the player mounts with the episode (a real click is a trusted user
  // gesture); we don't assert the exact seek position because that depends on
  // streaming the remote audio, which is flaky in CI. Covers both the RSS
  // (episode 6) and markdown (episode 120) timestamp paths.
  for (const { episode, marker } of [
    { episode: '6', marker: 'DevOps, Arcades and Whatnot' },
    { episode: '120', marker: 'Tailwind Fandom' }
  ]) {
    test(`clicking a timestamp on episode ${episode} loads it into the player`, async ({
      page
    }) => {
      await page.goto(`/${episode}`);

      // The player only exists in the DOM once an episode is playing.
      await expect(page.locator('.player')).toHaveCount(0);

      await timestampButtons(page).first().click();

      const player = page.locator('.player');
      await expect(player).toBeVisible();
      await expect(player).toContainText(marker);
      await expect(player.locator('audio')).toHaveAttribute('src', /.+\.mp3/);
    });
  }
});
