// Throwaway probe: why the audio episode tests fail in CI's Firefox.
// Prints PROBE lines; not meant to be merged.
import { expect, test, type Page } from '@playwright/test';

test.setTimeout(120_000);

const VIDEO_EPISODE = '/will-ai-kill-us-all-jev-says-87';
const log = (...args: unknown[]) => console.log('PROBE', ...args);
const media = (page: Page) => page.locator('video.starpod-media');

async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(
    page.locator('astro-island:has(.stage-play)').first()
  ).not.toHaveAttribute('ssr', { timeout: 30_000 });
}

const state = (page: Page) =>
  page.evaluate(() => {
    const v = document.querySelector<HTMLVideoElement>('video.starpod-media');
    const frame = document.querySelector('[data-stage-frame]');
    const r = frame?.getBoundingClientRect();
    const d = document.documentElement.dataset;
    return {
      scrollY: Math.round(scrollY),
      docH: document.documentElement.scrollHeight,
      innerH: innerHeight,
      frame: r ? [Math.round(r.top), Math.round(r.bottom)] : null,
      home: v?.parentElement?.className,
      t: v ? Math.round(v.currentTime * 10) / 10 : null,
      dur: v?.duration,
      paused: v?.paused,
      ended: v?.ended,
      ready: v?.readyState,
      net: v?.networkState,
      err: v?.error?.code,
      src: v?.currentSrc?.slice(-40),
      picture: d.picture,
      medium: d.medium,
      playing: d.playing,
      host: d.host,
      name: document.querySelector('.island-name b')?.textContent?.slice(0, 30),
      hover: (() => {
        const el = document.querySelectorAll(':hover');
        return el[el.length - 1]?.className?.toString().slice(0, 40);
      })()
    };
  });

function quietWav(seconds = 6, rate = 8000) {
  const data = seconds * rate * 2;
  const wav = Buffer.alloc(44 + data);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + data, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(data, 40);
  return wav;
}

for (const variant of ['route-wav', 'route-wav-206', 'src-wav']) {
  test(`audio ${variant}`, async ({ page }) => {
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') {
        log(variant, 'console', m.type(), m.text().slice(0, 160));
      }
    });
    page.on('pageerror', (e) => log(variant, 'pageerror', String(e).slice(0, 200)));
    const body = quietWav();
    let hits = 0;
    if (variant.startsWith('route')) {
      await page.route(/\.mp3(\?|$)/, (route) => {
        hits++;
        log(variant, 'route hit', route.request().url().slice(-50), route.request().headers()['range']);
        return variant === 'route-wav'
          ? route.fulfill({ status: 200, contentType: 'audio/wav', body })
          : route.fulfill({
              status: 206,
              contentType: 'audio/wav',
              headers: { 'Accept-Ranges': 'bytes', 'Content-Range': `bytes 0-${body.length - 1}/${body.length}` },
              body
            });
      });
    }
    page.on('request', (r) => {
      if (/\.mp3|atelier|flightcast/.test(r.url())) log(variant, 'request', r.url().slice(-60));
    });
    if (variant === 'src-wav') {
      // Serve the WAV from the dev server's own origin instead.
      await page.route('**/__quiet.wav', (route) => route.fulfill({ status: 200, contentType: 'audio/wav', body }));
      await page.addInitScript(() => {
        const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src')!;
        Object.defineProperty(HTMLMediaElement.prototype, 'src', {
          ...desc,
          set(value: string) {
            desc.set!.call(this, /\.mp3/.test(value) ? '/__quiet.wav' : value);
          }
        });
      });
    }
    await page.addInitScript(() => {
      for (const type of ['play', 'playing', 'pause', 'seeking', 'seeked', 'ended', 'error', 'emptied', 'loadstart', 'waiting', 'stalled']) {
        document.addEventListener(
          type,
          (e) => {
            const v = e.target as HTMLVideoElement;
            if (v instanceof HTMLMediaElement) {
              console.info(`MEDIA ${type} t=${v.currentTime.toFixed(1)} d=${v.duration} src=${v.currentSrc.slice(-30)}`);
            }
          },
          true
        );
      }
    });
    page.on('console', (m) => {
      if (m.text().startsWith('MEDIA')) log(variant, m.text());
    });

    await open(page, VIDEO_EPISODE);
    await page.getByRole('button', { name: 'Up next' }).click();
    await open(page, '/120');
    await page.getByRole('button', { name: /^Play episode 120/ }).first().click();
    await page.waitForTimeout(3000);
    log(variant, 'after play', JSON.stringify(await state(page)));

    await page.mouse.wheel(0, 1500);
    for (const ms of [300, 1000, 3000]) {
      await page.waitForTimeout(ms);
      log(variant, `wheel+${ms}`, JSON.stringify(await state(page)));
    }
    await page.evaluate(() => scrollBy(0, 1500));
    await page.waitForTimeout(1500);
    log(variant, 'scrollBy', JSON.stringify(await state(page)));

    await media(page).evaluate((v) => {
      const el = v as HTMLVideoElement;
      el.currentTime = el.duration - 1;
    });
    log(variant, 'route hits', hits);
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(2500);
      log(variant, `end+${(i + 1) * 2.5}s`, JSON.stringify(await state(page)));
    }
  });
}
