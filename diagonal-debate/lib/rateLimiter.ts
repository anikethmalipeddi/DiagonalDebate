import { Redis } from "@upstash/redis";

// Use Upstash Redis REST API client
const redis = Redis.fromEnv();

const RATE_LIMIT = 5;
const WINDOW = 60; // seconds

export async function rateLimiter(ip: string) {
  const key = `ratelimit:${ip}`;
  // Atomically increment and set expiry if new
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW);
  }
  if (count > RATE_LIMIT) {
    throw new Error("Rate limit exceeded");
  }
} 