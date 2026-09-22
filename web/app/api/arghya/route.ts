export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const date = searchParams.get("date") ?? "2026-11-15";
  if (!lat || !lon) return Response.json({ error: "lat/lon required" }, { status: 400 });
  try {
    const r = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto&start_date=${date}&end_date=${date}`,
      { next: { revalidate: 86400 } }
    );
    const j = await r.json();
    return Response.json({
      sunrise: j.daily?.sunrise?.[0]?.split("T")[1] ?? null,
      sunset: j.daily?.sunset?.[0]?.split("T")[1] ?? null,
      date, lat, lon, fallback: false
    });
  } catch {
    return Response.json({ sunrise: "06:00", sunset: "17:30", date, fallback: true });
  }
}
