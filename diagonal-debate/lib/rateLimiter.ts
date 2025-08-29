import { Redis } from "@upstash/redis";

// Initialize Upstash Redis REST client if env vars are present; otherwise leave undefined.
let redis: Redis | undefined;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
  } else {
    console.warn("[rateLimiter] UPSTASH env vars missing; limiter will bypass until configured.");
  }
} catch (err) {
  console.warn("[rateLimiter] Failed to initialize Upstash Redis client; bypassing limiter.", err);
  redis = undefined;
}

const RATE_LIMIT = 5;
const WINDOW = 60; // seconds

export async function rateLimiter(ip: string) {
  console.log('[rateLimiter] NODE_ENV=', process.env.NODE_ENV, ' raw ip=', ip)

  // Normalize IP: handle comma-separated X-Forwarded-For, IPv4-mapped IPv6 (::ffff:127.0.0.1)
  let normalizedIp = (ip || 'unknown').toString().split(',')[0].trim()
  if (normalizedIp.startsWith('::ffff:')) normalizedIp = normalizedIp.replace('::ffff:', '')

  // During local development allow loopback addresses to bypass the Upstash limiter.
  if (process.env.NODE_ENV !== 'production') {
    if (normalizedIp === '::1' || normalizedIp === '127.0.0.1' || normalizedIp === 'localhost') {
      console.log('[rateLimiter] bypassing limiter for local loopback ip=', normalizedIp)
      return
    }
  }

  // If Redis is not configured/available, bypass rather than crashing.
  if (!redis) {
    return;
  }

  const key = `ratelimit:${normalizedIp}`;
  try {
    // Atomically increment and set expiry if new
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, WINDOW);
    }
    if (count > RATE_LIMIT) {
      throw new Error("Rate limit exceeded");
    }
  } catch (err) {
    // Network/auth errors should not break user flows in dev; log and bypass.
    console.warn('[rateLimiter] Redis error; bypassing limiter. key=', key, err);
    return;
  }
} 