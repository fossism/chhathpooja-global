import Countdown from "../../components/Countdown";
import ArghyaFinder from "../../components/ArghyaFinder";
import SunriseMark from "../../components/SunriseMark";
import { getNextChhath, getGhats } from "../../lib/chhath";
import { getMessages } from "../../lib/messages";

export default function Home({ params }: { params: { locale: string } }) {
  const next = getNextChhath();
  const m = getMessages(params.locale);
  const ghats = getGhats();
  const days = [
    { n: "01", t: "Nahay-Khay", date: next.nahayKhay, s: "Holy bath, clean home, one simple meal." },
    { n: "02", t: "Kharna", date: next.kharna, s: "Day fast, evening kheer-roti prasad." },
    { n: "03", t: "Sandhya Arghya", date: next.sandhyaArghya, s: "Sunset offering with soop-daura." },
    { n: "04", t: "Usha Arghya", date: next.ushaArghya, s: "Sunrise offering, then Parana." }
  ];

  return (
    <div>
      {/* No. 01 — Hero */}
      <section className="band">
        <div className="shell grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="marker">No. 01<span className="marker-rule"></span>The Mahaparv</span>
            <h1 className="headline text-4xl md:text-6xl mt-4 leading-[1.05]">
              Keeping <em>Chhath</em><br />alive, everywhere
            </h1>
            <p className="text-teal/70 mt-4 max-w-md">{m.heroSubtitle} Exact dates, your city's Arghya time, vidhi checklist, ghat map and folk songs.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={`/${params.locale}/vidhi`} className="btn btn-primary">Start Vidhi</a>
              <a href={`/${params.locale}/ghats`} className="btn btn-ghost">Find ghats</a>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 text-xs">
              <span className="chip">Nov 13–16, 2026</span>
              <span className="chip">5 languages</span>
              <span className="chip">MIT open-source</span>
            </div>
          </div>
          <div className="grid gap-4 justify-items-center">
            <SunriseMark />
            <div className="card w-full">
              <Countdown target={next.sandhyaArghya} label={m.countdownTo} />
            </div>
          </div>
        </div>
      </section>

      {/* No. 02 — The 4 days */}
      <section className="band">
        <div className="shell">
          <span className="marker">No. 02</span>
          <h2 className="section-title mt-3">The 4 days</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {days.map((d) => (
              <div key={d.t} className="num-card">
                <span className="num-index">{d.n}</span>
                <h3 className="font-bold text-lg mt-2">{d.t}</h3>
                <p className="text-xs font-semibold text-teal/60 mt-0.5">{d.date}</p>
                <p className="text-sm text-teal/70 mt-2">{d.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No. 03 — Arghya time */}
      <section className="band">
        <div className="shell grid md:grid-cols-2 gap-10">
          <div>
            <span className="marker">No. 03</span>
            <h2 className="section-title mt-3">Arghya time, <em>your</em> city</h2>
            <p className="section-sub mt-2 max-w-md">Sunset is Sandhya Arghya, next sunrise is Usha Arghya. For {next.sandhyaArghya} — from Patna to New Jersey.</p>
            <blockquote className="callout mt-6">The sun never asks who you are — everyone shares prasad.</blockquote>
          </div>
          <div className="card h-fit">
            <ArghyaFinder date={next.sandhyaArghya} />
          </div>
        </div>
      </section>

      {/* No. 04 — Teal band: community in numbers */}
      <section className="band-teal">
        <div className="shell grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="marker marker--on-dark">No. 04<span className="marker-rule"></span>On the ground</span>
            <h2 className="headline headline--on-dark text-3xl md:text-5xl mt-4">One parv,<br />every ghat on earth</h2>
            <p className="text-cream/70 mt-4 max-w-md">Crowdsourced ghats, photos from the diaspora, and songs your nani sang — all open data.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={`/${params.locale}/ghats`} className="btn btn--on-dark">Open ghat map</a>
              <a href={`/${params.locale}/wall`} className="btn btn-accent">See global wall</a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[[String(ghats.length), "Ghats mapped"], ["5", "Languages"], ["2025–30", "Verified dates"]].map(([v, l]) => (
              <div key={l} className="text-center border-l border-cream/25 pl-4">
                <p className="text-3xl md:text-4xl font-extrabold text-mustard">{v}</p>
                <p className="text-xs uppercase tracking-widest text-cream/70 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No. 05 — Explore */}
      <section className="band">
        <div className="shell">
          <span className="marker">No. 05<span className="marker-rule"></span>Explore</span>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="num-card">
              <span className="num-index">A</span>
              <h3 className="font-bold text-lg mt-2">Folk archive</h3>
              <p className="text-sm text-teal/70 mt-1">Lyrics + meaning with singer credit. Community licensed.</p>
              <a href={`/${params.locale}/songs`} className="btn btn-ghost mt-4 !py-2 text-sm">Browse songs →</a>
            </div>
            <div className="num-card">
              <span className="num-index">B</span>
              <h3 className="font-bold text-lg mt-2">Vidhi checklist</h3>
              <p className="text-sm text-teal/70 mt-1">Tick steps as you complete them across the 4 days.</p>
              <a href={`/${params.locale}/vidhi`} className="btn btn-ghost mt-4 !py-2 text-sm">Open guide →</a>
            </div>
            <div className="num-card">
              <span className="num-index">C</span>
              <h3 className="font-bold text-lg mt-2">Kids mode</h3>
              <p className="text-sm text-teal/70 mt-1">The story + a 3-question quiz for the youngest vrati.</p>
              <a href={`/${params.locale}/kids`} className="btn btn-ghost mt-4 !py-2 text-sm">Start →</a>
            </div>
          </div>
          <p className="text-xs text-teal/60 mt-6">{m.disclaimer}</p>
        </div>
      </section>

      {/* Mustard CTA band */}
      <section className="band-mustard">
        <div className="shell">
          <span className="marker">No. 06 — Build it with us</span>
          <h2 className="headline text-3xl md:text-5xl mt-3">Do Chhath anywhere.<br />Pin it for everyone.</h2>
          <p className="mt-3 max-w-xl font-medium">Add your ghat, share a wall photo, translate one line. No code needed.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={`/${params.locale}/ghats`} className="btn btn-primary">Add your ghat</a>
            <a href={`/${params.locale}/about`} className="btn btn-ghost !border-teal/40">Ways to contribute →</a>
          </div>
        </div>
      </section>
    </div>
  );
}
