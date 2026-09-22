"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getGhats } from "../../../lib/chhath";

const Map = dynamic(() => import("../../../components/GhatMap"), { ssr: false });

export default function GhatsPage() {
  const seed = getGhats();
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", city: "", country: "" });
  const [mine, setMine] = useState<any[]>([]);

  const all = [...mine, ...seed].filter((g) =>
    (g.name + g.city + g.country).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Ghat finder</h1>
        <p className="section-sub">OpenStreetMap • parking, lighting, police help, first aid, drinking water.</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Patna, Delhi, Janakpur, Edison…"
          className="input mt-3"
        />
      </div>
      <Map />
      <div className="grid md:grid-cols-2 gap-3">
        {all.map((g) => (
          <div key={g.id} className="card">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold">{g.name}</p>
              <span className="chip">{g.verified ? "✓ Verified" : "Community"}</span>
            </div>
            <p className="text-sm text-teal/70 mt-1">{g.city}, {g.country} • {g.riverOrPond}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {Object.entries(g.facilities).map(([k, v]) => (
                <span key={k} className={`chip ${v ? "" : "opacity-50"}`}>{v ? "●" : "○"} {k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <h2 className="font-bold text-lg">Add your ghat</h2>
        <p className="section-sub">Know a pond, riverbank or gathering? Submit for review.</p>
        <div className="grid md:grid-cols-3 gap-2 mt-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ghat name" className="input" />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="input" />
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="input" />
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => {
            if (!form.name || !form.city) return;
            setMine([{ id: `local-${Date.now()}`, riverOrPond: "Community spot", verified: false, facilities: { parking: true, lighting: true, policeHelp: false, firstAid: false, drinkingWater: true }, ...form }, ...mine]);
            setForm({ name: "", city: "", country: "" });
          }}
        >
          Submit for review
        </button>
      </div>
    </div>
  );
}
