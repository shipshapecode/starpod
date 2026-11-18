import { expect, test, type Page } from '@playwright/test';

/*
  The home page's explorer: everything happens in the page (no reload), and
  the state lives in the URL query. Counts depend on the live feed, so these
  check what the cards say about themselves rather than fixed numbers.
*/

const cards = (page: Page) => page.locator('.xp-card:not([hidden])');

/** What every shown card a reader meets carries, in the order shown (a sort
    may set `order` rather than move them; a card fading out where it stood
    is inert until it parks). */
const shown = (page: Page) =>
  page.locator('.xp-card:not([hidden], [inert])').evaluateAll((items) =>
    items
      .map((li, dom) => ({
        li,
        rank: Number((li as HTMLElement).style.order || dom)
      }))
      .sort((a, b) => a.rank - b.rank)
      .map(({ li }) => ({
        duration: Number((li as HTMLElement).dataset.duration),
        index: Number((li as HTMLElement).dataset.index),
        people: (li as HTMLElement).dataset.people ?? '',
        title: li.querySelector('.xp-title')!.textContent!.trim(),
        video: (li as HTMLElement).dataset.video !== undefined,
        year: (li as HTMLElement).dataset.year
      }))
  );

const count = (page: Page) => page.locator('[data-xp-shown]');

async function pick(page: Page, menu: string, value: string) {
  await page.locator(`[popovertarget="${menu}"]`).click();
  await page.locator(`#${menu} label:has(input[value="${value}"])`).click();
  await expect(page.locator(`#${menu}`)).not.toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-explorer][data-live]')).toBeAttached();
});

test('opens on the latest episode, ready to play', async ({ page }) => {
  const hero = page.locator('.xp-hero');
  const first = (await shown(page))[0]!;
  await expect(hero.locator('.xp-hero-title')).toHaveText(first.title);
  await expect(
    hero.getByRole('button', { name: 'Play episode', exact: true })
  ).toBeVisible();
});

test('searches titles and descriptions as you type', async ({ page }) => {
  const total = await cards(page).count();
  await page.getByRole('searchbox', { name: 'Search episodes' }).fill('css');
  await expect(page).toHaveURL(/\?q=css$/);
  const results = await cards(page).count();
  expect(results).toBeGreaterThan(0);
  expect(results).toBeLessThan(total);
  await expect(count(page)).toHaveText(String(results));
  for (const text of await cards(page).allTextContents()) {
    expect(text.toLowerCase()).toContain('css');
  }
});

test('filters by video and audio', async ({ page }) => {
  await page.locator('label:has(input[name=kind][value=video])').click();
  await expect(page).toHaveURL(/\?kind=video$/);
  const videos = await shown(page);
  expect(videos.length).toBeGreaterThan(0);
  expect(videos.every((card) => card.video)).toBe(true);

  await page.locator('label:has(input[name=kind][value=audio])').click();
  await expect(page).toHaveURL(/\?kind=audio$/);
  const audio = await shown(page);
  expect(audio.length).toBeGreaterThan(0);
  expect(audio.every((card) => !card.video)).toBe(true);
});

test('filters by year', async ({ page }) => {
  await pick(page, 'xp-year', '2024');
  await expect(page).toHaveURL(/\?year=2024$/);
  await expect(page.locator('[data-xp-label="year"]')).toHaveText('2024');
  const results = await shown(page);
  expect(results.length).toBeGreaterThan(0);
  expect(results.every((card) => card.year === '2024')).toBe(true);
});

test('a set filter turns solid, and its × clears it', async ({ page }) => {
  const year = page.locator('[popovertarget="xp-year"]');
  const clear = page.getByRole('button', { name: 'Any year' });
  await expect(clear).toBeHidden();
  await pick(page, 'xp-year', '2024');
  await expect(year).toHaveAttribute('data-on', '');
  await clear.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('[data-xp-label="year"]')).toHaveText('Any');
  await expect(year).not.toHaveAttribute('data-on', '');
  await expect(clear).toBeHidden();
  await expect(year).toBeFocused();
});

test('every toolbar control is one height', async ({ page }) => {
  // (Polled: the chips arrive scaling up from 0.8 as the page loads.)
  await expect
    .poll(
      async () =>
        new Set(
          await page
            .locator(
              '.xp-search, .xp-seg, .xp-chips > .xp-filter > .xp-pick, .xp-sort'
            )
            .evaluateAll((items) =>
              items.map((item) => item.getBoundingClientRect().height)
            )
        )
    )
    .toEqual(new Set([40]));
});

test('filters by host or guest when the database is on', async ({ page }) => {
  const menu = page.locator('#xp-people');
  test.skip((await menu.count()) === 0, 'No guests database for this site');
  const person = await menu
    .locator('input[value]:not([value=""])')
    .nth(3)
    .getAttribute('value');
  await pick(page, 'xp-people', person!);
  await expect(page).toHaveURL(new RegExp(`\\?guest=${person}$`));
  // The With chip wears their face.
  await expect(
    page.locator('[popovertarget="xp-people"] .person-face')
  ).toBeVisible();
  const results = await shown(page);
  expect(results.length).toBeGreaterThan(0);
  expect(
    results.every((card) => card.people.split(' ').includes(person!))
  ).toBe(true);
});

test('filters to the episodes you have started', async ({ page }) => {
  const id = await page.locator('.xp-card').nth(4).getAttribute('data-id');
  await page.evaluate(
    (key) => localStorage.setItem(key, '900'),
    `starpod:pos:${id}`
  );
  await page.reload();
  const chip = page.getByRole('button', { name: /In progress/ });
  await expect(chip).toBeVisible();
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\?progress=1$/);
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toHaveAttribute('data-id', id!);
});

test('sorts newest, oldest, longest and shortest', async ({ page }) => {
  // Four trips through the sort menu; give it room on a busy dev server.
  test.slow();
  const order = async () => (await shown(page)).slice(0, 12);

  await pick(page, 'xp-sort', 'oldest');
  await expect(page).toHaveURL(/\?sort=oldest$/);
  let results = await order();
  expect(results.map((card) => card.index)).toEqual(
    [...results].sort((a, b) => b.index - a.index).map((card) => card.index)
  );

  await pick(page, 'xp-sort', 'longest');
  results = await order();
  expect(results.map((card) => card.duration)).toEqual(
    [...results].map((card) => card.duration).sort((a, b) => b - a)
  );

  await pick(page, 'xp-sort', 'shortest');
  results = await order();
  expect(results.map((card) => card.duration)).toEqual(
    [...results].map((card) => card.duration).sort((a, b) => a - b)
  );

  await pick(page, 'xp-sort', 'newest');
  await expect(page).toHaveURL(/\/$/);
  results = await order();
  expect(results.map((card) => card.index)).toEqual(results.map((_, i) => i));
});

/** Where the browser can open a parked block for find in page (hidden until
    found), only the cards around the viewport are in the grid. */
const windowed = (page: Page) =>
  page.evaluate(
    () =>
      'onbeforematch' in HTMLElement.prototype &&
      CSS.supports('position-anchor', '--x')
  );

const parksInView = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('.xp-park:not([data-empty])')].some(
      (park) => {
        const box = park.getBoundingClientRect();
        return box.bottom > 0 && box.top < innerHeight;
      }
    )
  );

test('keeps only the cards around the viewport in the grid', async ({
  page
}) => {
  test.skip(!(await windowed(page)), 'Every card stays in the grid here');
  const total = await cards(page).count();
  const inGrid = page.locator('.xp-list > .xp-card:not([hidden])');
  await expect.poll(() => inGrid.count()).toBeLessThan(total / 2);
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight
  );
  for (const at of [0.3, 0.7, 0.1]) {
    await page.evaluate(
      (at) => scrollTo(0, document.documentElement.scrollHeight * at),
      at
    );
    await expect.poll(() => parksInView(page)).toBe(false);
  }
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
    height
  );
});

test('keeps every card in its place as the window moves', async ({ page }) => {
  test.skip(!(await windowed(page)), 'Every card stays in the grid here');
  const place = (index?: string) =>
    page.evaluate((index) => {
      const card = index
        ? document.querySelector<HTMLElement>(
            `.xp-card[data-index="${index}"]`
          )!
        : [
            ...document.querySelectorAll<HTMLElement>('.xp-list > .xp-card')
          ].find((li) => li.getBoundingClientRect().top > 200)!;
      return {
        index: card.dataset.index!,
        top: Math.round(card.getBoundingClientRect().top + scrollY)
      };
    }, index);
  await page.evaluate(() =>
    scrollTo(0, document.documentElement.scrollHeight * 0.3)
  );
  await expect.poll(() => parksInView(page)).toBe(false);
  const before = await place();
  // Down, back past it to the top, and back: cards leave the grid and come
  // into it again from either side.
  for (const at of [0.8, 0.02, 0.3]) {
    await page.evaluate(
      (at) => scrollTo(0, document.documentElement.scrollHeight * at),
      at
    );
    await expect.poll(() => parksInView(page)).toBe(false);
  }
  expect(await place(before.index)).toEqual(before);
  // Back up a screen at a time: cards come into the grid above the ones
  // already there, and take their own places, in order.
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, -450);
    await page.waitForTimeout(120);
  }
  await expect.poll(() => parksInView(page)).toBe(false);
  const seen = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.xp-list > .xp-card')]
      .map((li) => ({ li, box: li.getBoundingClientRect() }))
      .filter(({ box }) => box.bottom > 0 && box.top < innerHeight)
      .sort((a, b) => a.box.top - b.box.top || a.box.left - b.box.left)
      .map(({ li }) => Number(li.dataset.index))
  );
  expect(seen.length).toBeGreaterThan(3);
  expect(seen).toEqual([...seen].sort((a, b) => a - b));
});

test('finds a far card from a link into it', async ({ page }) => {
  test.skip(!(await windowed(page)), 'Every card stays in the grid here');
  await expect(page.locator('.xp-park[data-below] .xp-card')).not.toHaveCount(
    0
  );
  await page.evaluate(() => {
    const parked = [...document.querySelectorAll('.xp-park .xp-card')];
    parked[Math.floor(parked.length * 0.7)]!.querySelector('.xp-title a')!.id =
      'far-card';
    location.hash = 'far-card';
  });
  const link = page.locator('#far-card');
  await expect(link).toBeInViewport();
  await expect(page.locator('.xp-list > .xp-card:has(#far-card)')).toHaveCount(
    1
  );
  await expect.poll(() => parksInView(page)).toBe(false);
});

test('switches between grid and list', async ({ page }) => {
  const list = page.locator('.xp-list');
  await expect(list).toHaveAttribute('data-view', 'grid');
  await page.locator('label:has(input[name=view][value=list])').click();
  await expect(list).toHaveAttribute('data-view', 'list');
  await expect(page).toHaveURL(/\?view=list$/);
  await page.locator('label:has(input[name=view][value=grid])').click();
  await expect(list).toHaveAttribute('data-view', 'grid');
  await expect(page).toHaveURL(/\/$/);
});

test('arrives filtered from a link, and steps back and forward', async ({
  page
}) => {
  await page.goto('/?q=ai&kind=audio&sort=oldest&view=list');
  await expect(page.locator('[data-explorer][data-live]')).toBeAttached();
  await expect(
    page.getByRole('searchbox', { name: 'Search episodes' })
  ).toHaveValue('ai');
  await expect(page.locator('input[name=kind][value=audio]')).toBeChecked();
  await expect(page.locator('[data-xp-label="sort"]')).toHaveText(
    'Oldest first'
  );
  await expect(page.locator('.xp-list')).toHaveAttribute('data-view', 'list');
  const results = await shown(page);
  expect(results.every((card) => !card.video)).toBe(true);
  await expect(count(page)).toHaveText(String(results.length));

  await page.locator('label:has(input[name=view][value=grid])').click();
  await expect(page).toHaveURL(/\?q=ai&kind=audio&sort=oldest$/);
  await page.goBack();
  await expect(page.locator('.xp-list')).toHaveAttribute('data-view', 'list');
  await page.goForward();
  await expect(page.locator('.xp-list')).toHaveAttribute('data-view', 'grid');

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page).toHaveURL(/\?sort=oldest$/);
  await expect(
    page.getByRole('searchbox', { name: 'Search episodes' })
  ).toHaveValue('');
});

test('says so when nothing matches, and offers a way back', async ({
  page
}) => {
  await page
    .getByRole('searchbox', { name: 'Search episodes' })
    .fill('zzqx nothing at all');
  await expect(cards(page)).toHaveCount(0);
  await expect(page.locator('[data-xp-empty]')).toBeVisible();
  await page.getByRole('button', { name: 'Show every episode' }).click();
  await expect(page.locator('[data-xp-empty]')).toBeHidden();
  await expect(cards(page)).toHaveCount(await page.locator('.xp-card').count());
});

/** Where a part is on screen, rounded to the pixel. */
const rect = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return [r.left, r.top, r.width].map(Math.round);
  });

test('opens a card in the close-up, its parts in their slots', async ({
  page,
  browserName
}) => {
  const card = cards(page).nth(2);
  const toggle = card.locator('.xp-art');
  await toggle.click();
  const explorer = page.locator('[data-explorer]');
  await expect(explorer).toHaveAttribute('data-open', '');
  await expect(card).toHaveAttribute('data-on', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  // The artwork, facts line and title land in the close-up's own slots. Both
  // sides are measured on every poll: the close-up may still be settling.
  // Firefox resolves anchor(top) here about 2px above the slot it names, so
  // it gets that much room.
  const slack = browserName === 'firefox' ? 3 : 0;
  const lands = (part: string, slot: string) =>
    expect
      .poll(async () => {
        const [a, b] = await Promise.all([rect(page, part), rect(page, slot)]);
        return a.every((value, i) => Math.abs(value - b[i]!) <= slack)
          ? 'in its slot'
          : `${a} vs ${b}`;
      })
      .toBe('in its slot');
  await lands('.xp-card[data-on] .xp-art', '.xp-cu-art');
  await lands('.xp-card[data-on] .xp-title', '.xp-cu-title');
  // The detail column: the episode link, play, and Up next.
  const detail = card.locator('.xp-detail');
  await expect(
    detail.getByRole('link', { name: /Open episode/ })
  ).toBeVisible();
  await expect(detail.getByRole('button', { name: /Up next/ })).toBeVisible();
  await expect(
    card.getByRole('button', { name: /^Play episode/ })
  ).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(explorer).not.toHaveAttribute('data-open', '');
  await expect(card).not.toHaveAttribute('data-on', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(detail).toBeHidden();
});

test('steps through the results with the arrow keys', async ({ page }) => {
  await pick(page, 'xp-sort', 'oldest');
  const order = await shown(page);
  await cards(page)
    .filter({ hasText: order[3]!.title })
    .locator('.xp-art')
    .click();
  const on = page.locator('.xp-card[data-on]');
  await expect(on).toHaveAttribute('data-index', String(order[3]!.index));
  await page.keyboard.press('ArrowRight');
  await expect(on).toHaveAttribute('data-index', String(order[4]!.index));
  // Swapping mid-flight: the last key wins and only one card is open.
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(on).toHaveAttribute('data-index', String(order[2]!.index));
  await expect(on).toHaveCount(1);
  // A cell of the filmstrip opens its episode too.
  const next = cards(page).filter({ hasText: order[5]!.title });
  await next.locator('.xp-art-box').click();
  await expect(next).toHaveAttribute('data-on', '');
});

test('leans the strip cells in view, and the ones it scrolls to', async ({
  page
}) => {
  await cards(page).nth(2).locator('.xp-art').click();
  await expect(page.locator('[data-explorer]')).toHaveAttribute(
    'data-open',
    ''
  );
  // In view every cell is in depth and leans; two screens off, none is.
  const depth = () =>
    page.evaluate(() => {
      const cells = [
        ...document.querySelectorAll<HTMLElement>(
          '.xp-list > .xp-card:not([hidden], [data-on])'
        )
      ].map((li) => ({ li, box: li.getBoundingClientRect() }));
      const seen = cells.filter(
        ({ box }) => box.bottom > 0 && box.top < innerHeight
      );
      return {
        seen: seen.length,
        flat: seen.filter(({ li }) => li.dataset.depth === undefined).length,
        upright: seen.filter(
          ({ li }) =>
            getComputedStyle(li.querySelector('.xp-turn')!).rotate === 'none'
        ).length,
        far: cells.filter(
          ({ li, box }) =>
            li.dataset.depth !== undefined &&
            (box.top > innerHeight * 3 || box.bottom < -innerHeight * 2)
        ).length
      };
    });
  await expect.poll(depth).toMatchObject({ flat: 0, upright: 0, far: 0 });
  expect((await depth()).seen).toBeGreaterThan(2);
  // A screen down the strip and back: cells take depth as they come.
  const screen = await page.evaluate(() => innerHeight);
  for (const by of [screen, -screen]) {
    await page.mouse.wheel(0, by);
    await expect.poll(depth).toMatchObject({ flat: 0, upright: 0, far: 0 });
  }
});

test('carries cards through the sidebar glide without re-rendering them', async ({
  page
}) => {
  const toggle = page.locator('.rail-toggle').first();
  const glides = await page.evaluate(() =>
    CSS.supports('anchor-name', 'attr(data-a type(<custom-ident>))')
  );
  test.skip(
    !glides || !(await toggle.isVisible()),
    'The sidebar folds without a glide here'
  );
  await page.evaluate(() =>
    scrollTo(0, document.documentElement.scrollHeight * 0.4)
  );
  await expect.poll(() => parksInView(page)).toBe(false);
  await toggle.click();
  // Cards in view keep their containment (no flying mark, which renders a
  // card in full) and widen their clip to where their parts set out from.
  const marks = await page.evaluate(() => ({
    flying: document.querySelectorAll('.xp-card[data-flying]').length,
    wide: [...document.querySelectorAll<HTMLElement>('.xp-card')].filter((li) =>
      li.style.getPropertyValue('overflow-clip-margin')
    ).length
  }));
  expect(marks.flying).toBe(0);
  expect(marks.wide).toBeGreaterThan(0);
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll<HTMLElement>('.xp-card')].filter(
              (li) => li.style.getPropertyValue('overflow-clip-margin')
            ).length
        ),
      { timeout: 5000 }
    )
    .toBe(0);
  await toggle.click();
});

test('comes home from an episode already sized', async ({ page }) => {
  // Seen before the explorer starts on the way back (capture listeners on
  // the document run first).
  await page.evaluate(() =>
    document.addEventListener(
      'astro:after-swap',
      () => {
        (window as unknown as { sized?: boolean }).sized = document
          .querySelector('.xp-stage')
          ?.hasAttribute('data-sized');
      },
      { capture: true }
    )
  );
  const link = cards(page).nth(3).locator('.xp-title a');
  const href = (await link.getAttribute('href'))!;
  await link.click();
  await page.waitForURL('**' + href);
  await page.goBack();
  await expect(page.locator('[data-explorer][data-live]')).toBeAttached();
  expect(
    await page.evaluate(() => (window as unknown as { sized?: boolean }).sized)
  ).toBe(true);
});

test('a card grows under the pointer, in the grid and the list, and is flat at rest', async ({
  page
}) => {
  const card = cards(page).nth(1);
  const art = card.locator('.xp-art');
  // The artwork's scale, as a number (1 at rest, however it is written).
  const scale = () =>
    art.evaluate((el) => {
      const value = getComputedStyle(el).scale;
      return value === 'none' ? 1 : Number(value.split(' ')[0]);
    });
  const hover = await page.evaluate(
    () =>
      matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)')
        .matches
  );
  await expect.poll(scale).toBe(1);
  await art.hover();
  await expect.poll(scale).toBe(hover ? 1.06 : 1);
  await page.mouse.move(5, 5);
  await expect.poll(scale).toBe(1);
  // A list row's thumb grows by more, so it reads at its size.
  await page.locator('label:has(input[name=view][value=list])').click();
  await expect(page.locator('.xp-list')).toHaveAttribute('data-view', 'list');
  await expect.poll(scale).toBe(1);
  await art.hover();
  await expect.poll(scale).toBe(hover ? 1.12 : 1);
  await page.mouse.move(5, 5);
  await expect.poll(scale).toBe(1);
  await page.locator('label:has(input[name=view][value=grid])').click();
  await expect(page.locator('.xp-list')).toHaveAttribute('data-view', 'grid');
  // No card in the wall is in 3D: no transform, perspective or 3D context
  // anywhere inside one.
  const deep = await page.evaluate(
    () =>
      [...document.querySelectorAll('.xp-list > .xp-card *')].filter((el) => {
        const style = getComputedStyle(el);
        return (
          style.perspective !== 'none' ||
          style.transformStyle === 'preserve-3d' ||
          /matrix3d/.test(style.transform) ||
          style.rotate !== 'none'
        );
      }).length
  );
  expect(deep).toBe(0);
});

test('leaves keys to the widgets that take them', async ({ page }) => {
  const first = (await shown(page))[1]!;
  await cards(page).filter({ hasText: first.title }).locator('.xp-art').click();
  const on = page.locator('.xp-card[data-on]');
  await expect(on).toHaveAttribute('data-index', String(first.index));
  // A key pressed in another part of the page belongs to it.
  await page.locator('a[href="/about"]').first().focus();
  await page.keyboard.press('ArrowRight');
  // A key another widget handled is not ours either.
  await page.evaluate(() =>
    document.addEventListener('keydown', (event) => event.preventDefault(), {
      once: true
    })
  );
  await on.locator('.xp-art').focus();
  await page.keyboard.press('ArrowRight');
  // Escape in the search field is the field's.
  await page.getByRole('searchbox', { name: 'Search episodes' }).focus();
  await page.keyboard.press('Escape');
  await expect(on).toHaveAttribute('data-index', String(first.index));
  await expect(on).toHaveCount(1);
  // From the card itself the keys still step and close.
  await on.locator('.xp-art').focus();
  await page.keyboard.press('ArrowRight');
  await expect(on).not.toHaveAttribute('data-index', String(first.index));
  await page.keyboard.press('Escape');
  await expect(on).toHaveCount(0);
});

test('finds a host or guest by name', async ({ page }) => {
  const menu = page.locator('#xp-people');
  test.skip((await menu.count()) === 0, 'No guests database for this site');
  const option = menu.locator('label:has(input[value]:not([value=""]))').nth(3);
  const person = await option.locator('input').getAttribute('value');
  const name = (await option.locator('span:not([class])').textContent())!;
  await page
    .getByRole('searchbox', { name: 'Search episodes' })
    .fill(name.toLowerCase());
  const results = await shown(page);
  const theirs = results.filter((card) =>
    card.people.split(' ').map(decodeURIComponent).includes(person!)
  );
  // Every episode they are on is found, whatever its description says.
  const all = await page
    .locator('.xp-card')
    .evaluateAll(
      (items, id) =>
        items.filter((li) =>
          ((li as HTMLElement).dataset.people ?? '')
            .split(' ')
            .map(decodeURIComponent)
            .includes(id)
        ).length,
      person!
    );
  expect(theirs.length).toBe(all);
});

test('keeps focus clear of the sticky toolbar', async ({ page }) => {
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight / 3));
  await expect(page.locator('[data-xp-bar]')).toBeInViewport();
  // Start from a card in the middle of the screen and back up through the
  // archive from the keyboard: once the page has scrolled, each focused
  // control is below the toolbar, never under it.
  await page.evaluate(() => {
    const middle = document
      .elementFromPoint(innerWidth / 2, innerHeight / 2)!
      .closest('.xp-card') as HTMLElement;
    middle.querySelector<HTMLElement>('.xp-title a')!.focus();
  });
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Shift+Tab');
    await expect
      .poll(() =>
        page.evaluate(() => {
          const focused = document.activeElement!;
          if (!focused.closest('.xp-card')) {
            return true;
          }
          const bar = document.querySelector('[data-xp-bar]')!;
          return (
            focused.getBoundingClientRect().top >=
            bar.getBoundingClientRect().bottom - 1
          );
        })
      )
      .toBe(true);
  }
});

test('treats a filter the menus do not offer as no filter', async ({
  page
}) => {
  await page.goto('/?year=1899&guest=nobody-at-all');
  await expect(page.locator('[data-explorer][data-live]')).toBeAttached();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('[data-xp-label="year"]')).toHaveText('Any');
  await expect(page.locator('[popovertarget="xp-year"]')).not.toHaveAttribute(
    'data-on',
    ''
  );
  expect(await cards(page).count()).toBeGreaterThan(100);
});

test('hides the In progress chip once it is off and nothing is started', async ({
  page
}) => {
  const chip = page.locator('[data-xp-progress]');
  await page.goto('/?progress=1');
  await expect(page.locator('[data-explorer][data-live]')).toBeAttached();
  await expect(chip).toBeVisible();
  await chip.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(chip).toBeHidden();
});

test('comes back to the card it left, closing or returning', async ({
  page
}) => {
  const inView = (index: string) =>
    page.evaluate((index) => {
      const box = document
        .querySelector(`.xp-card[data-index="${index}"] .xp-art-box`)!
        .getBoundingClientRect();
      const bar = document
        .querySelector('[data-xp-bar]')!
        .getBoundingClientRect();
      return (
        box.height > 0 &&
        box.top >= bar.bottom - 2 &&
        box.bottom <= innerHeight + 2
      );
    }, index);
  await page.evaluate(() =>
    scrollTo(0, document.documentElement.scrollHeight * 0.4)
  );
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  // A card in the middle of the view, once the window has followed there.
  const middle = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>('.xp-list > .xp-card')].find(
          (li) => {
            const box = li.getBoundingClientRect();
            return (
              box.top > innerHeight * 0.3 && box.bottom < innerHeight * 0.9
            );
          }
        )?.dataset.index
    );
  await expect.poll(middle).toBeTruthy();
  const index = (await middle())!;
  const card = page.locator(`.xp-card[data-index="${index}"]`);
  // Stepping on from it and closing comes back to the card in the close-up.
  await card.locator('.xp-art').click();
  await page.keyboard.press('ArrowRight');
  const on = page.locator('.xp-card[data-on]');
  await expect(on).not.toHaveAttribute('data-index', index);
  const stepped = (await on.getAttribute('data-index'))!;
  await page.keyboard.press('Escape');
  await expect(on).toHaveCount(0);
  await expect.poll(() => inView(stepped)).toBe(true);
  // Opening its episode from the close-up and coming back does too.
  await page.locator(`.xp-card[data-index="${stepped}"] .xp-art`).click();
  await page.locator('.xp-card[data-on] .xp-open').click();
  await expect(page).not.toHaveURL(/\/$/, { timeout: 15_000 });
  await page.goBack();
  await expect(page.locator('[data-explorer][data-live]')).toBeAttached({
    timeout: 15_000
  });
  await expect.poll(() => inView(stepped)).toBe(true);
});

test('adds the open episode to Up next', async ({ page }) => {
  await cards(page).nth(1).locator('.xp-art').click();
  const queue = page.locator('.xp-card[data-on] .xp-queue');
  await queue.click();
  await expect(queue).toHaveAttribute('aria-pressed', 'true');
  await expect(queue).toContainText('In Up next');
  const id = await page.locator('.xp-card[data-on]').getAttribute('data-id');
  expect(
    await page.evaluate(() => localStorage.getItem('starpod:queue'))
  ).toContain(id!);
  await queue.click();
  await expect(queue).toHaveAttribute('aria-pressed', 'false');
});

test('plays an episode from its card', async ({ page }) => {
  const card = cards(page).nth(1);
  const title = (await shown(page))[1]!.title;
  // At rest the disc is plain markup; pressed, it plays its episode, and
  // the card gets the live control.
  await card.scrollIntoViewIfNeeded();
  await card.getByRole('button', { name: /^Play episode/ }).click();
  const dock = page.locator('.dock-controls');
  await expect(dock).toBeVisible();
  await expect(dock).toContainText(title);
  await expect(card).toHaveAttribute('data-current', '');
  await expect(
    card.getByRole('button', { name: /^Pause episode/ })
  ).toBeVisible();
});
