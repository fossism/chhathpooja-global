"use client";
import { useState } from "react";

const CITIES = [
  { name: "Patna", lat: 25.5941, lon: 85.1376 },
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Janakpur", lat: 26.7288, lon: 85.9214 },
  { name: "Kathmandu", lat: 27.7172, lon: 85.324 },
  { name: "Edison, NJ", lat: 40.518, lon: -74.412 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 }
];

export default function ArghyaFinder({ date }: { date: string }) {
  const [city, setCity] = useState(CITIES[0]);
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTime(lat: number, lon: number) {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/arghya?lat=${lat}&lon=${lon}&date=${date}`);
      if (!r.ok) throw new Error(`Request failed (${r.status})`);
      setRes(await r.json());
    } catch (e) {
      setError("Could not load Arghya time. Check connection and retry.");
      setRes(null);
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser. Pick a city instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        await fetchTime(p.coords.latitude, p.coords.longitude);
      },
      () => {
        setError("Location blocked or unavailable. Pick a city instead.");
      },
      { maximumAge: 60000, timeout: 10000 }
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label htmlFor="arghya-city" className="label block mb-1">City</label>
          <select
            id="arghya-city"
            className="input !w-auto font-semibold"
            value={city.name}
            onChange={(e) => setCity(CITIES.find((c) => c.name === e.target.value)!)}
          >
            {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" disabled={loading} onClick={() => fetchTime(city.lat, city.lon)}>{loading ? "Loading…" : "Get time"}</button>
        <button
          className="btn btn-ghost"
          disabled={loading}
          onClick={useMyLocation}
        >
          Use my location
        </button>
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-red-700 mt-3">{error}</p>}
      <p className="text-xs text-teal/60 mt-2">“Use my location” asks your browser once — coordinates are sent to Open-Meteo for this lookup only, never stored. You can always pick a city instead.</p>
      {res ? (
        <div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="count-box">
              <p className="label">Usha • Sunrise</p>
              <p className="text-xl font-bold mt-1">{res.sunrise ?? "—"}</p>
            </div>
            <div className="count-box-alt">
              <p className="label !text-cream/70">Sandhya • Sunset</p>
              <p className="text-xl font-bold mt-1">{res.sunset ?? "—"}</p>
            </div>
          </div>
          {res.fallback && (
            <p className="text-xs text-teal/70 mt-2">{res.note ?? "Estimate — confirm with local Panchang."}</p>
          )}
        </div>
      ) : (
        !error && <p className="text-sm text-teal/70 mt-3">Pick a city — powered by Open-Meteo, no key needed.</p>
      )}
    </div>
  );
}
