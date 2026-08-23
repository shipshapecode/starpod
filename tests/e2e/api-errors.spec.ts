import { expect, test } from '@playwright/test';

test.describe('contact API errors', () => {
  test('missing fields return a structured JSON 400', async ({
    baseURL,
    request
  }) => {
    // Astro's CSRF protection rejects form POSTs without a matching Origin,
    // which browsers always send.
    const response = await request.post('/api/contact', {
      headers: { Origin: baseURL! },
      multipart: { name: 'Only Name' }
    });

    expect(response.status()).toBe(400);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.error.code).toBe('missing_fields');
    expect(body.error.hint).toBeTruthy();
  });

  test('non-POST methods return a structured JSON 405', async ({
    request
  }) => {
    const response = await request.get('/api/contact');

    expect(response.status()).toBe(405);
    const body = await response.json();
    expect(body.error.code).toBe('method_not_allowed');
  });
});
