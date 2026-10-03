import { getGhats } from "../../../lib/chhath";
import { sbInsert, supabaseConfigured } from "../../../lib/supabase";

function clean(s: unknown, max: number): string {
  return String(s ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// GET: verified ghats (static open data today; Supabase read when wired).
export async function GET() {
  return Response.json({ ghats: getGhats(), backend: supabaseConfigured() ? "supabase" : "static" });
}

// POST: propose a ghat. Validated + sanitized here, never self-verified.
// With Supabase configured → row inserted (verified=false, RLS enforced).
// Without → 202 accepted-local (client shows local preview + review note).
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const name = clean(body.name, 80);
  const city = clean(body.city, 60);
  const country = clean(body.country || "India", 60);
  if (!name || !city) {
    return Response.json({ error: "Ghat name and city are required." }, { status: 400 });
  }
  if (!supabaseConfigured()) {
    return Response.json({ ok: true, queued: "local", note: "No backend configured — showing local preview. A moderator verifies before public listing." }, { status: 202 });
  }
  const r = await sbInsert("ghats", {
    id: `community-${Date.now()}`,
    name, city, country,
    lat: 0, lng: 0,
    river_or_pond: "Community spot",
    verified: false
  });
  if (!r.ok) {
    return Response.json({ error: "Could not submit. Try again later." }, { status: 502 });
  }
  return Response.json({ ok: true, queued: "moderation", note: "Sent for moderation. It appears publicly after a moderator verifies it." }, { status: 201 });
}
