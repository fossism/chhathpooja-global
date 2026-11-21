import { calculateAstronomicalTimes } from "../../../lib/sun";
import { getClientIp, rateLimit, rateLimitResponse } from "../../../lib/rate-limit";
import { getNextChhath } from "../../../lib/chhath";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MIN_DATE = "2024-01-01";
const MAX_DATE = "2036-12-31";

// 30 req/min per IP + 300 req/min global. The per-IP check runs first so
// rejected requests do not consume the shared global budget.
const MAX_HITS_PER_IP = 30;
const MAX_GLOBAL_HITS = 300;

// Bounded local cache for upstream responses. This deliberately replaces
// Next's unbounded Data Cache: an attacker varying coordinates/dates can no
// longer create an unlimited number of persistent cache entries.
const UPSTREAM_CACHE_MAX = 2_000;
const UPSTREAM_CACHE_TTL_MS = 24 * 60 * 60_000;
const upstreamCache = new Map<string, { expiresAt: number; value: unknown }>();

function getCached(key: string): unknown | null {
  const entry = upstreamCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    upstreamCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key: string, value: unknown) {
  if (upstreamCache.size >= UPSTREAM_CACHE_MAX) {
    const oldest = upstreamCache.keys().next().value;
    if (oldest !== undefined) upstreamCache.delete(oldest);
  }
  upstreamCache.set(key, { expiresAt: Date.now() + UPSTREAM_CACHE_TTL_MS, value });
}

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800"
    }
  });
}

export async function GET(req: Request) {
  // Browsers send this on cross-site fetches. Blocking them prevents other
  // sites from silently consuming this endpoint/Open-Meteo quota.
  if (req.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  const ip = getClientIp(req);

  const perIp = await rateLimit(`rl:arghya:ip:${ip}`, MAX_HITS_PER_IP, 60);
  if (!perIp.ok) {
    return rateLimitResponse(perIp, "Rate limit exceeded. Try again in a minute.");
  }

  const global = await rateLimit("rl:arghya:global", MAX_GLOBAL_HITS, 60);
  if (!global.ok) {
    return rateLimitResponse(global, "Service is busy. Try again in a minute.");
  }

  const { searchParams } = new URL(req.url);
  const latRaw = searchParams.get("lat");
  const lonRaw = searchParams.get("lon");
  const dateRaw = searchParams.get("date") ?? getNextChhath().sandhyaArghya;

  if (!latRaw || !lonRaw) {
    return Response.json({ error: "lat/lon required" }, { status: 400 });
  }

  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return Response.json(
      { error: "Invalid lat/lon. lat must be -90..90, lon -180..180." },
      { status: 400 }
    );
  }

  if (!DATE_RE.test(dateRaw)) {
    return Response.json({ error: "Invalid date. Use YYYY-MM-DD." }, { status: 400 });
  }
  const parsed = new Date(`${dateRaw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateRaw) {
    return Response.json({ error: "Invalid calendar date." }, { status: 400 });
  }
  // Restrict to the range the app actually publishes (2024–2036).
  if (dateRaw < MIN_DATE || dateRaw > MAX_DATE) {
    return Response.json(
      { error: `Date out of range (${MIN_DATE}..${MAX_DATE}).` },
      { status: 400 }
    );
  }

  // ~1 km precision is plenty for sunrise/sunset and shrinks the key space.
  const safeLat = Math.round(lat * 100) / 100;
  const safeLon = Math.round(lon * 100) / 100;

  const astro = calculateAstronomicalTimes(safeLat, safeLon, dateRaw);
  const fallback = {
    sunrise: astro.sunrise,
    sunset: astro.sunset,
    date: dateRaw,
    lat: safeLat,
    lon: safeLon,
    fallback: true,
    note: "Calculated via offline astronomical solar equations for your coordinates."
  };

  // Open-Meteo's forecast endpoint only covers a short window. Far-future
  // festival dates use the offline calculation and never hit upstream.
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const targetUtc = Date.parse(`${dateRaw}T00:00:00Z`);
  const dayOffset = (targetUtc - todayUtc) / 86_400_000;
  if (dayOffset < -1 || dayOffset > 15) {
    return json(fallback);
  }

  const cacheKey = `${safeLat},${safeLon},${dateRaw}`;
  const cached = getCached(cacheKey);
  if (cached) return json(cached);

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(String(safeLat))}` +
      `&longitude=${encodeURIComponent(String(safeLon))}` +
      `&daily=sunrise,sunset&timezone=auto` +
      `&start_date=${encodeURIComponent(dateRaw)}&end_date=${encodeURIComponent(dateRaw)}`;
    const r = await fetch(url, {
      cache: "no-store",
      // Never hang the server on a slow upstream.
      signal: AbortSignal.timeout(8000)
    });
    if (!r.ok) return json(fallback);

    const j = (await r.json()) as {
      daily?: { sunrise?: unknown[]; sunset?: unknown[] };
    };
    const sunriseRaw = j.daily?.sunrise?.[0];
    const sunsetRaw = j.daily?.sunset?.[0];
    const sunrise = typeof sunriseRaw === "string" ? sunriseRaw.split("T")[1] : null;
    const sunset = typeof sunsetRaw === "string" ? sunsetRaw.split("T")[1] : null;
    const timeRe = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
    if (!sunrise || !sunset || !timeRe.test(sunrise) || !timeRe.test(sunset)) {
      return json(fallback);
    }

    const result = {
      sunrise: sunrise.slice(0, 5),
      sunset: sunset.slice(0, 5),
      date: dateRaw,
      lat: safeLat,
      lon: safeLon,
      fallback: false
    };
    setCached(cacheKey, result);
    return json(result);
  } catch {
    return json(fallback);
  }
}
