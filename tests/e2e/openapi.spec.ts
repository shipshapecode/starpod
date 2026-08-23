import { expect, test } from '@playwright/test';

test.describe('OpenAPI spec', () => {
  test('is published at /openapi.json', async ({ request }) => {
    const response = await request.get('/openapi.json');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const spec = await response.json();
    expect(spec.openapi).toBe('3.1.0');
    expect(spec.paths['/api/contact']).toBeTruthy();
    expect(spec.paths['/api/episodes/search.json']).toBeTruthy();
  });
});
