export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const date = searchParams.get("date") ?? "2026-11-15";
  if (!lat || !lon) return Response.json({ error: "lat/lon required" }, { status: 400 });
  // Open-Meteo forecast only covers ~16 days ahead. Far-future festival
  // dates return empty daily arrays, so detect nulls and fall back.
  const fallback = {
    sunrise: "06:10",
    sunset: "17:25",
    date, lat, lon,
    fallback: true,
    note: "No forecast for this date yet — showing Patna estimate. Confirm with local Panchang."
  };
  try {
    const r = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto&start_date=${date}&end_date=${date}`,
      { next: { revalidate: 86400 } }
    );
    if (!r.ok) return Response.json(fallback);
    const j = await r.json();
    const sunrise: string | null = j.daily?.sunrise?.[0]?.split("T")[1] ?? null;
    const sunset: string | null = j.daily?.sunset?.[0]?.split("T")[1] ?? null;
    if (!sunrise || !sunset) return Response.json(fallback);
    return Response.json({
      sunrise, sunset,
      date, lat, lon, fallback: false
    });
  } catch {
    return Response.json(fallback);
  }
}
