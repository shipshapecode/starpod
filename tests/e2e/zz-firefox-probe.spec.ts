// Throwaway probe: why the close-up's artwork lands 54px above its slot in
// CI's Firefox. Prints PROBE lines; not meant to be merged.
import { test, type Page } from '@playwright/test';

const log = (...args: unknown[]) => console.log('PROBE', ...args);

const snap = (page: Page) =>
  page.evaluate(() => {
    const r = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return [b.left, b.top, b.width, b.height].map(Math.round);
    };
    const art = document.querySelector('.xp-card[data-on] .xp-art');
    const cs = art && getComputedStyle(art);
    const scrollers = [...document.querySelectorAll('*')]
      .filter((el) => el.scrollTop > 0)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 20)}=${el.scrollTop}`);
    return {
      scrollY: Math.round(scrollY),
      scrollers,
      art: r('.xp-card[data-on] .xp-art'),
      slot: r('.xp-cu-art'),
      stage: r('.xp-stage'),
      bar: r('[data-xp-bar]'),
      cu: r('.xp-cu'),
      artPos: cs && [cs.position, cs.top, cs.left, cs.translate, cs.transform].join(' | '),
      cb: (art as HTMLElement | null)?.offsetParent?.className?.toString().slice(0, 40)
    };
  });

for (const at of ['top', 'scrolled']) {
  test(`close-up ${at}`, async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-explorer][data-live]').waitFor({ state: 'attached' });
    if (at === 'scrolled') {
      await page.evaluate(() => scrollTo(0, 600));
      await page.waitForTimeout(500);
    }
    log(at, 'before', JSON.stringify(await snap(page)));
    await page.locator('.xp-card:not([hidden])').nth(2).locator('.xp-art').click();
    for (const ms of [100, 500, 1500, 4000]) {
      await page.waitForTimeout(ms);
      log(at, `+${ms}`, JSON.stringify(await snap(page)));
    }
    // Does a scroll nudge, or a style flush, bring it home?
    await page.evaluate(() => {
      scrollBy(0, 1);
      scrollBy(0, -1);
    });
    await page.waitForTimeout(300);
    log(at, 'nudged', JSON.stringify(await snap(page)));
    await page.evaluate(() => {
      const art = document.querySelector<HTMLElement>('.xp-card[data-on] .xp-art')!;
      art.style.positionAnchor = 'none';
      void art.offsetTop;
      art.style.positionAnchor = '';
    });
    await page.waitForTimeout(300);
    log(at, 're-anchored', JSON.stringify(await snap(page)));
  });
}
