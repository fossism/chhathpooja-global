"use client";
import { useState } from "react";
import SunCompass from "./SunCompass";

const CITIES = [
  // Bihar & Purvanchal (Heartland)
  { name: "Patna, Bihar", lat: 25.5941, lon: 85.1376 },
  { name: "Gaya, Bihar", lat: 24.7955, lon: 85.0002 },
  { name: "Muzaffarpur, Bihar", lat: 26.1209, lon: 85.3647 },
  { name: "Bhagalpur, Bihar", lat: 25.2425, lon: 86.9842 },
  { name: "Darbhanga, Bihar", lat: 26.1542, lon: 85.8918 },
  { name: "Varanasi, UP", lat: 25.3176, lon: 82.9739 },
  { name: "Gorakhpur, UP", lat: 26.7606, lon: 83.3732 },
  { name: "Ranchi, Jharkhand", lat: 23.3441, lon: 85.3096 },
  { name: "Jamshedpur, Jharkhand", lat: 22.8046, lon: 86.2029 },
  { name: "Lucknow, UP", lat: 26.8467, lon: 80.9462 },
  // Major Indian Metros
  { name: "Delhi NCR", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Surat", lat: 21.1702, lon: 72.8311 },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  // Nepal
  { name: "Janakpur, Nepal", lat: 26.7288, lon: 85.9214 },
  { name: "Kathmandu, Nepal", lat: 27.7172, lon: 85.324 },
  { name: "Birgunj, Nepal", lat: 27.0104, lon: 84.8774 },
  // Global Diaspora
  { name: "Edison, New Jersey (USA)", lat: 40.518, lon: -74.412 },
  { name: "New York City (USA)", lat: 40.7128, lon: -74.006 },
  { name: "San Francisco / Bay Area (USA)", lat: 37.7749, lon: -122.4194 },
  { name: "Dallas, Texas (USA)", lat: 32.7767, lon: -96.797 },
  { name: "Toronto, Canada", lat: 43.6532, lon: -79.3832 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278 },
  { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Port Louis, Mauritius", lat: -20.1609, lon: 57.5012 }
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
            <p role="note" className="text-xs font-bold mt-2 rounded-lg border border-mustard bg-mustard/20 px-3 py-2">⚠ Estimate — {res.note ?? "Confirm with local Panchang."}</p>
          )}
          {Number.isFinite(Number(res.lat)) && res.date && (
            <SunCompass lat={Number(res.lat)} date={String(res.date)} />
          )}
        </div>
      ) : (
        !error && <p className="text-sm text-teal/70 mt-3">Pick a city — powered by Open-Meteo, no key needed.</p>
      )}
    </div>
  );
}
