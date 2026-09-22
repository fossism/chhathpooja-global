"use client";
import { useState } from "react";
import samagri from "../../../../data/samagri.json";

const VIDHI = [
  { day: "nahayKhay", title: "Day 1 — Nahay-Khay", steps: ["Clean home + path to ghat", "Holy bath, fresh clothes", "Offer to Surya first, then eat once", "Rest early — vrata begins"] },
  { day: "kharna", title: "Day 2 — Kharna", steps: ["Fast through the day", "Evening kheer + roti prasad", "Offer to Chhathi Maiya", "Begin the night vigil"] },
  { day: "sandhyaArghya", title: "Day 3 — Sandhya Arghya", steps: ["Pack soop + daura", "Reach ghat 1 hr before sunset", "Offer arghya at sunset", "Night songs + vigil"] },
  { day: "ushaArghya", title: "Day 4 — Usha Arghya + Parana", steps: ["Reach before sunrise", "Offer arghya at sunrise", "Break fast with prasad", "Share prasad with all"] }
];

export default function Vidhi() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setDone((p) => ({ ...p, [k]: !p[k] }));
  const total = VIDHI.flatMap((v) => v.steps).length;
  const doneCount = Object.values(done).filter(Boolean).length;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Vidhi guide</h1>
        <p className="section-sub">Tick steps as you complete them. {doneCount}/{total} done.</p>
        <div className="mt-3 h-2.5 rounded-full bg-teal/20 overflow-hidden">
          <div className="h-full bg-teal" style={{ width: `${Math.round((doneCount / total) * 100)}%` }} />
        </div>
      </div>
      <div className="card">
        <h2 className="font-bold">Samagri (ritual items)</h2>
        <div className="grid md:grid-cols-2 gap-2 mt-3">
          {Object.entries(samagri as any).map(([k, v]: any) => (
            <div key={k} className="rounded-xl border border-line bg-cream p-3">
              <p className="font-bold capitalize text-sm">{k}</p>
              <ul className="text-sm text-teal/70 list-disc pl-4 mt-1">{v.map((x: string) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      {VIDHI.map((v) => (
        <div key={v.day} className="card">
          <h2 className="font-bold text-lg">{v.title}</h2>
          <div className="mt-2 space-y-2">
            {v.steps.map((s, i) => {
              const k = `${v.day}-${i}`;
              return (
                <label key={k} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 cursor-pointer hover:bg-cream">
                  <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} className="w-5 h-5 accent-[#5F5CE5]" />
                  <span className={`text-sm ${done[k] ? "line-through text-teal/70" : "font-medium"}`}>{s}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
