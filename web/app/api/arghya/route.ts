import { calculateAstronomicalTimes } from "../../../lib/sun";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const IPV4_RE = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
const IPV6_RE = /^[0-9a-fA-F:]{2,39}$/;

// Memory-bounded rate limit: 30 req / min per IP + 300 req / min global cap.
// Prevents this open proxy from being abused for Open-Meteo scraping,
// and protects Node.js memory from unbounded Map growth / OOM attacks.
const WINDOW_MS = 60_000;
const MAX_HITS_PER_IP = 30;
const MAX_GLOBAL_HITS = 300;
const MAX_TRACKED_IPS = 2_000;

interface RateLimitEntry {
  timestamps: number[];
  lastSeen: number;
}

const ipHits = new Map<string, RateLimitEntry>();
let globalHits: number[] = [];
let lastSweep = Date.now();

function cleanupStaleEntries(now: number) {
  if (now - lastSweep < 30_000 && ipHits.size < MAX_TRACKED_IPS) return;
  lastSweep = now;
  ipHits.forEach((entry, ip) => {
    if (now - entry.lastSeen > WINDOW_MS) {
      ipHits.delete(ip);
    }
  });
  // Hard cap defense: under high-volume IP spoofing, evict the oldest entries
  if (ipHits.size >= MAX_TRACKED_IPS) {
    let purged = 0;
    ipHits.forEach((_, key) => {
      if (purged < 500) {
        ipHits.delete(key);
        purged++;
      }
    });
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  cleanupStaleEntries(now);

  // Global safety cap across all clients
  globalHits = globalHits.filter((t) => now - t < WINDOW_MS);
  if (globalHits.length >= MAX_GLOBAL_HITS) {
    return true;
  }
  globalHits.push(now);

  // Per-IP rate check
  const entry = ipHits.get(ip) ?? { timestamps: [], lastSeen: now };
  const recent = entry.timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  entry.timestamps = recent;
  entry.lastSeen = now;
  ipHits.set(ip, entry);

  return recent.length > MAX_HITS_PER_IP;
}

function getClientIp(req: Request): string {
  // Check common trusted proxy headers first
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

export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      {
        status: 429,
        headers: {
          "Retry-After": "60"
        }
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const latRaw = searchParams.get("lat");
  const lonRaw = searchParams.get("lon");
  const dateRaw = searchParams.get("date") ?? "2026-11-15";

  if (!latRaw || !lonRaw) return Response.json({ error: "lat/lon required" }, { status: 400 });

  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return Response.json({ error: "Invalid lat/lon. lat must be -90..90, lon -180..180." }, { status: 400 });
  }

  if (!DATE_RE.test(dateRaw)) {
    return Response.json({ error: "Invalid date. Use YYYY-MM-DD." }, { status: 400 });
  }
  const parsed = new Date(`${dateRaw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateRaw) {
    return Response.json({ error: "Invalid calendar date." }, { status: 400 });
  }
  // Festival window + Open-Meteo sanity bound. Keeps cache useful, blocks abuse.
  if (dateRaw < "2000-01-01" || dateRaw > "2040-12-31") {
    return Response.json({ error: "Date out of range (2000-01-01..2040-12-31)." }, { status: 400 });
  }

  // From here on only validated numbers / date are used — no raw echo.
  const safeLat = Math.round(lat * 10000) / 10000;
  const safeLon = Math.round(lon * 10000) / 10000;

  // Open-Meteo forecast only covers ~16 days ahead. Far-future festival
  // dates return empty daily arrays, or if the API is offline/rate-limited,
  // we compute accurate astronomical sunrise/sunset for user coordinates using NOAA equations.
  const astroFallback = calculateAstronomicalTimes(safeLat, safeLon, dateRaw);
  const fallback = {
    sunrise: astroFallback.sunrise,
    sunset: astroFallback.sunset,
    date: dateRaw,
    lat: safeLat,
    lon: safeLon,
    fallback: true,
    note: "Calculated via offline astronomical solar equations for your coordinates."
  };
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(String(safeLat))}` +
      `&longitude=${encodeURIComponent(String(safeLon))}` +
      `&daily=sunrise,sunset&timezone=auto` +
      `&start_date=${encodeURIComponent(dateRaw)}&end_date=${encodeURIComponent(dateRaw)}`;
    const r = await fetch(url, {
      next: { revalidate: 86400 },
      // Never hang the server on a slow upstream.
      signal: AbortSignal.timeout(8000)
    });
    if (!r.ok) return Response.json(fallback);
    const j = await r.json();
    const sunriseRaw: unknown = j.daily?.sunrise?.[0];
    const sunsetRaw: unknown = j.daily?.sunset?.[0];
    const sunrise = typeof sunriseRaw === "string" ? sunriseRaw.split("T")[1] : null;
    const sunset = typeof sunsetRaw === "string" ? sunsetRaw.split("T")[1] : null;
    const timeRe = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
    if (!sunrise || !sunset || !timeRe.test(sunrise) || !timeRe.test(sunset)) {
      return Response.json(fallback);
    }
    return Response.json({
      sunrise: sunrise.slice(0, 5),
      sunset: sunset.slice(0, 5),
      date: dateRaw,
      lat: safeLat,
      lon: safeLon,
      fallback: false
    });
  } catch {
    return Response.json(fallback);
  }
}
