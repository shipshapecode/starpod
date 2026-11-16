import { expect, test, type Page } from '@playwright/test';

// The collapsible rail, its names and flyouts, and the search palette.

const rail = (page: Page) => page.locator('.rail');
const toggle = (page: Page) => page.locator('.rail-toggle');
const state = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.rail);
// The search island owns ⌘K; it drops its ssr attribute once hydrated.
const hydrated = (page: Page) =>
  page.waitForSelector(
    'astro-island[component-url*="SearchDialog"]:not([ssr])',
    {
      state: 'attached'
    }
  );
// Wait for the rail's pieces to land before pointing at them. (Only the
// rail's own transitions: scroll-driven animations elsewhere always run.)
// A click or a release settles in the next frame, so wait two first.
const settled = async (page: Page) => {
  await page.evaluate(
    () =>
      new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done))
      )
  );
  await page.waitForFunction(() =>
    document
      .querySelector('.rail')!
      .getAnimations({ subtree: true })
      .every((animation) => animation.playState !== 'running')
  );
};
// The page column the rail holds open, at rest.
const railWidth = (page: Page) =>
  page.evaluate(
    () =>
      getComputedStyle(
        document.querySelector('.app')!
      ).gridTemplateColumns.split(' ')[0]
  );
const divider = (page: Page) =>
  page.getByRole('separator', { name: 'Resize sidebar' });
const anchors = (page: Page) =>
  page.evaluate(() =>
    CSS.supports('anchor-name', 'attr(data-a type(<custom-ident>))')
  );
// Plain anchor positioning, which places the flyouts and the tooltip even
// where typed attr() is missing (WebKit).
const placeable = (page: Page) =>
  page.evaluate(() => CSS.supports('anchor-name', '--a'));
// Where the divider is drawn, transforms included.
const edgeX = (page: Page) =>
  page.evaluate(() =>
    Math.round(document.querySelector('.rail-edge')!.getBoundingClientRect().x)
  );

test.describe('desktop rail', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('collapses to an icon rail and expands again', async ({ page }) => {
    await page.goto('/');
    expect(await state(page)).toBe('expanded');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
    expect(await railWidth(page)).toBe('272px');

    await toggle(page).click();
    await expect.poll(() => state(page)).toBe('collapsed');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    expect(await railWidth(page)).toBe('72px');
    await expect
      .poll(async () => (await rail(page).boundingBox())?.width)
      .toBe(72);
    // Every nav link is still there, as a named icon.
    await expect(
      page.locator('.rail-nav').getByRole('link', { name: 'About' })
    ).toBeVisible();

    await toggle(page).click();
    await expect.poll(() => state(page)).toBe('expanded');
    await expect
      .poll(async () => (await rail(page).boundingBox())?.width)
      .toBe(272);
  });

  test('keeps its icons on the line the art, headers and faces share', async ({
    page
  }) => {
    // The inline-start edge, or the centre, of everything a selector finds.
    const xs = (selector: string, at: 'start' | 'centre') =>
      page.evaluate(
        ([selector, at]) =>
          [...document.querySelectorAll(selector)].map((el) => {
            const box = el.getBoundingClientRect();
            return at === 'start' ? box.left : box.left + box.width / 2;
          }),
        [selector, at] as const
      );
    const spread = (values: number[]) =>
      Math.max(...values) - Math.min(...values);

    await page.goto('/');
    await settled(page);
    // Open, the icons start on the column's line, not their pills (which
    // reach past it so the fills have room).
    const open = await xs(
      [
        '.rail-art',
        '.rail-title',
        '.rail-search .search-trigger > svg',
        '.rail-nav .rail-slot > a > svg',
        '.rail .rail-label',
        '.rail .platforms > .platform-item:first-child .platform-icon',
        '.rail-host:first-child .person-face'
      ].join(', '),
      'start'
    );
    expect(open.length).toBeGreaterThanOrEqual(9);
    expect(spread(open)).toBeLessThanOrEqual(0.5);

    // Collapsed, they share one centre line instead.
    await toggle(page).click();
    await expect.poll(() => state(page)).toBe('collapsed');
    await settled(page);
    const icons = await xs(
      [
        '.rail-art',
        '.rail-toggle',
        '.rail-search .search-trigger > svg',
        '.rail-nav .rail-slot > a > svg',
        '.rail .platforms .platform',
        '.rail-host .person-face'
      ].join(', '),
      'centre'
    );
    expect(spread(icons)).toBeLessThanOrEqual(0.5);
  });

  test('is held by a divider you can drag, throw, double-click and step', async ({
    page,
    browserName
  }) => {
    await page.goto('/');
    await hydrated(page);
    const edge = divider(page);
    await expect(edge).toHaveAttribute('aria-valuenow', '272');
    await expect(edge).toHaveAttribute('aria-valuemin', '72');
    await expect(edge).toHaveAttribute('aria-valuemax', '272');
    await expect(edge).toHaveAttribute('aria-controls', 'rail');

    // Under the hand the rail and the page follow the divider exactly.
    const box = (await edge.boundingBox())!;
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x, y);
    await page.mouse.down();
    await page.mouse.move(190, y, { steps: 8 });
    await expect
      .poll(async () => Math.round((await rail(page).boundingBox())!.width))
      .toBe(190);
    expect(await edgeX(page)).toBe(190);
    // The page follows too: re-laid under the hand, or (on a page too long
    // to re-lay every frame) riding on a translate until it is let go.
    expect(
      await page.evaluate(() =>
        Math.round(document.querySelector('.main')!.getBoundingClientRect().x)
      )
    ).toBe(190);
    expect(await state(page)).toBe('expanded');
    // Let go after stopping: no throw, so the nearest stop wins.
    await page.mouse.move(120, y, { steps: 6 });
    await page.waitForTimeout(250);
    await page.mouse.up();
    await expect.poll(() => state(page)).toBe('collapsed');
    await expect(edge).toHaveAttribute('aria-valuenow', '72');
    await expect
      .poll(async () => (await rail(page).boundingBox())?.width)
      .toBe(72);

    // A short fast throw carries past the middle to the far stop. The moves
    // are timed in the page, a frame apart as a hand's arrive: the driver's
    // own round trips can space them past the 80ms that reads as a stop.
    // Headless WebKit handles each move here in 50–150ms, which reads as a
    // hand that stopped, so there the divider is carried past the middle.
    if (browserName === 'webkit') {
      await page.mouse.move(72, y);
      await page.mouse.down();
      await page.mouse.move(232, y, { steps: 4 });
      await page.mouse.up();
    }
    await page.evaluate(async (skip) => {
      if (skip) {
        return;
      }
      const edge = document.querySelector('.rail-edge')!;
      const fire = (type: string, x: number) =>
        edge.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            button: 0,
            buttons: type === 'pointerup' ? 0 : 1,
            cancelable: true,
            clientX: x,
            clientY: 450,
            isPrimary: true,
            pointerId: 1,
            pointerType: 'mouse'
          })
        );
      const frame = () => new Promise((done) => setTimeout(done, 16));
      fire('pointerdown', 72);
      await frame();
      fire('pointermove', 102);
      await frame();
      fire('pointermove', 132);
      fire('pointerup', 132);
    }, browserName === 'webkit');
    await expect.poll(() => state(page)).toBe('expanded');
    await expect
      .poll(async () => (await rail(page).boundingBox())?.width)
      .toBe(272);

    await settled(page);
    await edge.dblclick();
    expect(await state(page)).toBe('collapsed');

    await edge.focus();
    await page.keyboard.press('ArrowRight');
    expect(await state(page)).toBe('expanded');
    await expect(edge).toHaveAttribute('aria-valuenow', '272');
    await page.keyboard.press('ArrowLeft');
    expect(await state(page)).toBe('collapsed');
    await page.keyboard.press('Enter');
    expect(await state(page)).toBe('expanded');
    await expect(edge).toBeFocused();

    // A held modifier is the browser's (Alt+Left is Back on Windows and
    // Linux): the divider stays put and leaves the key alone.
    const prevented = await edge.evaluate((el) =>
      (['altKey', 'ctrlKey', 'metaKey'] as const).map((modifier) => {
        const key = new KeyboardEvent('keydown', {
          key: 'ArrowLeft',
          bubbles: true,
          cancelable: true,
          [modifier]: true
        });
        el.dispatchEvent(key);
        return key.defaultPrevented;
      })
    );
    expect(prevented).toEqual([false, false, false]);
    expect(await state(page)).toBe('expanded');
  });

  test('can be caught mid-glide', async ({ page }) => {
    await page.goto('/');
    test.skip(!(await anchors(page)), 'The glide needs anchor positioning.');
    await hydrated(page);
    await page.evaluate(() =>
      document.documentElement.style.setProperty('--slomo', '60')
    );
    // Slow enough that the divider is still under the pointer when it lands.
    await divider(page).dblclick();
    await page.waitForTimeout(2500);
    const x = await edgeX(page);
    expect(x).toBeGreaterThan(80);
    expect(x).toBeLessThan(264);

    // Grabbed, the layout becomes what is on screen at that instant (read
    // before the shell's own handler runs) and stays there.
    await page.evaluate(() =>
      window.addEventListener(
        'pointerdown',
        () =>
          ((window as unknown as { grabbedAt: number }).grabbedAt = Math.round(
            document.querySelector('.rail-edge')!.getBoundingClientRect().x
          )),
        { capture: true, once: true }
      )
    );
    await page.mouse.move(x, 450);
    await page.mouse.down();
    await expect(divider(page)).toHaveAttribute('data-held', '');
    const grabbedAt = await page.evaluate(
      () => (window as unknown as { grabbedAt: number }).grabbedAt
    );
    await page.waitForTimeout(300);
    const held = await edgeX(page);
    expect(Math.abs(held - grabbedAt)).toBeLessThan(2);
    await page.waitForTimeout(300);
    expect(await edgeX(page)).toBe(held);
    expect(
      Math.abs(Math.round((await rail(page).boundingBox())!.width) - held)
    ).toBeLessThan(2);

    await page.evaluate(() =>
      document.documentElement.style.setProperty('--slomo', '1')
    );
    await page.mouse.move(held - 40, 450, { steps: 4 });
    await page.waitForTimeout(250);
    await page.mouse.up();
    await expect.poll(() => state(page)).toBe('collapsed');
    await expect.poll(() => edgeX(page)).toBe(72);
  });

  test('toggles with the [ key, but not while typing', async ({ page }) => {
    await page.goto('/');
    await hydrated(page);
    await page.locator('body').press('[');
    expect(await state(page)).toBe('collapsed');
    await page.locator('body').press('[');
    expect(await state(page)).toBe('expanded');

    await page.keyboard.press('ControlOrMeta+k');
    await page.getByPlaceholder('Search episodes...').press('[');
    expect(await state(page)).toBe('expanded');
  });

  test('keeps its state across reloads and navigation', async ({ page }) => {
    await page.goto('/');
    await toggle(page).click();
    await expect.poll(() => state(page)).toBe('collapsed');

    // Applied before first paint, so the first frame is already collapsed.
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        (window as unknown as { firstState: string }).firstState =
          document.documentElement.dataset.rail ?? '';
      });
    });
    await page.reload();
    expect(
      await page.evaluate(
        () => (window as unknown as { firstState: string }).firstState
      )
    ).toBe('collapsed');
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');

    // Client-side navigation swaps the page, not the state.
    await page.locator('.rail-nav a[href="/about"]').click();
    await expect(page).toHaveURL(/\/about$/, { timeout: 15_000 });
    expect(await state(page)).toBe('collapsed');
    await expect
      .poll(async () => (await rail(page).boundingBox())?.width)
      .toBe(72);
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('names the collapsed icons', async ({ page }) => {
    await page.goto('/');
    await toggle(page).click();
    await settled(page);
    const about = page.locator('.rail-nav a[href="/about"]');
    if (await placeable(page)) {
      // One tooltip, anchored to whichever icon it names.
      await about.hover();
      const tip = page.locator('#rail-tip');
      await expect(tip).toHaveText('About');
      await expect
        .poll(() => tip.evaluate((el) => el.matches(':popover-open')))
        .toBe(true);
      await page.locator('.rail-nav a[href="/contact"]').hover();
      await expect(tip).toHaveText('Contact');
    } else {
      await expect(about).toHaveAttribute('title', 'About');
    }
    await expect(about).toHaveAccessibleName('About');
  });

  test('names an open-rail link only when its label is clipped', async ({
    page
  }) => {
    await page.goto('/');
    await settled(page);
    const label = page.locator('.rail-nav a[href="/contact"] > span');
    // prop-for-that's truncated source reports the clip as --live-truncated.
    const clipped = () =>
      label.evaluate((el) =>
        getComputedStyle(el).getPropertyValue('--live-truncated').trim()
      );
    await expect.poll(clipped).toBe('0');
    await label.evaluate(
      (el) => (el.textContent = 'Contact the hosts and producers of the show')
    );
    await expect.poll(clipped).toBe('1');

    if (await placeable(page)) {
      await page.locator('.rail-nav a[href="/contact"]').hover();
      await expect(page.locator('#rail-tip')).toHaveText(
        'Contact the hosts and producers of the show'
      );
      await page.locator('.rail-nav a[href="/about"]').hover();
      await page.waitForTimeout(500);
      await expect
        .poll(() =>
          page
            .locator('#rail-tip')
            .evaluate((el) => el.matches(':popover-open'))
        )
        .toBe(false);
    }
  });

  test('sets the six follow marks in one row, evenly, inside the rail', async ({
    page
  }) => {
    await page.goto('/');
    await settled(page);
    const { rows, gaps, inside } = await page.evaluate(() => {
      const marks = [
        ...document.querySelectorAll('.rail .platforms .platform')
      ].map((mark) => mark.getBoundingClientRect());
      const rail = document.querySelector('.rail')!.getBoundingClientRect();
      const byTop: Record<number, number> = {};
      for (const mark of marks) {
        const top = Math.round(mark.top);
        byTop[top] = (byTop[top] ?? 0) + 1;
      }
      return {
        rows: Object.values(byTop),
        gaps: marks.slice(1).map((mark, i) => mark.left - marks[i]!.right),
        inside: marks.every(
          (mark) => mark.left >= rail.left && mark.right <= rail.right
        )
      };
    });
    expect(rows).toEqual([6]);
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(0.5);
    expect(Math.min(...gaps)).toBeGreaterThan(0);
    expect(inside).toBe(true);
  });

  test('credits the hosts as co-authors and fans them out', async ({
    page
  }) => {
    await page.goto('/');
    await settled(page);
    const hosts = page.locator('.rail-hosts');
    const faces = () =>
      hosts.locator('.rail-host img').evaluateAll((imgs) =>
        imgs.map((img) => {
          const box = img.getBoundingClientRect();
          return { x: Math.round(box.x), y: Math.round(box.y) };
        })
      );
    // Shown: opaque and not the visually hidden 1px box of the fallback.
    const namesShown = () =>
      hosts
        .locator('.rail-host-name')
        .evaluateAll((names) =>
          names.every(
            (name) =>
              getComputedStyle(name).opacity === '1' &&
              name.getBoundingClientRect().width > 1
          )
        );

    // At rest: one credit line beside overlapping faces, and the links
    // still each named for assistive tech.
    await expect(hosts.locator('.host-credit')).toHaveText(
      'RobbieTheWagner & Adam Argyle'
    );
    await expect(hosts.locator('.host-credit')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    const rest = await faces();
    expect(rest[1]!.y).toBe(rest[0]!.y);
    expect(rest[1]!.x - rest[0]!.x).toBeLessThan(36);
    expect(await namesShown()).toBe(false);
    // The credit sits beside the stack, not under it, and each face is
    // positioned, so its drawn hairline and light keep to the face.
    const credit = await hosts.locator('.host-credit').boundingBox();
    expect(credit!.x).toBeGreaterThanOrEqual(rest[1]!.x + 32);
    expect(Math.abs(credit!.y - rest[0]!.y)).toBeLessThan(8);
    expect(
      await hosts
        .locator('.rail-host .person-face')
        .evaluateAll((faces) =>
          faces.every((face) => getComputedStyle(face).position !== 'static')
        )
    ).toBe(true);
    for (const name of ['RobbieTheWagner', 'Adam Argyle']) {
      await expect(hosts.getByRole('link', { name })).toHaveAttribute(
        'href',
        /^https:/
      );
    }

    // Hovered: a row per host, each face over the next, names shown.
    await hosts.locator('.rail-host').first().hover();
    await expect
      .poll(async () => {
        const [a, b] = await faces();
        return a!.x === b!.x && b!.y - a!.y >= 40;
      })
      .toBe(true);
    await expect.poll(namesShown).toBe(true);

    // Gathered again once the pointer leaves.
    await page.mouse.move(700, 300);
    await expect.poll(async () => (await faces())[1]!.y).toBe(rest[1]!.y);

    // Focus inside fans it out too, and the link keeps its name.
    await hosts.getByRole('link', { name: 'Adam Argyle' }).focus();
    await expect.poll(namesShown).toBe(true);
    await expect(
      hosts.getByRole('link', { name: 'Adam Argyle' })
    ).toBeFocused();
  });

  test('opens the follow and host flyouts from the stacks', async ({
    page
  }) => {
    await page.goto('/');
    await toggle(page).click();
    await settled(page);

    const follow = page.getByRole('button', { name: 'Follow the show' });
    await follow.click();
    const followFly = page.locator('#rail-follow-fly');
    await expect(
      followFly.getByRole('link', { name: /Spotify/ })
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(followFly).toBeHidden();

    await page.getByRole('button', { name: 'Hosted by' }).click();
    await expect(page.locator('#rail-hosts-fly')).toContainText('Adam Argyle');

    // Stacked, the platform links are left to the flyout.
    expect(
      await page
        .locator('.rail-follow .platforms a')
        .evaluateAll((links) => links.every((a) => a.closest('[inert]')))
    ).toBe(true);
  });

  test('keeps its groups whole whatever the components render', async ({
    page
  }) => {
    await page.goto('/');
    await settled(page);
    // An overriding Platforms or Hosts knows nothing of anchors. Take the
    // built-in lists' own anchor names away: the layout's boxes stand in.
    await page.evaluate(() =>
      document
        .querySelectorAll('.rail .platforms, .rail .host-list')
        .forEach((list) => list.removeAttribute('data-⚓️-name'))
    );
    const label = await page
      .locator('.rail-follow > .rail-label')
      .boundingBox();
    const first = await page.locator('.rail-follow a').first().boundingBox();
    expect(label!.y + label!.height).toBeLessThanOrEqual(first!.y + 1);

    await toggle(page).click();
    await settled(page);
    for (const [group, fly] of [
      ['.rail-follow', '#rail-follow-fly'],
      ['.rail-hosts', '#rail-hosts-fly']
    ] as const) {
      expect(
        await page
          .locator(`${group} a`)
          .evaluateAll((links) => links.every((a) => a.closest('[inert]')))
      ).toBe(true);
      const stack = page.locator(`${group} .rail-stack`);
      const box = await stack.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(40);
      await stack.click();
      await expect(page.locator(fly)).toBeVisible();
      if (await placeable(page)) {
        // Beside the stack it opened from.
        const opened = await page.locator(fly).boundingBox();
        expect(opened!.x).toBeGreaterThanOrEqual(box!.x + box!.width);
      }
      await page.keyboard.press('Escape');
      await expect(page.locator(fly)).toBeHidden();
    }
  });
});

test.describe('rail popovers', () => {
  // A short window, so the stacks sit near its bottom.
  test.use({ viewport: { width: 1440, height: 640 } });

  test('open beside what they name, flipping up near the bottom', async ({
    page
  }) => {
    await page.goto('/');
    await settled(page);
    test.skip(!(await placeable(page)), 'no anchor positioning');

    // Open, the toggle is named beside it.
    const tip = page.locator('#rail-tip .rail-tip-box');
    await toggle(page).hover();
    await expect(tip).toBeVisible();
    const toggleBox = await toggle(page).boundingBox();
    const tipBox = await tip.boundingBox();
    expect(tipBox!.x).toBeGreaterThanOrEqual(toggleBox!.x + toggleBox!.width);
    expect(
      Math.abs(
        tipBox!.y + tipBox!.height / 2 - (toggleBox!.y + toggleBox!.height / 2)
      )
    ).toBeLessThan(3);

    await toggle(page).click();
    await settled(page);
    // Collapsed, so is an icon.
    const icon = page.locator('.rail-nav a').nth(1);
    await icon.hover();
    await expect(tip).toHaveText('About');
    const iconBox = await icon.boundingBox();
    await expect
      .poll(async () => {
        const box = await tip.boundingBox();
        return Math.abs(
          box!.y + box!.height / 2 - (iconBox!.y + iconBox!.height / 2)
        );
      })
      .toBeLessThan(3);

    for (const fly of ['#rail-follow-fly', '#rail-hosts-fly']) {
      const stack = page.locator(`[popovertarget="${fly.slice(1)}"]`);
      await page.mouse.move(900, 300);
      await stack.click();
      const box = page.locator(`${fly} .rail-fly-box`);
      await expect(box).toBeVisible();
      const s = (await stack.boundingBox())!;
      const f = (await box.boundingBox())!;
      // Beside its stack, level with it, on screen, and here flipped up:
      // its bottom meets the stack's, and its caret moved down with it.
      expect(f.x).toBeGreaterThanOrEqual(s.x + s.width);
      expect(f.y + f.height).toBeLessThanOrEqual(640);
      expect(Math.abs(f.y + f.height - (s.y + s.height))).toBeLessThan(24);
      expect(
        await box.evaluate(
          (el) =>
            parseFloat(getComputedStyle(el, '::before').top) >
            (el as HTMLElement).offsetHeight / 2
        )
      ).toBe(true);
      await page.keyboard.press('Escape');
      await expect(box).toBeHidden();
    }
  });
});

test.describe('skip links', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('offer the player only once an episode is loaded', async ({
    page,
    browserName
  }) => {
    // WebKit reaches links with Option-Tab, as Safari does by default.
    const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    const toContent = page.getByRole('link', { name: 'Skip to content' });
    const toPlayer = page.locator('.skip-link[href="#player"]');
    await page.goto('/');
    await expect(page.locator('[data-explorer][data-live]')).toBeAttached();

    // A first visit: nothing is loaded and there is no player, so the next
    // stop after the first skip link is not a link that leads nowhere.
    await page.keyboard.press(tab);
    await expect(toContent).toBeFocused();
    await expect(toPlayer).toBeHidden();
    await page.keyboard.press(tab);
    await expect(toPlayer).not.toBeFocused();

    // Once an episode is loaded the link is the second stop and lands in
    // the player.
    await page
      .locator('.xp-hero')
      .getByRole('button', { name: 'Play episode', exact: true })
      .click();
    await expect(page.locator('#player')).toBeAttached();
    await toContent.focus();
    await page.keyboard.press(tab);
    await expect(
      page.getByRole('link', { name: 'Skip to the player' })
    ).toBeFocused();
    await page.keyboard.press('Enter');
    await expect
      .poll(() =>
        page.evaluate(() => Boolean(document.activeElement?.closest('#player')))
      )
      .toBe(true);
  });

  test('jump in place after the explorer has pushed its state', async ({
    page,
    browserName
  }) => {
    const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    await page.goto('/');
    await expect(page.locator('[data-explorer][data-live]')).toBeAttached();
    // A search pushes ?q= into the address without the router knowing.
    await page.getByRole('searchbox', { name: 'Search episodes' }).fill('css');
    await expect(page).toHaveURL(/\?q=css$/);
    await page.evaluate(() => {
      (window as Window & { routed?: number }).routed = 0;
      document.addEventListener('astro:before-preparation', () => {
        (window as Window & { routed?: number }).routed! += 1;
      });
      document.querySelector<HTMLElement>('[data-explorer]')!.dataset.kept = '';
      // Back to the top of the tab order.
      const start = document.createElement('a');
      start.href = '#';
      document.body.prepend(start);
      start.focus();
      start.remove();
    });

    await page.keyboard.press(tab);
    await expect(
      page.getByRole('link', { name: 'Skip to content' })
    ).toBeFocused();
    await page.keyboard.press('Enter');

    // A fragment jump in this document: the explorer and its search stay,
    // and the router never starts a navigation.
    await expect(page).toHaveURL(/\?q=css#main$/);
    await page.waitForTimeout(500);
    expect(
      await page.evaluate(() => (window as Window & { routed?: number }).routed)
    ).toBe(0);
    await expect(page.locator('[data-explorer][data-kept]')).toBeAttached();
    await expect(
      page.getByRole('searchbox', { name: 'Search episodes' })
    ).toHaveValue('css');
  });
});

test.describe('search palette', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('opens from the rail, filters, and returns focus on close', async ({
    page
  }) => {
    await page.goto('/');
    const trigger = page.locator('.rail-search [data-search-trigger]');
    // From the keyboard, so every engine has focus on the trigger to return.
    await hydrated(page);
    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Search episodes' });
    await expect(dialog).toBeVisible();
    const input = page.getByPlaceholder('Search episodes...');
    await expect(input).toBeFocused();

    await input.fill('css');
    await expect(page.getByRole('option').first()).toBeVisible();
    for (const option of await page.getByRole('option').all()) {
      await expect(option).toContainText(/css/i);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('closes the now-playing card first, so ⌘K always works', async ({
    page
  }) => {
    await page.goto('/');
    await hydrated(page);
    await page
      .locator('.xp-hero')
      .getByRole('button', { name: 'Play episode', exact: true })
      .click();
    const island = page.locator('#player');
    await expect(island).toBeAttached();
    await page.keyboard.press('2');
    await expect(island).toHaveAttribute('data-state', 'card');
    await expect(page.locator('body > [inert]').first()).toBeAttached();

    // The card is modal: the rail's [ belongs to the page behind it, even
    // from one of the card's buttons (focus starts on its home radio, where
    // typing already keeps [ out).
    await island.locator('button:visible').first().focus();
    const rest = await state(page);
    await page.keyboard.press('[');
    await page.waitForTimeout(300);
    expect(await state(page)).toBe(rest);

    // ⌘K closes the card, then opens the palette, ready to type in.
    await page.keyboard.press('ControlOrMeta+k');
    await expect(island).not.toHaveAttribute('data-state', 'card');
    await expect(
      page.getByRole('dialog', { name: 'Search episodes' })
    ).toBeVisible();
    const input = page.getByPlaceholder('Search episodes...');
    await expect(input).toBeFocused();
    // It takes a search at once, while the island is still flying home
    // (the page stays inert until it lands; the modal palette escapes that).
    await input.fill('css');
    await expect(page.getByRole('option').first()).toContainText(/css/i);
    // And once it has landed, nothing on the page is left inert.
    await expect.poll(() => page.locator('body > [inert]').count()).toBe(0);
  });

  test('lands with its contents at their own size, where clicks find them', async ({
    page
  }) => {
    await page.goto('/');
    await hydrated(page);
    await page.locator('.rail-search [data-search-trigger]').click();
    await expect(
      page.getByRole('dialog', { name: 'Search episodes' })
    ).toBeVisible();

    // The box flies in on a scale its inner box undoes. Landed, that inner
    // box is back to identity (WebKit used to keep the counter-scale it was
    // first given, with the text about ten times tall).
    await expect
      .poll(
        () =>
          page.locator('.sp-in').evaluate((inner) => {
            const m = new DOMMatrix(getComputedStyle(inner).transform);
            return Math.max(
              Math.abs(m.a - 1),
              Math.abs(m.d - 1),
              Math.abs(m.e),
              Math.abs(m.f)
            );
          }),
        { timeout: 4000 }
      )
      .toBeLessThan(0.01);

    // A row is where it is drawn: the point at its centre hits it, and a
    // click there chooses it.
    const first = page.getByRole('option').first();
    expect(
      await first.evaluate((row) => {
        const box = row.getBoundingClientRect();
        const hit = document.elementFromPoint(
          box.x + box.width / 2,
          box.y + box.height / 2
        );
        return hit?.closest('[role="option"]') === row;
      })
    ).toBe(true);
    // Chosen: the person's episodes are fetched (the page swap that follows
    // is the router's, and slow on a busy dev server).
    const chosen = page.waitForRequest(/\?guest=/);
    await first.click();
    await chosen;
  });

  test('opens from the collapsed rail with ⌘K and goes to the chosen episode', async ({
    page
  }) => {
    await page.goto('/');
    await hydrated(page);
    await toggle(page).click();
    await expect.poll(() => state(page)).toBe('collapsed');
    await page.evaluate(
      () => ((window as unknown as { kept: boolean }).kept = true)
    );

    await page.keyboard.press('ControlOrMeta+k');
    await expect(
      page.getByRole('dialog', { name: 'Search episodes' })
    ).toBeVisible();
    await page.getByPlaceholder('Search episodes...').fill('css');
    await expect(page.getByRole('option').nth(1)).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('option').nth(1)).toHaveAttribute(
      'aria-selected',
      'true'
    );
    const href = await page.getByRole('option').nth(1).getAttribute('href');
    await page.keyboard.press('Enter');

    // An episode page renders slowly on a busy dev server.
    await expect(page).toHaveURL(new RegExp(`${href}$`), { timeout: 15_000 });
    await expect(
      page.getByRole('dialog', { name: 'Search episodes' })
    ).toBeHidden();
    // A client-side navigation: the page (and any playback) was never reloaded.
    expect(
      await page.evaluate(() => (window as unknown as { kept?: boolean }).kept)
    ).toBe(true);
  });
});

test.describe('phone shell', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('searches from the tab bar and keeps the top bar', async ({ page }) => {
    await page.goto('/');
    // The dev server's toolbar sits over the middle of the tab bar.
    await page.addStyleTag({
      content: 'astro-dev-toolbar { display: none !important; }'
    });
    await expect(page.locator('.rail')).toBeHidden();
    await expect(divider(page)).toBeHidden();
    await expect(page.locator('.topbar')).toBeVisible();

    await page.locator('.tabbar [data-search-trigger]').click();
    await expect(
      page.getByRole('dialog', { name: 'Search episodes' })
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('dialog', { name: 'Search episodes' })
    ).toBeHidden();

    await page.locator('.tabbar').getByRole('button', { name: 'More' }).click();
    await expect(
      page.locator('#more-sheet').getByRole('link', { name: 'About' })
    ).toBeVisible();
  });
});
