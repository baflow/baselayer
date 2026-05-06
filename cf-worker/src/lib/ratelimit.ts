export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export async function checkRateLimit(
  kv: KVNamespace,
  ip: string,
  maxRequests: number,
  windowMinutes: number
): Promise<RateLimitResult> {
  const windowMs = windowMinutes * 60 * 1000;
  const key = `rate_limit:${ip}`;
  const now = Date.now();
  const cutoff = now - windowMs;

  const raw = await kv.get(key);
  let timestamps: number[] = raw ? JSON.parse(raw) : [];

  // Clean old entries
  timestamps = timestamps.filter((t) => t > cutoff);

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds: retryAfter > 0 ? retryAfter : 1,
    };
  }

  timestamps.push(now);
  // Sort ascending so oldest stays first
  timestamps.sort((a, b) => a - b);
  await kv.put(key, JSON.stringify(timestamps), { expirationTtl: windowMinutes * 60 });

  return { allowed: true, retryAfterSeconds: 0 };
}
