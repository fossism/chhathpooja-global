"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getGhats } from "../../../lib/chhath";

const Map = dynamic(() => import("../../../components/GhatMap"), { ssr: false });

const MAX_NAME = 80;
const MAX_CITY = 60;
const MAX_COUNTRY = 60;
const MAX_Q = 80;

function sanitize(s: string, max: number): string {
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

type Mine = {
  id: string; name: string; city: string; country: string;
  riverOrPond: string; verified: false; pending: true;
  facilities: { parking: boolean; lighting: boolean; policeHelp: boolean; firstAid: boolean; drinkingWater: boolean };
};

export default function GhatsPage() {
  const seed = getGhats();
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", city: "", country: "" });
  const [mine, setMine] = useState<Mine[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const qSafe = sanitize(q, MAX_Q).toLowerCase();
  const all = [...mine, ...seed].filter((g) =>
    (g.name + g.city + g.country).toLowerCase().includes(qSafe)
  );

  function handleSubmit() {
    setFormError(null);
    const name = sanitize(form.name, MAX_NAME);
    const city = sanitize(form.city, MAX_CITY);
    const country = sanitize(form.country || "India", MAX_COUNTRY);
    if (!name || !city) {
      setFormError("Ghat name and city are required.");
      return;
    }
    // Local preview only — never marked verified. Real publish requires
    // authenticated POST + server-side moderation (see supabase/schema.sql).
    // Default all facilities to false so we don't imply unverified amenities.
    setMine([
      {
        id: `local-${Date.now()}`,
        name, city, country,
        riverOrPond: "Community spot",
        verified: false,
        pending: true,
        facilities: { parking: false, lighting: false, policeHelp: false, firstAid: false, drinkingWater: false }
      },
      ...mine
    ]);
    setForm({ name: "", city: "", country: "" });
  }

  return (
    <div className="shell py-10">
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Ghat finder</h1>
        <p className="section-sub">OpenStreetMap • parking, lighting, police help, first aid, drinking water.</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Patna, Delhi, Janakpur, Edison…"
          maxLength={MAX_Q}
          className="input mt-3"
        />
      </div>
      <Map />
      <div className="grid md:grid-cols-2 gap-3">
        {all.map((g) => (
          <div key={g.id} className="card">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold">{g.name}</p>
              {"pending" in g && (g as Mine).pending
                ? <span className="chip chip-yellow">Awaiting review</span>
                : <span className="chip">{g.verified ? "✓ Verified" : "Community"}</span>}
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
        <p className="section-sub">Know a pond, riverbank or gathering? Submit for review. Local preview only — a moderator verifies before public listing.</p>
        <div className="grid md:grid-cols-3 gap-2 mt-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ghat name" maxLength={MAX_NAME} className="input" />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" maxLength={MAX_CITY} className="input" />
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" maxLength={MAX_COUNTRY} className="input" />
        </div>
        {formError && <p role="alert" className="text-sm font-semibold text-red-700 mt-2">{formError}</p>}
        <button
          className="btn btn-primary mt-3"
          onClick={handleSubmit}
        >
          Submit for review
        </button>
      </div>
    </div>
    </div>
  );
}
