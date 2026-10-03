const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Minimal in-memory rate limit: 30 req / min per IP (per server instance).
// Prevents this open proxy from being abused for Open-Meteo scraping.
const WINDOW_MS = 60_000;
const MAX_HITS = 30;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_HITS;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim().slice(0, 64);
  return "local";
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return Response.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
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
  // dates return empty daily arrays, so detect nulls and fall back.
  const fallback = {
    sunrise: "06:10",
    sunset: "17:25",
    date: dateRaw,
    lat: safeLat,
    lon: safeLon,
    fallback: true,
    note: "No forecast for this date yet — showing Patna estimate. Confirm with local Panchang."
  };
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(String(safeLat))}` +
      `&longitude=${encodeURIComponent(String(safeLon))}` +
      `&daily=sunrise,sunset&timezone=auto` +
      `&start_date=${encodeURIComponent(dateRaw)}&end_date=${encodeURIComponent(dateRaw)}`;
    const r = await fetch(url, { next: { revalidate: 86400 } });
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
