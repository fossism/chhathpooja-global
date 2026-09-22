"use client";
import { useState } from "react";

const CITIES = [
  { name: "Patna", lat: 25.5941, lon: 85.1376 },
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Janakpur", lat: 26.7271, lon: 75.9067 },
  { name: "Kathmandu", lat: 27.7172, lon: 85.324 },
  { name: "Edison, NJ", lat: 40.518, lon: -74.412 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 }
];

export default function ArghyaFinder({ date }: { date: string }) {
  const [city, setCity] = useState(CITIES[0]);
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchTime(lat: number, lon: number) {
    setLoading(true);
    try {
      const r = await fetch(`/api/arghya?lat=${lat}&lon=${lon}&date=${date}`);
      setRes(await r.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select
          className="input !w-auto font-semibold"
          value={city.name}
          onChange={(e) => setCity(CITIES.find((c) => c.name === e.target.value)!)}
        >
          {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => fetchTime(city.lat, city.lon)}>{loading ? "Loading…" : "Get time"}</button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            navigator.geolocation?.getCurrentPosition(async (p) => {
              await fetchTime(p.coords.latitude, p.coords.longitude);
            });
          }}
        >
          Use my location
        </button>
      </div>
      {res ? (
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
      ) : (
        <p className="text-sm text-teal/70 mt-3">Pick a city — powered by Open-Meteo, no key needed.</p>
      )}
    </div>
  );
}
