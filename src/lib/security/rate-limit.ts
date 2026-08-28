import 'server-only';

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export type RateLimitOptions = {
  /** Requests allowed per window. */
  limit: number;
  /** Window duration in milliseconds. */
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Fixed-window in-memory rate limiter. Fine for a single-instance deployment
 * (Vercel edge/serverless will reset per-instance). Replace with a shared
 * store (Upstash Redis, Vercel KV) if this ever runs on multiple instances.
 */
export const rateLimit = (key: string, opts: RateLimitOptions): RateLimitResult => {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + opts.windowMs };
    store.set(key, bucket);
    return { ok: true, remaining: opts.limit - 1, resetAt: bucket.resetAt };
  }

  if (existing.count >= opts.limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: opts.limit - existing.count, resetAt: existing.resetAt };
};

export const rateLimitHeaders = (result: RateLimitResult, limit: number): HeadersInit => ({
  'X-RateLimit-Limit': String(limit),
  'X-RateLimit-Remaining': String(result.remaining),
  'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
});
