import { expect, test, type Page } from '@playwright/test';

// Episode 260 has video; episode 120 is audio only.
const VIDEO_EPISODE = '/will-ai-kill-us-all-jev-says-87';

const media = (page: Page) => page.locator('video.starpod-media');
const home = (page: Page) =>
  media(page).evaluate((video) => video.parentElement?.className ?? '');
const playhead = (page: Page) =>
  media(page).evaluate((video) => (video as HTMLVideoElement).currentTime);

// The app's own ready signals, rather than fixed waits: a page is ready
// once its stage controls have hydrated (Astro drops `ssr` from the island),
// and a client-side navigation has arrived when Astro fires astro:page-load.
async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('astro-island:has(.stage-play)').first()).not.toHaveAttribute(
    'ssr',
    { timeout: 30_000 }
  );
}

async function navigateBy(page: Page, link: ReturnType<Page['locator']>) {
  const arrived = page.evaluate(
    () =>
      new Promise<string>((resolve) =>
        document.addEventListener('astro:page-load', () => resolve(location.pathname), {
          once: true
        })
      )
  );
  await link.click();
  return arrived;
}

async function expectPlaying(page: Page) {
  const from = await playhead(page);
  await expect.poll(() => playhead(page), { timeout: 15_000 }).toBeGreaterThan(from);
}

test('the picture leaves its stage for a corner, comes back, moves, expands and keeps playing across pages', async ({
  page
}) => {
  // A long journey: on CI's runners it takes 15–40s.
  test.slow();
  await open(page, VIDEO_EPISODE);
  await page.getByRole('button', { name: /^Play episode 260/ }).first().click();
  await expectPlaying(page);
  await expect.poll(() => home(page)).toBe('stage-slot');

  // Scroll the stage away: the picture flies out to its corner.
  await page.mouse.wheel(0, 1200);
  await expect.poll(() => home(page)).toBe('player-media-frame');
  const picture = page.locator('[data-player-media]');
  await expect(picture).toHaveAttribute('data-station', 'corner');
  await expect(picture).toHaveAttribute('data-corner', 'se');
  await expectPlaying(page);

  // Keyboard: move it round to the next corner, and it remembers.
  await page.getByRole('button', { name: 'Move the picture to the bottom left corner' }).click();
  await expect(picture).toHaveAttribute('data-corner', 'sw');
  expect(await page.evaluate(() => localStorage.getItem('starpod:pip-corner'))).toBe('"sw"');

  // Drag it to the top right and let go: it lands in that corner. Wait for
  // the move above to land first, so the drag starts on the picture.
  const settled = async () => {
    const a = await page.locator('.player-media-box').boundingBox();
    await page.waitForTimeout(150);
    const b = await page.locator('.player-media-box').boundingBox();
    return Math.abs(a!.x - b!.x) + Math.abs(a!.y - b!.y);
  };
  await expect.poll(settled, { timeout: 10_000 }).toBeLessThan(1);
  const box = (await page.locator('.player-media-box').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const viewport = page.viewportSize()!;
  for (let step = 1; step <= 8; step++) {
    await page.mouse.move(
      box.x + box.width / 2 + ((viewport.width * 0.85 - box.x - box.width / 2) * step) / 8,
      box.y + box.height / 2 + ((viewport.height * 0.2 - box.y - box.height / 2) * step) / 8
    );
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await expect(picture).toHaveAttribute('data-corner', 'ne');

  // The island: one element with four homes, chosen by number as in the
  // demo, and published on <html>.
  const island = page.locator('#player');
  await page.keyboard.press('1');
  await expect(island).toHaveAttribute('data-state', 'pill');
  await expect(page.locator('html')).toHaveAttribute('data-island', 'pill');
  await page.keyboard.press('4');
  await expect(island).toHaveAttribute('data-state', 'rail');
  // In the rail it sits inside the sidebar.
  await expect
    .poll(async () => (await island.boundingBox())!.x + (await island.boundingBox())!.width)
    .toBeLessThan(300);

  // Its body opens the card, where the picture docks large and Up next waits.
  await island.locator('.island-name').click();
  await expect(island).toHaveAttribute('data-state', 'card');
  await expect(page.getByRole('heading', { name: 'Up next' })).toBeVisible();
  await expect.poll(() => home(page)).toBe('player-cell-media');

  // A tap on a shelf cover queues it to play next; its cover flies to Up next.
  const shelfCover = island.locator('.tile[data-slot="--slot-s0"]');
  await expect(shelfCover).toBeVisible();
  const queued = await shelfCover.getAttribute('data-id');
  await shelfCover.click();
  await expect(island.locator(`.tile[data-id="${queued}"]`)).toHaveAttribute('data-slot', '--slot-q0');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('starpod:queue')!)[0].id)).toBe(
    queued
  );

  // Escape closes the card back to the home it came from.
  await page.keyboard.press('Escape');
  await expect(island).toHaveAttribute('data-state', 'rail');
  await expect.poll(() => home(page)).toBe('player-media-frame');
  await page.keyboard.press('3');
  await expect(island).toHaveAttribute('data-state', 'dock');

  // Scroll back up: the picture returns to its stage.
  await page.mouse.wheel(0, -5000);
  await expect.poll(() => home(page)).toBe('stage-slot');

  // Navigate away with it playing: it keeps playing, floating in its corner.
  expect(await navigateBy(page, page.locator('a[href="/"]:visible').first())).toBe('/');
  await expect.poll(() => home(page), { timeout: 15_000 }).toBe('player-media-frame');
  await expectPlaying(page);
});

test('an audio episode docks its artwork in the player and plays Up next when it ends', async ({
  page
}) => {
  // Queue an episode from its own page; the queue outlives the visit.
  await open(page, VIDEO_EPISODE);
  await page.getByRole('button', { name: 'Up next' }).click();
  await expect(page.getByRole('button', { name: 'Up next' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );

  await open(page, '/120');
  await page.getByRole('button', { name: /^Play episode 120/ }).first().click();
  await expectPlaying(page);

  // Listening docks by default: the artwork goes to the player bar.
  await page.mouse.wheel(0, 1500);
  await expect.poll(() => home(page)).toBe('player-cell-media');

  // Jump to the end; the queued episode plays next and leaves the queue.
  await media(page).evaluate((video) => {
    const element = video as HTMLVideoElement;
    element.currentTime = element.duration - 1;
  });
  await expect(page.locator('.island-name b')).toContainText('Will AI Kill Us All', {
    timeout: 20_000
  });
  expect(await page.evaluate(() => localStorage.getItem('starpod:queue'))).toBe('[]');
});

test('an episode that ends is not heard again while the next one loads its player', async ({
  page,
  browserName
}) => {
  // Where HLS is not native (Firefox, for one) the next video waits for
  // hls.js. Stand in for such a browser and hold that import back.
  test.skip(browserName === 'webkit', 'WebKit plays HLS itself and never loads hls.js');
  await page.addInitScript(() => {
    const can = HTMLMediaElement.prototype.canPlayType;
    HTMLMediaElement.prototype.canPlayType = function (type: string) {
      return /mpegurl/i.test(type) ? '' : can.call(this, type);
    };
    localStorage.setItem('starpod:medium', 'watch');
  });
  await page.route(/hls/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await route.continue();
  });

  await open(page, VIDEO_EPISODE);
  await page.getByRole('button', { name: 'Up next' }).click();
  await open(page, '/120');
  await page.getByRole('button', { name: /^Play episode 120/ }).first().click();
  await expectPlaying(page);

  const audio = await media(page).evaluate((video) => (video as HTMLVideoElement).currentSrc);
  await media(page).evaluate((video) => {
    const element = video as HTMLVideoElement;
    element.currentTime = element.duration - 1;
  });
  await expect(page.locator('.island-name b')).toContainText('Will AI Kill Us All', { timeout: 20_000 });
  // While hls.js loads, the finished episode's audio does not start over.
  for (let i = 0; i < 8; i++) {
    const replaying = await media(page).evaluate(
      (video, audio) => !(video as HTMLVideoElement).paused && (video as HTMLVideoElement).currentSrc === audio,
      audio
    );
    expect(replaying).toBe(false);
    await page.waitForTimeout(250);
  }
  // Then the next episode plays.
  await expectPlaying(page);
});

test("a new episode played from its hero starts on its own stage, not from another's picture", async ({
  page
}) => {
  await open(page, VIDEO_EPISODE);
  await page.locator('.stage-play').click();
  await expectPlaying(page);
  // The next episode's page, with this one still playing in its corner.
  await navigateBy(page, page.locator('a.ep-pager-link').first());
  await expect(page.locator('astro-island:has(.stage-play)').first()).not.toHaveAttribute('ssr');
  const picture = page.locator('[data-player-media]');
  await expect(picture).toHaveAttribute('data-station', 'corner');
  await expect(picture).not.toHaveAttribute('data-parked');
  // Let it land in its corner first.
  const at = async () => JSON.stringify(await picture.locator('> *').first().boundingBox());
  let last = '';
  await expect.poll(async () => last === (last = await at()), { timeout: 10_000 }).toBe(true);
  const corner = (await picture.locator('> *').first().boundingBox())!;
  // And let the page change finish: until then the page under it takes no clicks.
  await page.waitForFunction(
    () =>
      !document
        .getAnimations()
        .some((a) => (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith('::view-transition'))
  );

  await page.evaluate(() => {
    const frames: Array<[boolean, number, number, number, number]> = ((
      window as unknown as { flight: typeof frames }
    ).flight = []);
    const start = performance.now();
    const tick = () => {
      const outer = document.querySelector<HTMLElement>('[data-player-media]')!;
      const box = outer.firstElementChild!.getBoundingClientRect();
      frames.push([outer.hasAttribute('data-parked'), box.left, box.top, box.width, box.height]);
      if (performance.now() - start < 2000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.locator('.stage[data-variant="page"] .stage-play').click();
  await expect.poll(() => home(page)).toBe('stage-slot');
  await page.waitForTimeout(2100);
  // Every frame the floating box still shows, it is where it was: nothing
  // flies up from the corner, and nothing grows from its size.
  const frames = await page.evaluate(
    () => (window as unknown as { flight: Array<[boolean, number, number, number, number]> }).flight
  );
  for (const [parked, x, y, width] of frames) {
    if (!parked) {
      expect(Math.abs(x - corner.x)).toBeLessThan(1);
      expect(Math.abs(y - corner.y)).toBeLessThan(1);
      expect(Math.abs(width - corner.width)).toBeLessThan(1);
    }
  }
});

test('flies back to its own stage from its corner after a client-side navigation', async ({
  page
}) => {
  await open(page, VIDEO_EPISODE);
  await page.locator('.stage-play').click();
  await expectPlaying(page);
  await navigateBy(page, page.locator('a[href="/about"]:visible').first());
  await expect(page.locator('[data-player-media]')).toHaveAttribute('data-station', 'corner');

  await page.evaluate(() => {
    const frames: Array<number[]> = ((window as unknown as { flight: Array<number[]> }).flight = []);
    const start = performance.now();
    const tick = () => {
      const box = document.querySelector('[data-player-media]')!.firstElementChild!.getBoundingClientRect();
      frames.push([box.left, box.top, box.width, box.height]);
      if (performance.now() - start < 8000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  // The floating picture's bar names its episode and links to it.
  await navigateBy(page, page.locator('.pip-title'));
  // It lands on its slot…
  const slot = page.locator('.stage[data-current] [data-media-slot]');
  await expect
    .poll(
      async () => {
        const [box, target] = await Promise.all([
          page.locator('[data-player-media] > *').first().boundingBox(),
          slot.boundingBox()
        ]);
        return box && target ? Math.max(Math.abs(box.x - target.x), Math.abs(box.y - target.y)) : Infinity;
      },
      { timeout: 10_000 }
    )
    .toBeLessThan(2);
  // …and no frame on the way left the screen (a target measured before the
  // stage was marked current sent the picture thousands of pixels away).
  const frames = await page.evaluate(() => (window as unknown as { flight: Array<number[]> }).flight);
  for (const [, top, width] of frames) {
    expect(top).toBeGreaterThan(-60);
    expect(width).toBeGreaterThan(0);
  }
});

test('a queued cover dragged onto another slot reorders Up next', async ({ page }) => {
  await open(page, VIDEO_EPISODE);
  await page.locator('.stage-play').click();
  await expectPlaying(page);
  const island = page.locator('#player');
  await page.keyboard.press('2');
  await expect(island).toHaveAttribute('data-state', 'card');

  // Queue two from the shelf: each tap puts its cover first in Up next.
  const shelfCover = island.locator('.tile[data-slot="--slot-s0"]');
  const second = await shelfCover.getAttribute('data-id');
  await shelfCover.click();
  await expect(island.locator(`.tile[data-id="${second}"]`)).toHaveAttribute('data-slot', '--slot-q0');
  const first = await shelfCover.getAttribute('data-id');
  await shelfCover.click();
  await expect(island.locator(`.tile[data-id="${first}"]`)).toHaveAttribute('data-slot', '--slot-q0');
  await expect(island.locator(`.tile[data-id="${second}"]`)).toHaveAttribute('data-slot', '--slot-q1');
  // Let the covers land before taking hold of one.
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => (animation.effect as KeyframeEffect)?.target?.closest('.tile'))
            .length
      )
    )
    .toBe(0);

  // Drag the second by its art, with real pointer moves, onto the first's
  // slot (Up next scrolled back into view: the taps scrolled to the shelf).
  await island.locator('.board-next').evaluate((tray) => tray.scrollIntoView({ block: 'nearest' }));
  const from = (await island.locator(`.tile[data-id="${second}"] .tile-face`).boundingBox())!;
  const to = (await island.locator('.slot[data-slot="--slot-q0"]').boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await expect(island.locator(`.tile[data-id="${second}"]`)).toHaveAttribute('data-held', '');
  await page.mouse.up();

  await expect(island.locator(`.tile[data-id="${second}"]`)).toHaveAttribute('data-slot', '--slot-q0');
  await expect(island.locator(`.tile[data-id="${first}"]`)).toHaveAttribute('data-slot', '--slot-q1');
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('starpod:queue')!).map((episode: { id: string }) => episode.id)
    )
  ).toEqual([second, first]);
});
