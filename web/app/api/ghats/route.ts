import { randomUUID } from "node:crypto";
import { getGhats } from "../../../lib/chhath";
import { sbInsert, supabaseWritesConfigured } from "../../../lib/supabase";
import { verifyPowChallenge } from "../../../lib/pow-server";
import { getClientIp, rateLimit, rateLimitResponse } from "../../../lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;

function siteOrigin(): string {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://chhathmahaparv.org"
    ).origin;
  } catch {
    return "https://chhathmahaparv.org";
  }
}

function isSameSiteRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (origin) {
    const allowed = new Set([siteOrigin()]);
    if (process.env.NODE_ENV !== "production") {
      allowed.add("http://localhost:3000");
      allowed.add("http://127.0.0.1:3000");
    }
    if (!allowed.has(origin)) return false;
  }

  // Modern browsers label cross-site requests even when Origin is omitted.
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;

  return true;
}

function clean(s: unknown, max: number): string {
  return String(s ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// GET: verified ghats (static open data today; Supabase read when wired).
export async function GET() {
  return Response.json(
    { ghats: getGhats() },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}

// POST: propose a ghat. Validated + sanitized here, never self-verified.
// With a server-only Supabase service key → row inserted (verified=false).
// Without → 202 accepted-local (client shows local preview + review note).
export async function POST(req: Request) {
  // Requiring JSON forces a CORS preflight for cross-origin browser requests,
  // and the Origin/Sec-Fetch-Site checks block simple no-cors form/beacon spam.
  if (!isSameSiteRequest(req)) {
    return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  const contentType = req.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return Response.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large." }, { status: 413 });
  }

  const ip = getClientIp(req);
  const limit = await rateLimit(`rl:ghats:${ip}`, 10, 300);
  if (!limit.ok) {
    return rateLimitResponse(limit, "Too many submissions from this IP. Please wait a few minutes.");
  }

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: "Payload too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  // Anti-spam Proof-of-Work check (signed, server-issued, single-use)
  if (!(await verifyPowChallenge(data.pow))) {
    return Response.json(
      { error: "Anti-spam proof-of-work challenge failed or expired. Please retry." },
      { status: 403 }
    );
  }

  if (
    typeof data.name !== "string" ||
    typeof data.city !== "string" ||
    (data.country !== undefined && typeof data.country !== "string")
  ) {
    return Response.json({ error: "Ghat name, city, and country must be text." }, { status: 400 });
  }

  const name = clean(data.name, 80);
  const city = clean(data.city, 60);
  const country = clean(data.country || "India", 60);
  if (!name || !city) {
    return Response.json({ error: "Ghat name and city are required." }, { status: 400 });
  }

  // Optional coordinates. Reject 0,0 (Null Island) and out-of-range values
  // instead of silently pinning every community ghat to the same wrong spot.
  let lat: number | null = null;
  let lng: number | null = null;
  if (data.lat !== undefined || data.lng !== undefined) {
    const latN = Number(data.lat);
    const lngN = Number(data.lng);
    if (
      !Number.isFinite(latN) ||
      !Number.isFinite(lngN) ||
      latN < -90 ||
      latN > 90 ||
      lngN < -180 ||
      lngN > 180 ||
      (latN === 0 && lngN === 0)
    ) {
      return Response.json({ error: "Invalid coordinates." }, { status: 400 });
    }
    lat = latN;
    lng = lngN;
  }

  if (!supabaseWritesConfigured()) {
    return Response.json(
      {
        ok: true,
        queued: "local",
        note: "No backend configured — showing local preview. A moderator verifies before public listing."
      },
      { status: 202 }
    );
  }

  const r = await sbInsert("ghats", {
    id: `community-${randomUUID()}`,
    name,
    city,
    country,
    lat,
    lng,
    river_or_pond: "Community spot",
    verified: false
  });

  if (!r.ok) {
    return Response.json({ error: "Could not submit. Try again later." }, { status: 502 });
  }

  return Response.json(
    {
      ok: true,
      queued: "moderation",
      note: "Sent for moderation. It appears publicly after a moderator verifies it."
    },
    { status: 201 }
  );
}
