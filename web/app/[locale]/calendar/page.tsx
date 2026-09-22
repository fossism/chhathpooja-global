import { getAllDates } from "../../../lib/chhath";

export default function Calendar() {
  const dates = getAllDates();
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="section-title">Chhath calendar 2025–2030</h1>
        <p className="section-sub">Kartik + Chaiti. Human-verified from DrikPanchang — never auto-calculated.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {dates.map((d) => (
          <div key={`${d.year}-${d.type}`} className="card">
            <div className="flex items-center justify-between">
              <span className="chip chip-yellow">{d.year} • {d.type}</span>
              <span className="text-xs text-teal/70">{d.source}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="count-box"><p className="label">Nahay-Khay</p><p className="font-bold mt-1">{d.nahayKhay}</p></div>
              <div className="count-box"><p className="label">Kharna</p><p className="font-bold mt-1">{d.kharna}</p></div>
              <div className="count-box-alt"><p className="label !text-cream/70">Sandhya</p><p className="font-bold mt-1">{d.sandhyaArghya}</p></div>
              <div className="count-box"><p className="label">Usha</p><p className="font-bold mt-1">{d.ushaArghya}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
