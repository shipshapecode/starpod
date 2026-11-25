import { expect, test, type Page } from '@playwright/test';

// The player on a phone's screen (the site's phone query: up to 767px wide,
// or a landscape screen up to 500px tall).
test.use({ viewport: { width: 393, height: 659 }, hasTouch: true });

// Episode 260 has video and a transcript of seek chips.
const VIDEO_EPISODE = '/will-ai-kill-us-all-jev-says-87';

const media = (page: Page) => page.locator('video.starpod-media');
const home = (page: Page) => media(page).evaluate((video) => video.parentElement?.className ?? '');

async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('astro-island:has(.stage-play)').first()).not.toHaveAttribute('ssr', {
    timeout: 30_000
  });
}

async function play(page: Page) {
  await page.locator('.stage[data-variant="page"] .stage-play').click();
  const from = await media(page).evaluate((video) => (video as HTMLVideoElement).currentTime);
  await expect
    .poll(() => media(page).evaluate((video) => (video as HTMLVideoElement).currentTime), { timeout: 15_000 })
    .toBeGreaterThan(from);
}

test("the picture plays in the dock, clear of the transcript's seek chips", async ({ page }) => {
  await open(page, VIDEO_EPISODE);
  await play(page);
  // Reading the transcript, the stage has scrolled away: the picture goes
  // to the dock rather than floating over the page.
  await page.evaluate(() =>
    document.querySelector('article.transcript')!.scrollIntoView({ block: 'start' })
  );
  await expect.poll(() => home(page)).toBe('player-cell-media');
  // No seek chip on screen above the dock is under the picture (the page's
  // own sticky chrome may cover one at the top; the player may not).
  const covered = await page.evaluate(() => {
    const dockTop = document.getElementById('player')!.getBoundingClientRect().top;
    return [...document.querySelectorAll<HTMLElement>('article.transcript .seek-chip')]
      .map((chip) => chip.getBoundingClientRect())
      .filter((box) => box.top > 0 && box.bottom < dockTop)
      .map((box) => document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2))
      .filter((hit) => hit?.closest('.player-air, #player')).length;
  });
  expect(covered).toBe(0);
});

test('the card closes from its visible close, and from a swipe down its top', async ({ page }) => {
  await open(page, VIDEO_EPISODE);
  await play(page);
  const island = page.locator('#player');
  await island.locator('.island-name').click();
  await expect(island).toHaveAttribute('data-state', 'card');
  // No home control on a phone: the card's own close stands in for it.
  await expect(island.getByRole('radiogroup', { name: 'Player home' }).first()).toBeHidden();
  const close = page.getByRole('button', { name: 'Close the now-playing card', exact: true });
  await expect(close).toBeVisible();
  await expect(close).toBeFocused();
  const box = (await close.boundingBox())!;
  expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
  await close.click();
  await expect(island).toHaveAttribute('data-state', 'dock');

  await island.locator('.island-name').click();
  await expect(island).toHaveAttribute('data-state', 'card');
  // Once it has landed (the journey takes under a second).
  await expect(island).not.toHaveAttribute('data-moving');
  const strip = (await island.locator('.island-grab').boundingBox())!;
  const x = strip.x + strip.width / 2;
  await page.mouse.move(x, strip.y + 10);
  await page.mouse.down();
  for (let step = 1; step <= 10; step++) {
    await page.mouse.move(x, strip.y + 10 + step * 40);
  }
  await page.mouse.up();
  await expect(island).toHaveAttribute('data-state', 'dock');
});

test("a queued episode's remove shows on a touch screen, off its cover", async ({ page }) => {
  await open(page, VIDEO_EPISODE);
  await play(page);
  const island = page.locator('#player');
  await island.locator('.island-name').click();
  await expect(island).not.toHaveAttribute('data-moving');
  const cover = island.locator('.tile[data-slot="--slot-s0"]');
  await expect(cover).toBeVisible({ timeout: 15_000 });
  const queued = await cover.getAttribute('data-id');
  await cover.locator('.tile-hit').click();
  const row = island.locator('.board-row').first();
  const remove = row.getByRole('button', { name: /^Remove .+ from Up next$/ });
  // Shown without hover, 44px, and clear of the cover (a tap there plays it).
  await expect(remove).toBeVisible();
  const box = (await remove.boundingBox())!;
  expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
  const art = (await island.locator(`.tile[data-id="${queued}"] .tile-face`).boundingBox())!;
  expect(box.x >= art.x + art.width || box.y >= art.y + art.height).toBe(true);
  await remove.click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('starpod:queue')!).length)).toBe(0);
});
