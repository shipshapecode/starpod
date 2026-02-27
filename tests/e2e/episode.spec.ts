import { expect, test } from '@playwright/test';

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

test('displays hosts and guests when astro:db is available', async ({
  page
}) => {
  await page.goto('/120');

  // Check if the "Creators and Guests" section exists
  const creatorsSection = page.locator('h3:has-text("Creators and Guests")');
  await expect(creatorsSection).toBeVisible();

  // Check if at least one host/guest is displayed in the grid
  const hostGuestGrid = page.locator(
    'h3:has-text("Creators and Guests") + div'
  );
  await expect(hostGuestGrid).toBeVisible();

  // Check that there are actual host/guest items
  const hostGuestItems = page.locator(
    'h3:has-text("Creators and Guests") + div > div'
  );
  await expect(hostGuestItems.first()).toBeVisible();
});

test('displays sponsors when astro:db is available', async ({ page }) => {
  await page.goto('/120');

  // Check if the "Sponsors" section exists
  const sponsorsSection = page.locator('h3:has-text("Sponsors")');
  await expect(sponsorsSection).toBeVisible();

  // Check if at least one sponsor is displayed in the grid
  const sponsorGrid = page.locator('h3:has-text("Sponsors") + div');
  await expect(sponsorGrid).toBeVisible();

  // Check that there are actual sponsor items
  const sponsorItems = page.locator('h3:has-text("Sponsors") + div > a');
  await expect(sponsorItems.first()).toBeVisible();
});
