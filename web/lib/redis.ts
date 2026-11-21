// Minimal Upstash Redis REST client (no SDK dependency).
// Configure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or the Vercel
// KV_* equivalents) to share rate-limit and PoW state across serverless
// instances. Without it, callers fall back to a bounded in-memory store.

const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";

export function redisConfigured(): boolean {
  return REDIS_URL.length > 8 && REDIS_TOKEN.length > 8;
}

async function request(path: string, body: unknown): Promise<unknown> {
  const r = await fetch(`${REDIS_URL.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(2500)
  });
  if (!r.ok) throw new Error(`Redis request failed: ${r.status}`);
  return r.json();
}

/** Runs a single Redis command, e.g. ["GET", "key"]. */
export async function redisCommand<T = unknown>(
  command: Array<string | number>
): Promise<T | null> {
  if (!redisConfigured()) return null;
  try {
    const data = (await request("", command)) as { result?: T };
    return data.result ?? null;
  } catch {
    return null;
  }
}

/** Runs several commands in one round trip. */
export async function redisPipeline<T = unknown>(
  commands: Array<Array<string | number>>
): Promise<Array<T | null> | null> {
  if (!redisConfigured()) return null;
  try {
    const data = (await request("/pipeline", commands)) as Array<{ result?: T }>;
    return data.map((entry) => entry.result ?? null);
  } catch {
    return null;
  }
}
