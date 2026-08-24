import { afterEach, describe, expect, it, vi } from 'vitest';

import { ALL, POST } from 'starpod/src/pages/api/contact';

type ApiContext = Parameters<typeof POST>[0];

function postContext(body: FormData | string): ApiContext {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    body
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
});
