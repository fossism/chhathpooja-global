// Optional Supabase backend via PostgREST — zero new dependencies.
//
// Writes use SUPABASE_SERVICE_ROLE_KEY and must never run in the browser.
// The anon key is intentionally not accepted for inserts: Supabase anon keys
// are public by design, so allowing anon INSERT lets anyone bypass the API's
// validation, proof-of-work, and rate limits by calling PostgREST directly.
// If no service key is configured, submissions stay in the local-preview path.

const URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function supabaseWritesConfigured(): boolean {
  return URL.length > 8 && SERVICE.length > 8;
}

export async function sbInsert(
  table: string,
  row: Record<string, unknown>
): Promise<{ ok: boolean; status: number }> {
  if (!supabaseWritesConfigured()) return { ok: false, status: 503 };
  try {
    const r = await fetch(`${URL.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: SERVICE,
        Authorization: `Bearer ${SERVICE}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row),
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    });
    return { ok: r.ok, status: r.status };
  } catch {
    return { ok: false, status: 503 };
  }
}
