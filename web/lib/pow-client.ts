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

function leadingZeroBits(hash: Uint8Array, bits: number): boolean {
  const fullBytes = Math.floor(bits / 8);
  for (let i = 0; i < fullBytes; i++) {
    if (hash[i] !== 0) return false;
  }
  const remainder = bits % 8;
  if (remainder === 0) return true;
  const mask = (0xff << (8 - remainder)) & 0xff;
  return (hash[fullBytes] & mask) === 0;
}

/**
 * Fetches a signed challenge from the server and solves it in the browser.
 * The challenge is single-use, so it cannot be replayed by a bot.
 */
export async function solvePowChallenge(): Promise<PowSolution> {
  const response = await fetch("/api/ghats/challenge", {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error("Could not obtain an anti-spam challenge.");
  }

  const challenge = (await response.json()) as PowChallenge;
  if (
    !challenge ||
    typeof challenge.id !== "string" ||
    typeof challenge.salt !== "string" ||
    typeof challenge.signature !== "string" ||
    typeof challenge.timestamp !== "number" ||
    typeof challenge.difficulty !== "number" ||
    challenge.difficulty < 1 ||
    challenge.difficulty > 32
  ) {
    throw new Error("Invalid anti-spam challenge.");
  }

  const encoder = new TextEncoder();
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto is unavailable in this browser.");

  const maxNonce = 20_000_000;
  for (let nonce = 0; nonce < maxNonce; nonce++) {
    const data = encoder.encode(`${challenge.salt}:${challenge.timestamp}:${nonce}`);
    const hash = new Uint8Array(await subtle.digest("SHA-256", data));
    if (leadingZeroBits(hash, challenge.difficulty)) {
      return { challenge, nonce };
    }
  }

  throw new Error("Could not solve the anti-spam challenge. Please retry.");
}
