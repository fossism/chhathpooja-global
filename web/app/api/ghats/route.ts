import { getGhats } from "../../../lib/chhath";
import { sbInsert, supabaseConfigured } from "../../../lib/supabase";

const IPV4_RE = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
const IPV6_RE = /^[0-9a-fA-F:]{2,39}$/;

// Memory-bounded rate limiter for submissions: 10 proposals per 5 minutes per IP
const SUBMIT_WINDOW_MS = 300_000;
const MAX_SUBMITS_PER_IP = 10;
const MAX_TRACKED_SUBMITTERS = 1_000;

interface SubmitEntry {
  timestamps: number[];
  lastSeen: number;
}

const submitHits = new Map<string, SubmitEntry>();
let lastSubmitSweep = Date.now();

function cleanupStaleSubmissions(now: number) {
  if (now - lastSubmitSweep < 60_000 && submitHits.size < MAX_TRACKED_SUBMITTERS) return;
  lastSubmitSweep = now;
  submitHits.forEach((entry, ip) => {
    if (now - entry.lastSeen > SUBMIT_WINDOW_MS) {
      submitHits.delete(ip);
    }
  });
  if (submitHits.size >= MAX_TRACKED_SUBMITTERS) {
    let purged = 0;
    submitHits.forEach((_, key) => {
      if (purged < 250) {
        submitHits.delete(key);
        purged++;
      }
    });
  }
}

function isSubmitRateLimited(ip: string): boolean {
  const now = Date.now();
  cleanupStaleSubmissions(now);

  const entry = submitHits.get(ip) ?? { timestamps: [], lastSeen: now };
  const recent = entry.timestamps.filter((t) => now - t < SUBMIT_WINDOW_MS);
  recent.push(now);
  entry.timestamps = recent;
  entry.lastSeen = now;
  submitHits.set(ip, entry);

  return recent.length > MAX_SUBMITS_PER_IP;
}

function getClientIp(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && (IPV4_RE.test(cfIp.trim()) || IPV6_RE.test(cfIp.trim()))) {
    return cfIp.trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp && (IPV4_RE.test(realIp.trim()) || IPV6_RE.test(realIp.trim()))) {
    return realIp.trim();
  }

  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const candidate = fwd.split(",")[0].trim();
    if (IPV4_RE.test(candidate) || IPV6_RE.test(candidate)) {
      return candidate;
    }
  }
  return "anonymous";
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
  return Response.json({ ghats: getGhats(), backend: supabaseConfigured() ? "supabase" : "static" });
}

// POST: propose a ghat. Validated + sanitized here, never self-verified.
// With Supabase configured → row inserted (verified=false, RLS enforced).
// Without → 202 accepted-local (client shows local preview + review note).
export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isSubmitRateLimited(ip)) {
    return Response.json(
      { error: "Too many submissions from this IP. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": "300" } }
    );
  }

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
