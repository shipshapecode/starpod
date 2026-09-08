import { afterEach, describe, expect, it, vi } from 'vitest';

import { ALL, POST } from 'starpod/src/pages/api/contact';
import { __resetRateLimitBucketsForTests } from 'starpod/src/lib/rate-limit';

type ApiContext = Parameters<typeof POST>[0];

function postContext(
  body: FormData | string,
  headers?: Record<string, string>
): ApiContext {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    body,
    headers
  });
  return { request } as ApiContext;
}

function validForm(): FormData {
  const form = new FormData();
  form.set('name', 'Test Person');
  form.set('email', 'test@example.com');
  form.set('message', 'Hello!');
  return form;
}

describe('contact API', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    __resetRateLimitBucketsForTests();
  });

  it('returns structured JSON 400 when fields are missing', async () => {
    const form = new FormData();
    form.set('name', 'Only Name');

    const response = await POST(postContext(form));
    expect(response.status).toBe(400);
    expect(response.headers.get('Content-Type')).toContain('application/json');

    const body = await response.json();
    expect(body.error.code).toBe('missing_fields');
    expect(body.error.message).toContain('email');
    expect(body.error.message).toContain('message');
    expect(body.error.hint).toBeTruthy();
  });

  it('returns structured JSON 500 when the webhook is not configured', async () => {
    const response = await POST(postContext(validForm()));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe('not_configured');
  });

  it('returns structured JSON 502 when delivery fails', async () => {
    vi.stubEnv('DISCORD_WEBHOOK', 'https://discord.example.com/webhook');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('nope', { status: 500 }))
    );

    const response = await POST(postContext(validForm()));

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error.code).toBe('delivery_failed');
    expect(body.error.hint).toBeTruthy();
  });

  it('returns JSON success when delivery works', async () => {
    vi.stubEnv('DISCORD_WEBHOOK', 'https://discord.example.com/webhook');
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(postContext(validForm()));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    const body = await response.json();
    expect(body.message).toContain('Thanks');
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('returns structured JSON 405 with Allow header for other methods', async () => {
    const response = await ALL({
      request: new Request('http://localhost/api/contact', { method: 'GET' })
    } as ApiContext);

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
    const body = await response.json();
    expect(body.error.code).toBe('method_not_allowed');
  });

  it('attaches RateLimit-* headers to a successful response', async () => {
    vi.stubEnv('DISCORD_WEBHOOK', 'https://discord.example.com/webhook');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    );

    const response = await POST(
      postContext(validForm(), { 'x-forwarded-for': '203.0.113.10' })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('RateLimit-Limit')).toBe('5');
    expect(response.headers.get('RateLimit-Remaining')).toBe('4');
    expect(response.headers.get('RateLimit-Reset')).toBeTruthy();
  });

  it('returns structured JSON 429 with Retry-After once the limit is exceeded', async () => {
    vi.stubEnv('DISCORD_WEBHOOK', 'https://discord.example.com/webhook');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    );

    const ip = { 'x-forwarded-for': '203.0.113.11' };
    for (let i = 0; i < 5; i++) {
      const response = await POST(postContext(validForm(), ip));
      expect(response.status).toBe(200);
    }

    const limited = await POST(postContext(validForm(), ip));

    expect(limited.status).toBe(429);
    expect(limited.headers.get('RateLimit-Remaining')).toBe('0');
    expect(limited.headers.get('Retry-After')).toBeTruthy();
    const body = await limited.json();
    expect(body.error.code).toBe('rate_limited');
  });

  it('tracks rate limits per client independently', async () => {
    vi.stubEnv('DISCORD_WEBHOOK', 'https://discord.example.com/webhook');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    );

    const clientOne = { 'x-forwarded-for': '203.0.113.12' };
    const clientTwo = { 'x-forwarded-for': '203.0.113.13' };

    for (let i = 0; i < 5; i++) {
      await POST(postContext(validForm(), clientOne));
    }

    const stillAllowed = await POST(postContext(validForm(), clientTwo));

    expect(stillAllowed.status).toBe(200);
  });
});
