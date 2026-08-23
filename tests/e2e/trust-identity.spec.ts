import { expect, test } from '@playwright/test';

test.describe('JSON-LD identity', () => {
  test('homepage JSON-LD carries full Organization identity', async ({
    page
  }) => {
    await page.goto('/');

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const schema = JSON.parse(jsonLd!);

    expect(schema['@type']).toBe('PodcastSeries');
    expect(schema.publisher['@type']).toBe('Organization');
    expect(schema.publisher.url).toBeTruthy();
    expect(schema.publisher.logo).toBeTruthy();
    expect(schema.publisher.sameAs.length).toBeGreaterThan(0);
  });
});

test.describe('contact trust page', () => {
  test('has substantive contact content beyond the form', async ({ page }) => {
    await page.goto('/contact');

    await expect(
      page.getByRole('heading', { name: 'Get in touch' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Reach the hosts directly' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Follow the show' })
    ).toBeVisible();
  });
});
