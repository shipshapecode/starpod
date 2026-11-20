// Throwaway probe: what blocks Firefox's main thread on the home page?
// Prints PROBE lines; not meant to be merged.
import { test, type Page } from '@playwright/test';

test.setTimeout(240_000);

const variants: Record<string, string> = {
  baseline: '',
  'no-motion':
    '*,*::before,*::after{animation:none!important;transition:none!important;view-transition-name:none!important}',
  'no-effects':
    '*,*::before,*::after{filter:none!important;backdrop-filter:none!important;box-shadow:none!important;mask:none!important;mix-blend-mode:normal!important}',
  'no-anchors':
    '*,*::before,*::after{position-anchor:none!important;anchor-name:none!important}',
  'no-containers':
    '*,*::before,*::after{container-type:normal!important;content-visibility:visible!important}',
  'no-cv': '*,*::before,*::after{content-visibility:visible!important}',
  'no-ct': '*,*::before,*::after{container-type:normal!important}'
};

const log = (...args: unknown[]) => console.log('PROBE', ...args);

// Driver round trips while idle: a blocked main thread shows as a slow one.
async function roundTrips(page: Page, ms = 3000) {
  const times: number[] = [];
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const t = Date.now();
    await page.evaluate(() => 0);
    times.push(Date.now() - t);
  }
  times.sort((a, b) => a - b);
  return {
    n: times.length,
    p50: times[Math.floor(times.length / 2)],
    max: times.at(-1)
  };
}

// rAF gaps in the page over a window.
const frames = (page: Page, ms = 2000) =>
  page.evaluate(
    (ms) =>
      new Promise<{ n: number; max: number; over50: number }>((done) => {
        const gaps: number[] = [];
        let last = performance.now();
        const start = last;
        const tick = (now: number) => {
          gaps.push(now - last);
          last = now;
          if (now - start < ms) {
            requestAnimationFrame(tick);
          } else {
            done({
              n: gaps.length,
              max: Math.round(Math.max(...gaps)),
              over50: gaps.filter((g) => g > 50).length
            });
          }
        };
        requestAnimationFrame(tick);
      }),
    ms
  );

test('features', async ({ page }) => {
  await page.goto('/');
  log(
    'supports',
    JSON.stringify(
      await page.evaluate(() =>
        Object.fromEntries(
          [
            ['anchor-name', '--a'],
            ['position-anchor', '--a'],
            ['timeline-trigger', '--t view()'],
            ['animation-timeline', 'view()'],
            ['reading-flow', 'grid-order'],
            ['grid-template-rows', 'subgrid'],
            ['overflow-clip-margin', '1px'],
            ['container-type', 'anchored'],
            ['container-type', 'scroll-state'],
            ['content-visibility', 'auto'],
            ['view-transition-name', 'a']
          ].map(([p, v]) => [`${p}: ${v}`, CSS.supports(p!, v!)])
        )
      )
    )
  );
  log('cards', await page.locator('.xp-card').count(), 'dom', await page.evaluate(() => document.querySelectorAll('*').length));
});

for (const [name, css] of Object.entries(variants)) {
  test(`home ${name}`, async ({ page }) => {
    if (css) {
      await page.addInitScript((css) => {
        const add = () => {
          const style = document.createElement('style');
          style.dataset.probe = '';
          style.textContent = css;
          document.head.append(style);
        };
        if (document.head) add();
        else document.addEventListener('DOMContentLoaded', add);
        // Survive client-side navigations, which swap the head.
        document.addEventListener('astro:after-swap', () => {
          if (!document.querySelector('style[data-probe]')) add();
        });
      }, css);
    }
    let t = Date.now();
    await page.goto('/');
    const live = page.locator('[data-explorer][data-live]');
    await live.waitFor({ state: 'attached', timeout: 60_000 }).catch(() => {});
    log(name, 'load-to-live', Date.now() - t);
    log(name, 'idle top', JSON.stringify(await roundTrips(page)), JSON.stringify(await frames(page)));

    t = Date.now();
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.4));
    log(name, 'scroll-call', Date.now() - t);
    log(name, 'idle 40%', JSON.stringify(await roundTrips(page)), JSON.stringify(await frames(page)));

    // The slow journey from the failing tests: out to an episode and back,
    // twice (the first visit also pays the dev server's compile).
    await page.evaluate(() => scrollTo(0, 0));
    for (const round of [1, 2]) {
      const link = page.locator('.xp-card:not([hidden]) .xp-title a').nth(round);
      t = Date.now();
      await link.click({ timeout: 30_000 }).catch((e) => log(name, round, 'click failed', String(e).slice(0, 80)));
      await page.waitForURL((url) => url.pathname !== '/', { timeout: 60_000 }).catch(() => log(name, round, 'never left'));
      log(name, round, 'to-episode', Date.now() - t);
      log(name, round, 'idle episode', JSON.stringify(await roundTrips(page, 2000)));
      t = Date.now();
      await page.goBack();
      await live.waitFor({ state: 'attached', timeout: 60_000 }).catch(() => log(name, round, 'back: never live'));
      log(name, round, 'back-to-live', Date.now() - t);
      log(name, round, 'idle back', JSON.stringify(await roundTrips(page, 2000)), JSON.stringify(await frames(page)));
    }
  });
}
