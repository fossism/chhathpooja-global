import { isIP } from "node:net";
import { redisConfigured, redisPipeline } from "./redis";

// Trusted client IP extraction.
//
// Only a header that is known to be overwritten by a trusted proxy may be used.
// Do NOT trust the first X-Forwarded-For hop: clients can set it themselves.
// Set TRUSTED_PROXY_HEADER (e.g. "x-real-ip" behind nginx, "cf-connecting-ip"
// behind Cloudflare with an origin firewall) in self-hosted deployments.
function firstValidIp(value: string | null): string | null {
  if (!value) return null;
  for (const part of value.split(",")) {
    const candidate = part.trim();
    if (isIP(candidate)) return candidate;
  }
  return null;
}

export function getClientIp(req: Request): string {
  const configured = process.env.TRUSTED_PROXY_HEADER?.trim().toLowerCase();
  if (configured) {
    return firstValidIp(req.headers.get(configured)) ?? "unknown";
  }

  // Vercel overwrites these platform headers at its edge.
  if (process.env.VERCEL) {
    return (
      firstValidIp(req.headers.get("x-vercel-forwarded-for")) ??
      firstValidIp(req.headers.get("x-real-ip")) ??
      "unknown"
    );
  }

  // Cloudflare Pages sets cf-connecting-ip at its edge.
  if (process.env.CF_PAGES) {
    return firstValidIp(req.headers.get("cf-connecting-ip")) ?? "unknown";
  }

  // No trusted proxy is configured. Falling back to "unknown" makes every
  // request share one bucket, which is safer than letting an attacker choose
  // a fresh identity per request. Configure TRUSTED_PROXY_HEADER in production.
  return "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetSeconds: number;
}

interface MemoryEntry {
  count: number;
  resetAt: number;
}

const memory = new Map<string, MemoryEntry>();
const MAX_MEMORY_KEYS = 5_000;

function memoryRateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // Bounded cleanup so spoofed keys cannot grow the map without limit.
  if (memory.size >= MAX_MEMORY_KEYS) {
    for (const [k, entry] of memory) {
      if (entry.resetAt <= now) memory.delete(k);
      if (memory.size < MAX_MEMORY_KEYS * 0.8) break;
    }
    while (memory.size >= MAX_MEMORY_KEYS) {
      const oldest = memory.keys().next().value;
      if (oldest === undefined) break;
      memory.delete(oldest);
    }
  }

  const existing = memory.get(key);
  const entry =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  entry.count += 1;
  memory.set(key, entry);

  return {
    ok: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
  };
}

/**
 * Fixed-window rate limit. Uses Upstash Redis when configured so counters are
 * shared across serverless instances; otherwise a bounded in-memory fallback.
 */
let warnedAboutSharedState = false;

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!warnedAboutSharedState && process.env.NODE_ENV === "production" && !redisConfigured()) {
    warnedAboutSharedState = true;
    console.warn(
      "[rate-limit] No shared Redis configured. Limits and PoW single-use state are per-instance; set UPSTASH_REDIS_REST_URL/TOKEN (or KV_REST_API_URL/TOKEN) in production."
    );
  }

  if (redisConfigured()) {
    const results = await redisPipeline<number | string>([
      ["SET", key, 0, "EX", windowSeconds, "NX"],
      ["INCR", key],
      ["TTL", key]
    ]);

    if (results && results[1] !== null) {
      const count = Number(results[1]);
      const ttl = Number(results[2] ?? windowSeconds);
      if (Number.isFinite(count)) {
        return {
          ok: count <= limit,
          remaining: Math.max(0, limit - count),
          resetSeconds: Number.isFinite(ttl) && ttl > 0 ? ttl : windowSeconds
        };
      }
    }
    // Redis is configured but unreachable: use the local fallback rather than
    // failing open or taking the endpoint down.
  }

  return memoryRateLimit(key, limit, windowSeconds);
}

export function rateLimitResponse(result: RateLimitResult, message: string): Response {
  return Response.json(
    { error: message },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.resetSeconds),
        "Cache-Control": "no-store"
      }
    }
  );
}
