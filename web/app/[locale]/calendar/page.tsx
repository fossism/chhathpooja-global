import { getAllDates } from "../../../lib/chhath";
import IcsButton from "../../../components/IcsButton";

export default function Calendar() {
  const dates = getAllDates();
  // Structured data: search engines + assistants can read festival dates directly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": dates.map((d) => ({
      "@type": "Festival",
      name: `Chhath Mahaparv ${d.year} (${d.type})`,
      startDate: d.nahayKhay,
      endDate: d.ushaArghya,
      description: `Nahay-Khay ${d.nahayKhay}, Kharna ${d.kharna}, Sandhya Arghya ${d.sandhyaArghya}, Usha Arghya ${d.ushaArghya}. Source: ${d.source}.`,
      inLanguage: ["en", "hi", "bho", "mai", "ne"]
    }))
  };
  return (
    <div className="shell py-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="section-title">Chhath calendar 2025–2030</h1>
          <p className="section-sub">Kartik + Chaiti. Human-verified from DrikPanchang — never auto-calculated.</p>
        </div>
        <IcsButton events={dates} label="All dates (.ics)" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {dates.map((d) => (
          <div key={`${d.year}-${d.type}`} className="card">
            <div className="flex items-center justify-between gap-2">
              <span className="chip chip-yellow">{d.year} • {d.type}</span>
              <span className="text-xs text-teal/70">{d.source}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="count-box"><p className="label">Nahay-Khay</p><p className="font-bold mt-1">{d.nahayKhay}</p></div>
              <div className="count-box"><p className="label">Kharna</p><p className="font-bold mt-1">{d.kharna}</p></div>
              <div className="count-box-alt"><p className="label !text-cream/70">Sandhya</p><p className="font-bold mt-1">{d.sandhyaArghya}</p></div>
              <div className="count-box"><p className="label">Usha</p><p className="font-bold mt-1">{d.ushaArghya}</p></div>
            </div>
            <div className="mt-3">
              <IcsButton events={[d]} label={`${d.year} ${d.type} (.ics)`} />
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
