/**
 * Fixed-window rate limiting for API routes, scoped to a single deployed
 * instance. Good enough to signal real limits on the write-side contact
 * endpoint; not a substitute for a shared store (Upstash, Vercel KV, etc.)
 * if this ever needs to hold across multiple instances/regions.
 */

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Epoch seconds the current window resets at. */
  resetAt: number;
}

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Drops any bucket whose window has already elapsed, so the map only ever
 * holds entries for clients currently inside an active window - otherwise
 * it grows forever, one entry per unique client key ever seen. */
function pruneExpiredBuckets(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  pruneExpiredBuckets(now);
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetAt: Math.ceil(resetAt / 1000)
    };
  }

  bucket.count += 1;

  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: Math.ceil(bucket.resetAt / 1000)
  };
}

/**
 * Derives a rate-limit key from the client's IP, falling back to a shared
 * bucket if no forwarding header is present (e.g. local dev).
 *
 * Prefers `x-vercel-forwarded-for`: on Vercel (this project's target
 * deployment), `x-forwarded-for` is already overwritten at the edge and
 * client-supplied values are stripped, so both headers carry the same real
 * IP there - but `x-vercel-forwarded-for` stays trustworthy even behind an
 * extra reverse proxy in front of Vercel, where `x-forwarded-for` could be
 * appended to instead of replaced. Deployed anywhere else (not Vercel),
 * `x-forwarded-for` is only as trustworthy as whatever's terminating TLS in
 * front of the app - fine for this project's actual target, worth keeping
 * in mind for anyone self-hosting the OSS template differently.
 */
export function clientKey(request: Request): string {
  const forwardedFor =
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export function rateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  const secondsUntilReset = Math.max(
    0,
    result.resetAt - Math.floor(Date.now() / 1000)
  );
  return {
    'RateLimit-Limit': String(result.limit),
    'RateLimit-Remaining': String(result.remaining),
    // Per the IETF RateLimit header draft, Reset is seconds until the
    // window resets (delta), not an absolute epoch timestamp.
    'RateLimit-Reset': String(secondsUntilReset)
  };
}

/** Test-only: clears all bucket state between test cases. */
export function __resetRateLimitBucketsForTests(): void {
  buckets.clear();
}

/** Test-only: exposes the current bucket count to verify pruning. */
export function __debugBucketCount(): number {
  return buckets.size;
}
