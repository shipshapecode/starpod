import { expect, test } from '@playwright/test';

test.describe('agent-friendly 404s', () => {
  test('nonexistent paths return a real 404 with the styled page', async ({
    page
  }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('link', { name: 'All episodes' })
    ).toBeVisible();
  });

  test('markdown-accepting agents get a markdown 404 body', async ({
    request
  }) => {
    const response = await request.get('/this-page-does-not-exist', {
      headers: { Accept: 'text/markdown' }
    });

    expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).toContain('text/markdown');
    expect(response.headers()['vary']).toContain('Accept');

    const body = await response.text();
    expect(body).toContain('## Where To Look Next');
    expect(body).toContain('/llms.txt');
    expect(body).toContain('/episodes-index.html.md');
  });

  test('unknown API paths return a structured JSON 404', async ({
    request
  }) => {
    const response = await request.get('/api/this-endpoint-does-not-exist');

    expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.error.code).toBe('not_found');
    expect(body.error.hint).toContain('/openapi.json');
  });
});
