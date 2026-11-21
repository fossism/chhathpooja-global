import crypto from "crypto";
import { redisCommand, redisConfigured } from "./redis";

/**
 * Server-issued proof-of-work.
 *
 * The old scheme accepted any client-chosen salt/timestamp and could be
 * replayed for ten minutes. Challenges are now HMAC-signed by the server,
 * expire after five minutes, and can be redeemed exactly once.
 */

export const POW_DIFFICULTY_BITS = 18; // ~262k hashes on average
const POW_TTL_MS = 5 * 60_000;
const POW_CLOCK_SKEW_MS = 30_000;
const POW_MAX_NONCE = 20_000_000;

export interface PowChallenge {
  id: string;
  timestamp: number;
  salt: string;
  difficulty: number;
  signature: string;
}

export interface PowSolution {
  challenge: PowChallenge;
  nonce: number;
}

const FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");
let warnedAboutSecret = false;

function getSecret(): string {
  const configured =
    process.env.POW_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (configured.length >= 32) return configured;

  if (!warnedAboutSecret && process.env.NODE_ENV === "production") {
    warnedAboutSecret = true;
    console.warn(
      "[pow] POW_SECRET is not set. Using a per-process fallback; set POW_SECRET (32+ chars) in production so challenges validate across instances."
    );
  }
  return FALLBACK_SECRET;
}

function sign(challenge: Omit<PowChallenge, "signature">): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(
      `${challenge.id}:${challenge.salt}:${challenge.timestamp}:${challenge.difficulty}`
    )
    .digest("hex");
}

function signaturesMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

function hasLeadingZeroBits(hash: Buffer, bits: number): boolean {
  const fullBytes = Math.floor(bits / 8);
  for (let i = 0; i < fullBytes; i++) {
    if (hash[i] !== 0) return false;
  }
  const remainder = bits % 8;
  if (remainder === 0) return true;
  const mask = (0xff << (8 - remainder)) & 0xff;
  return (hash[fullBytes] & mask) === 0;
}

export function issuePowChallenge(): PowChallenge {
  const base = {
    id: crypto.randomBytes(16).toString("hex"),
    timestamp: Date.now(),
    salt: crypto.randomBytes(8).toString("hex"),
    difficulty: POW_DIFFICULTY_BITS
  };
  return { ...base, signature: sign(base) };
}

const usedChallenges = new Map<string, number>();

function markUsedInMemory(id: string, ttlSeconds: number): boolean {
  const now = Date.now();
  if (usedChallenges.size > 5_000) {
    for (const [key, expiresAt] of usedChallenges) {
      if (expiresAt <= now) usedChallenges.delete(key);
      if (usedChallenges.size < 4_000) break;
    }
  }
  if (usedChallenges.has(id) && (usedChallenges.get(id) ?? 0) > now) {
    return false;
  }
  usedChallenges.set(id, now + ttlSeconds * 1000);
  return true;
}

async function markUsed(id: string, ttlSeconds: number): Promise<boolean> {
  if (redisConfigured()) {
    // SET NX is atomic, so two concurrent submissions cannot both redeem the
    // same challenge. If Redis is configured but unavailable we fail closed.
    const result = await redisCommand<string>([
      "SET",
      `pow:used:${id}`,
      1,
      "NX",
      "EX",
      ttlSeconds
    ]);
    return result === "OK";
  }
  return markUsedInMemory(id, ttlSeconds);
}

export async function verifyPowChallenge(pow: unknown): Promise<boolean> {
  if (!pow || typeof pow !== "object") return false;
  const { challenge, nonce } = pow as Record<string, unknown>;

  if (!challenge || typeof challenge !== "object") return false;
  const { id, timestamp, salt, difficulty, signature } = challenge as Record<string, unknown>;

  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{32}$/.test(id) ||
    typeof salt !== "string" ||
    !/^[0-9a-f]{16}$/.test(salt) ||
    typeof signature !== "string" ||
    !/^[0-9a-f]{64}$/.test(signature) ||
    typeof timestamp !== "number" ||
    !Number.isInteger(timestamp) ||
    typeof difficulty !== "number" ||
    difficulty !== POW_DIFFICULTY_BITS ||
    typeof nonce !== "number" ||
    !Number.isInteger(nonce) ||
    nonce < 0 ||
    nonce > POW_MAX_NONCE
  ) {
    return false;
  }

  const now = Date.now();
  if (now - timestamp > POW_TTL_MS || timestamp - now > POW_CLOCK_SKEW_MS) {
    return false;
  }

  const expected = sign({ id, timestamp, salt, difficulty });
  if (!signaturesMatch(signature, expected)) return false;

  const hash = crypto
    .createHash("sha256")
    .update(`${salt}:${timestamp}:${nonce}`)
    .digest();

  if (!hasLeadingZeroBits(hash, difficulty)) return false;

  const ttlSeconds = Math.max(1, Math.ceil((timestamp + POW_TTL_MS - now) / 1000));
  return markUsed(id, ttlSeconds);
}
