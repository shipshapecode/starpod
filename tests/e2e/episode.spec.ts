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
    page
      .locator('article.transcript')
      .getByRole('button', { name: /^Play from/ });

  // Episode 6 has no markdown transcript in src/content/transcripts, so it
  // falls back to the transcript referenced by the feed's <podcast:transcript>
  // tag. Its timestamps are the shared seek chip (e.g. "0:04").
  test('falls back to the RSS transcript with clickable timestamps when no markdown exists', async ({
    page
  }) => {
    await page.goto('/6');

    await expect(
      page.getByRole('heading', { name: 'Transcript', exact: true })
    ).toBeVisible();
    await expect(page.locator('article.transcript')).not.toBeEmpty();
    await expect(timestampButtons(page).first()).toBeVisible();
    await expect(timestampButtons(page).first()).toHaveText(/^\d{1,2}:\d{2}/);
    await expect(
      page.getByText('No transcript for this one yet.', { exact: false })
    ).toHaveCount(0);
  });

  // Episode 120 has an explicit markdown transcript AND the feed exposes an RSS
  // transcript for it — the markdown one must win. Its timestamps render as
  // the same seek chip; its bold speaker names prove the markdown source.
  test('prefers the explicit markdown transcript, with its own clickable timestamps', async ({
    page
  }) => {
    await page.goto('/120');

    await expect(
      page.getByRole('heading', { name: 'Transcript', exact: true })
    ).toBeVisible();
    await expect(page.locator('article.transcript')).not.toBeEmpty();
    await expect(timestampButtons(page).first()).toHaveText(/^\d{1,2}:\d{2}/);
    // Speaker names (bold in the markdown) prove the markdown transcript
    // rendered; feed transcripts carry no speakers.
    await expect(
      page.locator('article.transcript strong').first()
    ).toBeVisible();
    await expect(
      page.getByText('No transcript for this one yet.', { exact: false })
    ).toHaveCount(0);
  });

  // A real mouse on its way to a timestamp crosses the turn's head, which
  // can open the speaker's card; the click must still reach the timestamp.
  test('a timestamp takes a mouse click, with the speaker card about', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/230');
    await page.evaluate(() => {
      const clicks: Array<Element> = ((window as any).__clicks = []);
      document.addEventListener(
        'click',
        (event) => clicks.push(event.target as Element),
        true
      );
    });
    const heads = page
      .locator('article.transcript .ep-turn-head')
      .filter({ has: page.locator('strong') });
    // What a new click landed on: this head's own timestamp, or what took
    // it instead (or that no click came at all).
    const clickOn = async (head: number) => {
      const chip = heads.nth(head).locator('[data-seek]');
      const before = await page.evaluate(
        () => (window as any).__clicks.length as number
      );
      const box = (await chip.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 5
      });
      await page.waitForTimeout(500);
      await page.mouse.down();
      await page.mouse.up();
      return chip.evaluate((el, before) => {
        const clicks = (window as any).__clicks as Array<Element>;
        const hit = clicks.length > before ? clicks.at(-1)! : null;
        return !hit
          ? 'no click'
          : el.contains(hit)
            ? String(el.className)
            : `elsewhere: ${String(hit.className)}`;
      }, before);
    };
    // Once the card's island is up, the turns in the middle of the screen.
    await expect(page.locator('.ep-who')).toBeAttached();
    await heads
      .nth(1)
      .evaluate((head) => head.scrollIntoView({ block: 'center' }));
    await expect
      .poll(() =>
        heads.nth(1).evaluate((head) => head.getBoundingClientRect().top)
      )
      .toBeLessThan(900);

    // Straight onto a timestamp: it seeks, loading the episode.
    expect(await clickOn(1)).toContain('seek-chip');
    await expect(page.locator('.dock-controls')).toBeVisible();

    // Its speaker's name opens the card; from there onto the timestamp.
    await heads.nth(2).locator('strong').hover();
    await expect
      .poll(() =>
        page.locator('.ep-who').evaluate((el) => el.matches(':popover-open'))
      )
      .toBe(true);
    expect(await clickOn(2)).toContain('seek-chip');
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

      // The dock's controls only exist once an episode is loaded.
      await expect(page.locator('.dock-controls')).toHaveCount(0);

      await timestampButtons(page).first().click();

      const dock = page.locator('.dock-controls');
      await expect(dock).toBeVisible();
      await expect(dock).toContainText(marker);
      // These episodes have no video, so the one media element plays the MP3.
      await expect(page.locator('video.starpod-media')).toHaveAttribute(
        'src',
        /.+\.mp3/
      );
    });
  }
});

test.describe('episode page navigation', () => {
  // Episode 239 has video, a feed transcript, two hosts, two guests and a
  // sponsor, so every section of the page is present.
  const page239 = '/239';

  test('a sticky bar docks the episode once the stage scrolls away, and plays it', async ({
    page
  }) => {
    await page.goto(page239);
    const bar = page.locator('.ep-bar');
    const identity = bar.locator('.ep-bar-id');
    const play = bar.getByRole('button', { name: 'Play this episode' });

    // The identity waits for the scroll trigger (or, without trigger
    // animations, the script's stand-in), out of reach until then, with the
    // bar in view under the stage too.
    await bar.evaluate((el) =>
      scrollBy(0, el.getBoundingClientRect().top - 300)
    );
    await expect
      .poll(() => identity.evaluate((el) => el.getBoundingClientRect().width))
      .toBeLessThan(1);
    await expect(play).toBeHidden();

    await page.locator('#people').evaluate((el) => el.scrollIntoView());
    await expect
      .poll(() => bar.evaluate((el) => el.getBoundingClientRect().top))
      .toBeLessThan(2);
    await expect
      .poll(() => identity.evaluate((el) => el.getBoundingClientRect().width))
      .toBeGreaterThan(100);
    await expect(bar.locator('.ep-bar-name')).toHaveText(/Flogging Margins/);

    await play.click();
    await expect(page.locator('.dock-controls')).toContainText(
      'Flogging Margins'
    );
  });

  test('section links track the section in view and the indicator follows', async ({
    page,
    browserName
  }) => {
    await page.goto(page239);
    const nav = page.getByRole('navigation', { name: 'Episode sections' });
    await expect(nav.getByRole('link')).toHaveText([
      'Notes',
      'People',
      'Sponsors',
      'Transcript',
      'More episodes'
    ]);
    await expect(nav.getByRole('link', { name: 'Notes' })).toHaveAttribute(
      'aria-current',
      'true'
    );

    const transcript = nav.getByRole('link', { name: 'Transcript' });
    await transcript.click();
    await expect(page).toHaveURL(/#transcript$/);
    await expect(transcript).toHaveAttribute('aria-current', 'true');
    await expect(nav.getByRole('link', { name: 'Notes' })).not.toHaveAttribute(
      'aria-current'
    );

    if (browserName === 'chromium') {
      // One indicator, anchored to the current link, settles on it.
      await expect
        .poll(async () => {
          const here = await nav.locator('.ep-nav-here').boundingBox();
          const link = await transcript.boundingBox();
          return (
            Math.abs(here!.x - link!.x) + Math.abs(here!.width - link!.width)
          );
        })
        .toBeLessThan(2);
    }
  });

  // Focus moves to the section's heading either way; it is ringed only when
  // the link was followed from the keyboard (WebKit ringed it after a click).
  test('a clicked section link focuses its heading without a ring; Enter rings it', async ({
    page
  }) => {
    await page.goto(page239);
    const nav = page.getByRole('navigation', { name: 'Episode sections' });
    const ringed = (id: string) =>
      page.locator(`#${id} h2`).evaluate((h) => ({
        focused: h === document.activeElement,
        ring: h.matches(':focus-visible')
      }));

    await nav.getByRole('link', { name: 'Transcript' }).click();
    await expect
      .poll(() => ringed('transcript'))
      .toEqual({ focused: true, ring: false });

    await nav.getByRole('link', { name: 'People' }).focus();
    await page.keyboard.press('Enter');
    await expect
      .poll(() => ringed('people'))
      .toEqual({ focused: true, ring: true });
  });

  // With reduced motion a link jumps rather than glides. The link marked is
  // the one clicked, a short section included (Ep 230's sponsors), down the
  // page and back up, and the indicator sits on it.
  test('with reduced motion, the clicked section link is the one marked', async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/230');
    const nav = page.getByRole('navigation', { name: 'Episode sections' });
    // The bar's script is up once it marks the first section.
    await expect(nav.locator('a[aria-current]')).toHaveCount(1);
    const names = await nav.getByRole('link').allTextContents();
    const anchored = await page.evaluate(() =>
      CSS.supports('position-anchor', '--a')
    );
    for (const name of [...names, ...names.slice(0, -1).reverse()]) {
      const link = nav.getByRole('link', { name, exact: true });
      await link.click();
      await expect(link).toHaveAttribute('aria-current', 'true');
      await expect(nav.locator('a[aria-current]')).toHaveCount(1);
      // Where anchors place it, the indicator is drawn, on the link.
      if (anchored) {
        await expect
          .poll(async () => {
            const here = await nav.locator('.ep-nav-here').boundingBox();
            const box = (await link.boundingBox())!;
            return here && here.width > 0
              ? Math.max(
                  Math.abs(here.x - box.x),
                  Math.abs(here.width - box.width)
                )
              : Infinity;
          })
          .toBeLessThan(2);
      }
    }
  });

  test('a section link lands on its section across an open transcript', async ({
    page
  }) => {
    // Turn groups the glide passes render at their real height on the way.
    await page.goto(page239);
    await page.locator('#transcript').scrollIntoViewIfNeeded();
    await page.locator('.transcript-section .ep-more').click();
    await page
      .getByRole('navigation', { name: 'Episode sections' })
      .getByRole('link', { name: 'More episodes' })
      .click();
    await expect
      .poll(() =>
        page.locator('#more').evaluate((el) => {
          const margin = parseFloat(getComputedStyle(el).scrollMarginTop);
          return Math.abs(el.getBoundingClientRect().top - margin);
        })
      )
      .toBeLessThan(3);
  });

  // On phones the root's scroll padding adds to the sections' own margins,
  // and in landscape the bar sticks at the top: every link, clicked first
  // on a fresh page and then again from section to section, lands its
  // section 16px under the bar, and stays there.
  for (const [form, viewport] of [
    ['portrait', { width: 412, height: 839 }],
    ['landscape', { width: 839, height: 412 }]
  ] as const) {
    test(`on a ${form} phone, every section link lands its section just under the bar`, async ({
      page
    }) => {
      // Fifteen landings, each held 400ms: on CI's runners near 30s.
      test.slow();
      await page.setViewportSize(viewport);
      const nav = page.getByRole('navigation', { name: 'Episode sections' });
      const underBar = (href: string) =>
        page.evaluate((href) => {
          const bar = document
            .querySelector('.ep-bar')!
            .getBoundingClientRect();
          const top = document.querySelector(href)!.getBoundingClientRect().top;
          return Math.round(top - bar.bottom);
        }, href);
      // Where it settles: the same for 400ms, so a late re-aim can't pass.
      // Within a pixel of 16: WebKit scrolls by whole pixels and the bar's
      // edge can fall between two, so it lands a rounding either side.
      const settled = (href: string) =>
        expect
          .poll(async () => {
            const before = await underBar(href);
            await page.waitForTimeout(400);
            const after = await underBar(href);
            return after === before && Math.abs(after - 16) <= 1
              ? 'under the bar'
              : `${after}px`;
          })
          .toBe('under the bar');

      await page.goto(page239);
      const hrefs = await nav
        .getByRole('link')
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute('href')!)
        );
      expect(hrefs.length).toBe(5);

      // First click, each on a fresh page at the top.
      for (const href of hrefs) {
        await page.goto(page239);
        await nav.locator(`a[href="${href}"]`).click();
        await settled(href);
      }

      // Repeated: from section to section, back up the page, the same link
      // twice, and across an open transcript.
      for (const href of [...hrefs].reverse()) {
        await nav.locator(`a[href="${href}"]`).click();
        await settled(href);
      }
      await nav.locator(`a[href="${hrefs[0]}"]`).click();
      await settled(hrefs[0]);
      await page.locator('.transcript-section .ep-more').click();
      for (const href of ['#more', '#notes', '#more']) {
        await nav.locator(`a[href="${href}"]`).click();
        await settled(href);
      }
    });
  }

  test('a person opens in place to their other episodes', async ({ page }) => {
    await page.goto(page239);
    const person = page.getByRole('button', { name: /Chris Coyier/ });
    await person.scrollIntoViewIfNeeded();
    await expect(person).toHaveAttribute('aria-expanded', 'false');

    await person.click();
    await expect(person).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator(
      `#${await person.getAttribute('aria-controls')}`
    );
    await expect(panel).toBeVisible();
    await expect(
      panel.getByRole('link', { name: /Open-Source Ethics/ })
    ).toBeVisible();
    await expect(
      panel.getByRole('link', { name: 'All 3 episodes with Chris Coyier' })
    ).toHaveAttribute('href', '/#guest=chriscoyier');

    await person.click();
    await expect(person).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  });

  test('guests lead, hosts follow compactly, and a first line plays', async ({
    page
  }) => {
    // Episode 216: one guest and two hosts, with a transcript naming them.
    await page.goto('/216');
    const people = page.locator('#people');
    await people.scrollIntoViewIfNeeded();

    const guest = people.locator('[data-ep-person]');
    await expect(guest).toHaveCount(1);
    await expect(guest).toContainText('Shruti Kapoor');
    await expect(guest).toContainText('First time on the show');

    const hosted = people.locator('.ep-hosted');
    await expect(hosted).toContainText('Hosted by');
    await expect(
      hosted.getByRole('link', { name: /Jason Lengstorf/ })
    ).toHaveAttribute('href', /\/#guest=/);

    await guest.getByRole('button', { name: /^First speaks at/ }).click();
    await expect(page.locator('.dock-controls')).toContainText(
      'Why Open Source'
    );
    // Her first line is hers: her own row lights up.
    await expect(guest).toHaveAttribute('data-speaking', '', {
      timeout: 15000
    });
  });

  test('onward: previous, next, and a related shelf led by the guests', async ({
    page
  }) => {
    await page.goto(page239);
    const pager = page.getByRole('navigation', {
      name: 'Previous and next episode'
    });
    await expect(pager.locator('a[rel="prev"]')).toContainText('Ep 238');
    await expect(pager.locator('a[rel="next"]')).toContainText('Ep 240');

    const shelf = page.getByRole('list', { name: 'Related episodes' });
    await shelf.scrollIntoViewIfNeeded();
    const cards = shelf.getByRole('link');
    expect(await cards.count()).toBeGreaterThan(3);
    await expect(cards.first()).toContainText('With Chris Coyier');

    const href = await cards.first().getAttribute('href');
    await cards.first().click();
    // Client-side navigations take 5–9s in CI's Firefox under the suite's load.
    await expect(page).toHaveURL(new RegExp(`${href}$`), { timeout: 15_000 });
    await expect(page.locator('h1.stage-title')).toHaveText(
      /Open-Source Ethics/
    );
  });

  test('the transcript follows playback and jumps back to the live line', async ({
    page,
    browserName
  }) => {
    // Pinning to an edge is read from scroll-state queries (Chromium).
    test.skip(
      browserName !== 'chromium',
      'scroll-state queries are Chromium-only'
    );
    await page.goto('/230');
    // The button shows once prop-for-that finds the preview really clips.
    await page.locator('#transcript').scrollIntoViewIfNeeded();
    await page
      .getByRole('button', { name: 'Read the full transcript' })
      .click();

    const chip = page
      .locator('article.transcript .ep-turn-head [data-seek]')
      .first();
    await chip.click();
    const live = page.locator('article.transcript .ep-turn[data-live]');
    await expect(live).toHaveCount(1);

    // A marker pinned to the edge the live turn is past shows its button;
    // while any of the turn is on screen, none does.
    const jump = (click: boolean) =>
      page.evaluate((click) => {
        const button = [
          ...document.querySelectorAll<HTMLElement>('.ep-now-jump')
        ].find((candidate) => {
          const box = candidate.getBoundingClientRect();
          return (
            getComputedStyle(candidate).visibility === 'visible' &&
            box.bottom > 0 &&
            box.top < innerHeight
          );
        });
        if (click) {
          button?.click();
        }
        return Boolean(button);
      }, click);
    await live.scrollIntoViewIfNeeded();
    await expect.poll(() => jump(false)).toBe(false);
    await page.evaluate(() => window.scrollBy(0, 4000));
    await expect.poll(() => jump(false)).toBe(true);

    await jump(true);
    await expect(live).toBeInViewport();
    await expect(live.locator('[data-seek]')).toBeFocused();
  });
});

// WebKit's Tab, like Safari's by default, moves between form fields only;
// Option-Tab reaches links and buttons.
const tabKey = (browserName: string) =>
  browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

test.describe('episode page review fixes', () => {
  test("each person gets their own lines, not a namesake's (Ep 184)", async ({
    page
  }) => {
    await page.goto('/184');
    const travis = page.locator('[data-ep-person]', {
      hasText: 'Travis Wagner'
    });
    await expect(travis).toHaveAttribute('data-speaks-as', 'Travis Wagner');
    await expect(travis.locator('.ep-chip')).toHaveText('00:01:00');
    await expect(
      page.locator('.ep-hosted .person-chip', { hasText: 'RobbieTheWagner' })
    ).toHaveAttribute('data-speaks-as', 'Robbie Wagner');
    await expect(
      page.locator('.cast-member', { hasText: 'Travis Wagner' })
    ).toHaveAttribute('data-speaks-as', 'Travis Wagner');
  });

  test('a clamped transcript keeps what it hides out of reach, and opens to what it hid', async ({
    page
  }) => {
    await page.goto('/184');
    const controls = page.locator('.transcript-section .transcript button');
    const reachable = () =>
      controls.evaluateAll(
        (buttons) =>
          buttons.filter((button) => !button.closest('[hidden]')).length
      );
    expect(await reachable()).toBeLessThan(30);

    await page.locator('#transcript').scrollIntoViewIfNeeded();
    const open = page.locator('.transcript-section [data-ep-expand]');
    // It shows once the preview is measured as cut off.
    await expect(open).toBeVisible();
    await open.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.transcript')).not.toHaveAttribute(
      'data-clamped'
    );
    const focused = page.locator('.transcript [data-seek]:focus');
    await expect(focused).toBeInViewport();
    expect(await reachable()).toBeGreaterThan(600);
  });

  test('keyboard focus on what it cuts off, and find in page, open a clamped transcript', async ({
    page,
    browserName
  }) => {
    await page.goto('/184');
    await page.locator('#transcript').scrollIntoViewIfNeeded();
    await page
      .locator('#transcript-heading')
      .evaluate((heading: HTMLElement) => {
        heading.tabIndex = -1;
        heading.focus();
      });
    // Tabbing through what the preview shows leaves it a preview...
    await page.keyboard.press(tabKey(browserName));
    await expect(page.locator('.transcript')).toHaveAttribute('data-clamped');
    // ...and reaching something it cuts off opens it.
    await expect(async () => {
      await page.keyboard.press(tabKey(browserName));
      await expect(page.locator('.transcript')).not.toHaveAttribute(
        'data-clamped',
        { timeout: 100 }
      );
    }).toPass({ timeout: 10_000 });

    await page.goto('/184');
    await page
      .locator('.ep-turns[hidden]')
      .first()
      .evaluate((group) =>
        group.dispatchEvent(new Event('beforematch', { bubbles: true }))
      );
    await expect(page.locator('.transcript')).not.toHaveAttribute(
      'data-clamped'
    );
    await expect(page.locator('.ep-turns[hidden]')).toHaveCount(0);
  });

  test('a section link carries keyboard focus into its section, clear of the bar', async ({
    page,
    browserName
  }) => {
    await page.goto('/239');
    const link = page
      .getByRole('navigation', { name: 'Episode sections' })
      .getByRole('link', { name: 'Transcript' });
    await link.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press(tabKey(browserName));
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.closest('section')?.id)
      )
      .toBe('transcript');
    await expect
      .poll(() =>
        page.evaluate(() => {
          const control = document.activeElement!.getBoundingClientRect();
          const bar = document
            .querySelector('.ep-bar')!
            .getBoundingClientRect();
          return control.top >= bar.bottom;
        })
      )
      .toBe(true);
  });

  test("a host's lines light no namesake on another episode's page", async ({
    page,
    browserName
  }) => {
    test.skip(browserName !== 'chromium', 'plays media');
    // Ep 216's transcript calls the host "Robbie Wagner"; Ep 184 has a guest
    // called Travis Wagner.
    await page.goto('/216');
    await page.locator('.stage-play').click();
    await page.waitForFunction(
      () =>
        (document.querySelector('video.starpod-media') as HTMLVideoElement)
          ?.currentTime > 0.5
    );
    await page.evaluate(() => {
      const link = document.createElement('a');
      link.href = '/184';
      link.id = 'to-184';
      link.textContent = 'Ep 184';
      document.body.append(link);
    });
    await page.locator('#to-184').evaluate((link: HTMLElement) => link.click());
    // Client-side navigations take up to ~9s on CI's runners under load.
    await expect(page).toHaveURL(/\/184$/, { timeout: 15_000 });
    // Play on from one of Robbie's lines.
    const robbie = await page.evaluate(async () => {
      const cues = await (
        await fetch(
          '/api/cues/why-open-source-might-be-your-best-career-move-w-shruti-kapoor.json'
        )
      ).json();
      return cues.find(
        (cue: { n?: string; s: number }) =>
          cue.n === 'Robbie Wagner' && cue.s > 60
      ).s;
    });
    await page.evaluate((at) => {
      const media = document.querySelector(
        '.starpod-media'
      ) as HTMLMediaElement;
      media.currentTime = at + 0.5;
      void media.play();
    }, robbie);
    const hostChip = page.locator('.ep-hosted .person-chip', {
      hasText: 'RobbieTheWagner'
    });
    await expect(hostChip).toHaveAttribute('data-speaking', '');
    await expect(
      page.locator('[data-ep-person]', { hasText: 'Travis Wagner' })
    ).not.toHaveAttribute('data-speaking');
  });
});

test.describe('the section bar and the dock', () => {
  test('at scroll 0 the bar sits under the dock, whose play button takes the click', async ({
    page
  }) => {
    // Ep 50's stage is short enough that, at this size, the bar falls right
    // where the dock floats before the page has scrolled at all.
    await page.setViewportSize({ width: 1460, height: 880 });
    await page.goto('/50');
    await page.locator('.stage-play').click();
    const media = page.locator('.starpod-media');
    await expect
      .poll(() => media.evaluate((m: HTMLMediaElement) => !m.paused))
      .toBe(true);
    await page.evaluate(() => scrollTo(0, 0));

    const dock = page.locator('.island');
    const play = dock.locator('.dock-play');
    await expect(play).toBeVisible();
    const [bar, island] = await Promise.all([
      page.locator('.ep-bar').boundingBox(),
      dock.boundingBox()
    ]);
    // The bar really is under the dock here.
    expect(bar!.y + bar!.height).toBeGreaterThan(island!.y);
    expect(bar!.y).toBeLessThan(island!.y + island!.height);

    await play.click();
    await expect
      .poll(() => media.evaluate((m: HTMLMediaElement) => m.paused))
      .toBe(true);
  });
});

test.describe('the stage, split', () => {
  test('presets, keys and a drag move one divider, and the choice persists', async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName !== 'chromium',
      'anchored-auto-layout needs typed attr() (Chromium); elsewhere the stage keeps its grid'
    );
    await page.goto('/230');
    await page.evaluate(() => localStorage.removeItem('starpod:split'));
    await page.reload();

    const divider = page.getByRole('separator', {
      name: 'Resize the picture and the transcript'
    });
    const presets = page.getByRole('group', { name: 'Stage layout' });
    const pressed = (name: string) =>
      expect(presets.getByRole('button', { name })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    const width = (selector: string) => () =>
      page
        .locator(selector)
        .evaluate((el) => Math.round(el.getBoundingClientRect().width));
    const picture = width('[data-media-slot]');
    const transcript = width('.stage-script');

    await pressed('Balanced');
    const balanced = await picture();
    const balancedTranscript = await transcript();

    // The picture gives up room and the transcript takes it.
    await presets.getByRole('button', { name: 'Read' }).click();
    await pressed('Read');
    await expect.poll(picture).toBeLessThan(balanced - 50);
    await expect.poll(transcript).toBeGreaterThan(balancedTranscript + 50);

    // Alt+Arrow is the browser's Back and Forward: the divider leaves it.
    await divider.focus();
    await page.keyboard.down('Alt');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.up('Alt');
    await pressed('Read');

    // Arrow keys step between the stops.
    await divider.focus();
    await page.keyboard.press('ArrowRight');
    await pressed('Balanced');
    await page.keyboard.press('End');
    await pressed('Watch');
    await expect.poll(picture).toBeGreaterThan(balanced + 50);

    // A drag writes the position straight away; let go after stopping and
    // it settles on the nearest stop.
    await expect
      .poll(() => divider.evaluate((el) => el.getAnimations().length))
      .toBe(0);
    const box = (await divider.boundingBox())!;
    await page.mouse.move(box.x + 1, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x - 260, box.y + 100, { steps: 8 });
    await expect(presets.locator('[aria-pressed="true"]')).toHaveCount(0);
    await page.waitForTimeout(150);
    await page.mouse.up();
    await pressed('Read');

    await page.reload();
    await pressed('Read');
    await expect.poll(picture).toBeLessThan(balanced - 50);
  });

  test('a chosen preset stays pressed, its indicator on it, as the window changes width', async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName !== 'chromium',
      'anchored-auto-layout needs typed attr() (Chromium); elsewhere the stage keeps its grid'
    );
    // Read chosen (Home on the divider) where its stop is clamped, then the
    // window widened and narrowed: it stays Read, and the indicator never
    // animates.
    await page.setViewportSize({ width: 1040, height: 800 });
    await page.goto('/230');
    await page.evaluate(() => localStorage.removeItem('starpod:split'));
    await page.reload();
    const read = page.locator('.ep-presets [data-preset=read]');
    await page.locator('.ep-split').focus();
    await page.keyboard.press('Home');
    await expect(read).toHaveAttribute('aria-pressed', 'true');
    const thumb = page.locator('.ep-presets-on');
    await expect
      .poll(() => thumb.evaluate((el) => el.getAnimations().length))
      .toBe(0);
    for (const width of [1440, 1200, 1040]) {
      await page.setViewportSize({ width, height: 800 });
      await expect(read).toHaveAttribute('aria-pressed', 'true');
      expect(await thumb.evaluate((el) => el.getAnimations().length)).toBe(0);
      const [a, b] = await Promise.all([
        thumb.boundingBox(),
        read.boundingBox()
      ]);
      expect(
        Math.abs(a!.x - b!.x) + Math.abs(a!.width - b!.width)
      ).toBeLessThan(1);
    }
  });

  test('presets and a resize leave no ResizeObserver loop', async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName !== 'chromium',
      'anchored-auto-layout needs typed attr() (Chromium); elsewhere the stage keeps its grid'
    );
    await page.addInitScript(() => {
      (window as any).__loops = 0;
      addEventListener('error', (event) => {
        if (String(event.message).includes('ResizeObserver')) {
          (window as any).__loops++;
        }
      });
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/230');
    const presets = page.getByRole('group', { name: 'Stage layout' });
    for (const name of ['Watch', 'Read', 'Balanced']) {
      await presets.getByRole('button', { name }).click();
      await page.waitForTimeout(400);
    }
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => (window as any).__loops)).toBe(0);
  });

  test('phones keep the stacked stage with no divider', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/230');
    await expect(page.locator('.stage-room')).toBeVisible();
    await expect(page.locator('.ep-split')).toBeHidden();
    await expect(page.locator('.ep-presets')).toBeHidden();
  });
});

test.describe('the stage on phones', () => {
  const top = (page: Page, selector: string) =>
    page
      .locator(selector)
      .first()
      .evaluate((el) => Math.round(el.getBoundingClientRect().top));

  test('the title comes before the transcript preview, and the live script takes its place once playing', async ({
    page
  }) => {
    await page.setViewportSize({ width: 393, height: 659 });
    await page.goto('/230');
    await expect(page.locator('.script[data-state="preview"]')).toBeVisible();

    // Before playback: picture, then the title on the first screen, then
    // the preview.
    const title = await top(page, '.stage-title');
    expect(title).toBeLessThan(await top(page, '.stage-script'));
    expect(title).toBeLessThan(await top(page, '.tabbar'));

    // Playing: the script moves up under the picture, which stays put.
    const frame = await top(page, '.stage-frame');
    await page.locator('.stage-play').click();
    await expect(page.locator('.stage[data-current]')).toBeVisible();
    await expect
      .poll(
        async () =>
          (await top(page, '.stage-script')) < (await top(page, '.stage-title'))
      )
      .toBe(true);
    expect(await top(page, '.stage-frame')).toBe(frame);
  });

  test('landscape: the picture fits between the bars, with the title and Play beside it', async ({
    page
  }) => {
    await page.setViewportSize({ width: 734, height: 343 });
    await page.goto('/230');
    const box = async (selector: string) =>
      (await page.locator(selector).first().boundingBox())!;
    const floor = (await box('.tabbar')).y;
    const frame = await box('.stage-frame');
    const title = await box('.stage-title');

    expect(frame.y + frame.height).toBeLessThanOrEqual(floor);
    expect(frame.width / frame.height).toBeCloseTo(16 / 9, 1);
    expect(title.x).toBeGreaterThan(frame.x + frame.width);
    for (const play of ['.stage-play', '.stage-actions .button-primary']) {
      const { y, height } = await box(play);
      expect(y + height).toBeLessThanOrEqual(floor);
    }
  });
});
