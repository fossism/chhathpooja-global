import Countdown from "../../components/Countdown";
import ArghyaFinder from "../../components/ArghyaFinder";
import { getNextChhath, getGhats } from "../../lib/chhath";
import { getMessages } from "../../lib/messages";

export default function Home({ params }: { params: { locale: string } }) {
  const next = getNextChhath();
  const m = getMessages(params.locale);
  const ghats = getGhats();
  const days = [
    { d: "Day 1", t: "Nahay-Khay", date: next.nahayKhay, s: "Holy bath, clean home, simple meal once." },
    { d: "Day 2", t: "Kharna", date: next.kharna, s: "Day fast, evening kheer-roti prasad." },
    { d: "Day 3", t: "Sandhya Arghya", date: next.sandhyaArghya, s: "Sunset offering with soop-daura." },
    { d: "Day 4", t: "Usha Arghya", date: next.ushaArghya, s: "Sunrise offering + Parana." }
  ];

  return (
    <div className="grid gap-6">
      {/* HERO — like TinkerHub event header */}
      <section className="card !p-0 overflow-hidden">
        <div className="h-36 md:h-44 bg-teal relative">
          <div className="absolute inset-0 flex items-end">
            <div className="p-5 md:p-7 text-cream">
              <div className="flex flex-wrap gap-2">
                <span className="chip chip-yellow">Kartik Chhath 2026</span>
                <span className="chip !bg-cream/15 !text-cream">Public • Global • Open-source</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">Chhath Mahaparv — One Global Family</h1>
            </div>
          </div>
          <div className="absolute right-6 top-6 w-20 h-20 rounded-full bg-mustard border-4 border-cream/70 hidden sm:block" />
        </div>
        <div className="p-5 md:p-7 grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="chip">📅 Nov 13 – Nov 16, 2026</span>
              <span className="chip">🌍 Online + ghats worldwide</span>
            </div>
            <p className="text-teal/70 text-sm mt-3">{m.heroSubtitle} Exact dates, your city's Arghya time, vidhi checklist, ghat map and folk songs.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <a href={`/${params.locale}/vidhi`} className="btn btn-primary">Start vidhi guide</a>
              <a href={`/${params.locale}/ghats`} className="btn btn-ghost">Find ghats</a>
            </div>
            <div className="flex gap-5 mt-5 text-sm">
              <span><b>5</b> <span className="text-teal/70">languages</span></span>
              <span><b>{ghats.length}</b> <span className="text-teal/70">ghats</span></span>
              <span><b>MIT</b> <span className="text-teal/70">open data</span></span>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-cream p-5">
            <Countdown target={next.sandhyaArghya} label={m.countdownTo} />
          </div>
        </div>
      </section>

      {/* 4 DAYS */}
      <section>
        <h2 className="section-title">The 4 days</h2>
        <p className="section-sub">Nahay-Khay → Kharna → Sandhya Arghya → Usha Arghya.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {days.map((d) => (
            <div key={d.t} className="card">
              <p className="label">{d.d} • {d.date}</p>
              <p className="font-bold text-lg mt-1">{d.t}</p>
              <p className="text-sm text-teal/70 mt-1">{d.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARGHYA */}
      <section className="card">
        <h2 className="section-title">My city Arghya time</h2>
        <p className="section-sub">Sunset = Sandhya Arghya • next sunrise = Usha Arghya. For {next.sandhyaArghya}.</p>
        <div className="mt-4"><ArghyaFinder date={next.sandhyaArghya} /></div>
      </section>

      {/* GHATS / SONGS / WALL */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <p className="label">Ghat finder</p>
          <h3 className="font-bold text-lg mt-1">{ghats.length} ghats on the map</h3>
          <ul className="mt-2 text-sm space-y-1">
            {ghats.slice(0, 4).map((g) => <li key={g.id} className="text-teal/70">📍 <span className="text-teal font-medium">{g.name}</span> — {g.city}</li>)}
          </ul>
          <a href={`/${params.locale}/ghats`} className="btn btn-ghost mt-4 !py-2 text-sm">Open map →</a>
        </div>
        <div className="card">
          <p className="label">Folk archive</p>
          <h3 className="font-bold text-lg mt-1">Songs your nani sang</h3>
          <p className="text-sm text-teal/70 mt-2">Lyrics + meaning with singer credit. Community licensed.</p>
          <a href={`/${params.locale}/songs`} className="btn btn-ghost mt-4 !py-2 text-sm">Browse songs →</a>
        </div>
        <div className="card">
          <p className="label">Global wall</p>
          <h3 className="font-bold text-lg mt-1">Patna to London</h3>
          <p className="text-sm text-teal/70 mt-2">Where are you doing Chhath from? Pin your photo.</p>
          <a href={`/${params.locale}/wall`} className="btn btn-ghost mt-4 !py-2 text-sm">See wall →</a>
        </div>
      </section>

      {/* FAQ */}
      <section className="card">
        <h2 className="section-title">Quick answers</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
          <p><b>What time is Arghya?</b><br /><span className="text-teal/70">Use the finder above.</span></p>
          <p><b>No river nearby?</b><br /><span className="text-teal/70">Pond, rooftop tub or community gathering works.</span></p>
          <p><b>How long is the fast?</b><br /><span className="text-teal/70">~36 hrs from Kharna evening. Go symbolic if unwell.</span></p>
        </div>
        <p className="text-xs text-teal/70 mt-3">{m.disclaimer}</p>
      </section>
    </div>
  );
}
