import crypto from "crypto";

export interface PowChallenge {
  timestamp: number;
  salt: string;
  nonce: number;
}

/**
 * Verifies a Proof-of-Work challenge on the server in <0.1ms using Node.js crypto.
 */
export function verifyPowChallenge(pow: unknown): boolean {
  if (!pow || typeof pow !== "object") return false;
  const { timestamp, salt, nonce } = pow as Record<string, unknown>;

  if (typeof timestamp !== "number" || typeof salt !== "string" || typeof nonce !== "number") {
    return false;
  }

  const now = Date.now();
  // Valid within 10 minutes (prevents replay attacks), clock skew allowed up to 30s
  if (now - timestamp > 600_000 || timestamp - now > 30_000) {
    return false;
  }
  if (!/^[0-9a-fA-F]{16}$/.test(salt)) {
    return false;
  }
  if (nonce < 0 || nonce > 5_000_000 || !Number.isInteger(nonce)) {
    return false;
  }

  const payload = `${salt}:${timestamp}:${nonce}`;
  const hash = crypto.createHash("sha256").update(payload).digest();
  return hash[0] === 0 && hash[1] === 0;
}
