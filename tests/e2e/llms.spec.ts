import { expect, test } from '@playwright/test';

test.describe('llms.txt', () => {
  test('includes when-to-use guidance and developer resources', async ({
    request
  }) => {
    const response = await request.get('/llms.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('## When To Use This Site');
    expect(body).toContain('## Developer Resources');
    expect(body).toContain('/openapi.json');
  });
});

test.describe('markdown twins', () => {
  test('homepage markdown is served at /index.html.md', async ({ request }) => {
    const response = await request.get('/index.html.md');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/markdown');

    const body = await response.text();
    expect(body).toContain('## Latest Episodes');
  });

  test('contact markdown is served at /contact.html.md', async ({
    request
  }) => {
    const response = await request.get('/contact.html.md');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/markdown');

    const body = await response.text();
    expect(body).toContain('/api/contact');
  });
});
