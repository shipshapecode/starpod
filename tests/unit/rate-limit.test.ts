import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __debugBucketCount,
  __resetRateLimitBucketsForTests,
  checkRateLimit,
  clientKey,
  rateLimitHeaders
} from 'starpod/src/lib/rate-limit';

describe('rate-limit', () => {
  afterEach(() => {
    __resetRateLimitBucketsForTests();
    vi.useRealTimers();
  });

  it('allows requests up to the limit within the window', () => {
    const opts = { limit: 3, windowMs: 60_000 };

    const first = checkRateLimit('client-a', opts);
    const second = checkRateLimit('client-a', opts);
    const third = checkRateLimit('client-a', opts);

    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);
    expect(second.remaining).toBe(1);
    expect(third.remaining).toBe(0);
  });

  it('rejects requests once the limit is exceeded', () => {
    const opts = { limit: 2, windowMs: 60_000 };

    checkRateLimit('client-b', opts);
    checkRateLimit('client-b', opts);
    const third = checkRateLimit('client-b', opts);

    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it('tracks separate clients independently', () => {
    const opts = { limit: 1, windowMs: 60_000 };

    const a = checkRateLimit('client-c', opts);
    const b = checkRateLimit('client-d', opts);

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });

  it('resets the window once it elapses', () => {
    vi.useFakeTimers();
    const opts = { limit: 1, windowMs: 1_000 };

    const first = checkRateLimit('client-e', opts);
    expect(first.allowed).toBe(true);

    const blocked = checkRateLimit('client-e', opts);
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(1_001);

    const afterWindow = checkRateLimit('client-e', opts);
    expect(afterWindow.allowed).toBe(true);
    expect(afterWindow.remaining).toBe(0);
  });

  it('derives the client key from x-vercel-forwarded-for when present', () => {
    const request = new Request('http://localhost/api/contact', {
      headers: { 'x-vercel-forwarded-for': '203.0.113.4' }
    });

    expect(clientKey(request)).toBe('203.0.113.4');
  });

  it('falls back to x-forwarded-for, taking the first hop, when there is no x-vercel-forwarded-for', () => {
    const request = new Request('http://localhost/api/contact', {
      headers: { 'x-forwarded-for': '203.0.113.4, 10.0.0.1' }
    });

    expect(clientKey(request)).toBe('203.0.113.4');
  });

  it('prefers x-vercel-forwarded-for over x-forwarded-for when both are present', () => {
    const request = new Request('http://localhost/api/contact', {
      headers: {
        'x-vercel-forwarded-for': '203.0.113.4',
        'x-forwarded-for': '198.51.100.9'
      }
    });

    expect(clientKey(request)).toBe('203.0.113.4');
  });

  it('falls back to a shared key when there is no forwarding header', () => {
    const request = new Request('http://localhost/api/contact');

    expect(clientKey(request)).toBe('unknown');
  });

  it('formats RateLimit-Limit and RateLimit-Remaining as-is', () => {
    const headers = rateLimitHeaders({
      allowed: true,
      limit: 5,
      remaining: 4,
      resetAt: Math.floor(Date.now() / 1000) + 30
    });

    expect(headers['RateLimit-Limit']).toBe('5');
    expect(headers['RateLimit-Remaining']).toBe('4');
  });

  it('formats RateLimit-Reset as seconds until reset, not an absolute epoch', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_700_000_000_000);

    const headers = rateLimitHeaders({
      allowed: true,
      limit: 5,
      remaining: 4,
      resetAt: 1_700_000_030 // 30s after the current mocked time
    });

    expect(headers['RateLimit-Reset']).toBe('30');
  });

  it('never reports a negative RateLimit-Reset for an already-elapsed window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_700_000_100_000);

    const headers = rateLimitHeaders({
      allowed: true,
      limit: 5,
      remaining: 4,
      resetAt: 1_700_000_000 // already in the past relative to mocked time
    });

    expect(headers['RateLimit-Reset']).toBe('0');
  });

  it('prunes expired buckets so the store does not grow unbounded', () => {
    vi.useFakeTimers();
    const opts = { limit: 1, windowMs: 1_000 };

    checkRateLimit('client-f', opts);
    checkRateLimit('client-g', opts);
    expect(__debugBucketCount()).toBe(2);

    vi.advanceTimersByTime(1_001);
    checkRateLimit('client-h', opts);

    // client-f and client-g's windows elapsed and get pruned on the next
    // call; only the fresh client-h bucket should remain.
    expect(__debugBucketCount()).toBe(1);
  });
});
