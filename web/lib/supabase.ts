// Optional Supabase backend via PostgREST — zero new dependencies.
// If SUPABASE_URL / SUPABASE_ANON_KEY (or SERVICE key server-side) are set,
// ghat proposals persist + await moderation. Otherwise everything falls back
// to bundled open data + local preview, so the site works with no backend.

const URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function supabaseConfigured(): boolean {
  return URL.length > 8 && ANON.length > 8;
}

export async function sbInsert(table: string, row: Record<string, unknown>): Promise<{ ok: boolean; status: number }> {
  if (!supabaseConfigured()) return { ok: false, status: 503 };
  try {
    const r = await fetch(`${URL.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(8000)
    });
    return { ok: r.ok, status: r.status };
  } catch {
    return { ok: false, status: 503 };
  }
}
