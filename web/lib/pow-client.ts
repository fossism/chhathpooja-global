export interface PowChallenge {
  timestamp: number;
  salt: string;
  nonce: number;
}

/**
 * Solves a lightweight Proof-of-Work challenge in the browser using Web Crypto API.
 * Takes ~30-100ms, effectively stopping automated bot submission storms.
 */
export async function solvePowChallenge(): Promise<PowChallenge> {
  const timestamp = Date.now();
  const saltArr = new Uint8Array(8);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(saltArr);
  } else {
    for (let i = 0; i < 8; i++) saltArr[i] = Math.floor(Math.random() * 256);
  }
  const salt = Array.from(saltArr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  let nonce = 0;
  const encoder = new TextEncoder();
  const subtle = window.crypto.subtle;

  while (true) {
    const data = encoder.encode(`${salt}:${timestamp}:${nonce}`);
    const hashBuffer = await subtle.digest("SHA-256", data);
    const hashArr = new Uint8Array(hashBuffer);
    // Requires 4 leading hex zeros (first 2 bytes = 0x00 0x00)
    if (hashArr[0] === 0 && hashArr[1] === 0) {
      return { timestamp, salt, nonce };
    }
    nonce++;
  }
}
