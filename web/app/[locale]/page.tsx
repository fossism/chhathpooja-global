import Countdown from "../../components/Countdown";
import ArghyaFinder from "../../components/ArghyaFinder";
import SunriseMark from "../../components/SunriseMark";
import Image from "next/image";
import Link from "next/link";
import { getNextChhath, getGhats } from "../../lib/chhath";
import { getMessages } from "../../lib/messages";

export default function Home({ params }: { params: { locale: string } }) {
  const next = getNextChhath();
  const m = getMessages(params.locale);
  const ghats = getGhats();
  const days = [
    { n: "01", t: "Nahay-Khay", date: next.nahayKhay, s: "Holy bath, clean home, one simple meal.", img: "/images/vidhi/nahay-khay.jpg" },
    { n: "02", t: "Kharna", date: next.kharna, s: "Day fast, evening kheer-roti prasad.", img: "/images/vidhi/kharna.jpg" },
    { n: "03", t: "Sandhya Arghya", date: next.sandhyaArghya, s: "Sunset offering with soop-daura.", img: "/images/vidhi/sandhya-arghya.jpg" },
    { n: "04", t: "Usha Arghya", date: next.ushaArghya, s: "Sunrise offering, then Parana.", img: "/images/vidhi/usha-arghya.jpg" }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="band">
        <div className="shell grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="marker">The Mahaparv</span>
            <h1 className="headline text-4xl md:text-6xl mt-4 leading-[1.05]">
              Keeping <em>Chhath</em><br />alive, everywhere
            </h1>
            <p className="text-teal/70 mt-4 max-w-md">{m.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href={`/${params.locale}/vidhi`} className="btn btn-primary">Start Vidhi</Link>
              <Link href={`/${params.locale}/ghats`} className="btn btn-ghost">Find ghats</Link>
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

      {/* Mural — just below hero */}
      <section aria-label="Chhath mural" className="mural-breakout">
        <figure className="mural-frame" style={{ background: "#E4DAD4" }}>
          <Image
            src="/chhath-mural.jpg"
            alt="Chhath Mahaparv mural — vrtais offering Arghya in the river"
            fill
            priority
            sizes="100vw"
            quality={65}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAMABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCQXI6Coprg/hVXJDUr8jmsPZpm6m4vQ//Z"
          />
          <figcaption>On the ghat — Chhath mural</figcaption>
        </figure>
      </section>

      {/* Illustrated Gatha teaser */}
      <section aria-labelledby="gatha-teaser" className="band bg-[#FBF3E9]">
        <div className="shell grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <span className="marker">
              <span className="marker-rule" />
              The Gatha
            </span>
            <h2 id="gatha-teaser" className="headline mt-4 text-3xl leading-[1.1] md:text-4xl">
              Why the first arghya goes to the{" "}
              <em className="text-mustard">setting</em> sun
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-teal/75 md:text-base">
              Karna of Anga, Draupadi in the forest, Sita coming home. The
              stories we carry down to the ghat, with old paintings and
              photographs from the river.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-teal/45">
              <span>Six stories</span>
              <span aria-hidden="true" className="h-px w-6 bg-teal/25" />
              <span>6 min read</span>
            </div>
            <Link
              href={`/${params.locale}/gatha`}
              className="mt-6 inline-flex items-center gap-2 border-b border-teal/40 pb-1 text-sm font-bold text-teal transition-colors hover:border-mustard hover:text-mustard"
            >
              Read the Gatha <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="w-full max-w-sm justify-self-center md:justify-self-end">
            <figure className="border border-line bg-white p-2.5 shadow-[12px_12px_0_0_rgba(232,184,75,0.35)] md:p-3">
              <div className="relative aspect-square overflow-hidden bg-teal/5">
                <Image
                  src="/images/gatha/surya-mandala.jpg"
                  alt="A geometric Surya mandala with the sun god at its centre, surrounded by planetary attendants"
                  fill
                  sizes="(max-width: 768px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 pb-1 pt-2.5 font-mono text-[10px] leading-relaxed text-teal/55">
                A Surya mandala, Rajasthan, c. 18th century. The sun sits at the
                centre of the planetary orbits.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* The 4 days */}
      <section className="band">
        <div className="shell">
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="marker">The Rituals</span>
              <h2 className="section-title mt-2">The 4 sacred days</h2>
            </div>
            <Link href={`/${params.locale}/vidhi`} className="hidden sm:inline-flex btn btn-ghost text-xs !py-1.5 !px-4">
              Full Vidhi guide →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mt-6">
            {days.map((d) => (
              <Link
                key={d.t}
                href={`/${params.locale}/vidhi`}
                className="num-card !p-0 overflow-hidden flex flex-col group hover:shadow-lg transition border-line bg-white"
              >
                <div className="relative w-full h-44 overflow-hidden bg-teal/10">
                  <Image
                    src={d.img}
                    alt={d.t}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 chip chip-yellow text-[11px] font-bold">
                    Day {d.n}
                  </span>
                  <p className="absolute bottom-2 left-3 right-3 text-xs font-semibold text-white/90">
                    {d.date}
                  </p>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-base text-teal group-hover:text-mustard transition">
                      {d.t}
                    </h3>
                    <p className="text-xs text-teal/70 mt-1 leading-relaxed">{d.s}</p>
                  </div>
                  <span className="text-xs font-bold text-teal mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Vidhi →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Arghya time */}
      <section className="band">
        <div className="shell grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="section-title mt-3">Arghya time, <em>your</em> city</h2>
            <p className="section-sub mt-2 max-w-md">Sunset is Sandhya Arghya, next sunrise is Usha Arghya. For {next.sandhyaArghya} — from Patna to New Jersey.</p>
            <blockquote className="callout mt-6">The sun never asks who you are — everyone shares prasad.</blockquote>
          </div>
          <div className="card h-fit">
            <ArghyaFinder date={next.sandhyaArghya} />
          </div>
        </div>
      </section>

      {/* Teal band: community in numbers */}
      <section className="band-teal">
        <div className="shell grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="marker marker--on-dark">On the ground</span>
            <h2 className="headline headline--on-dark text-3xl md:text-5xl mt-4">One parv,<br />every ghat on earth</h2>
            <p className="text-cream/70 mt-4 max-w-md">Crowdsourced ghats, photos from the diaspora, and songs your nani sang — all open data.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href={`/${params.locale}/ghats`} className="btn btn--on-dark">Open ghat map</Link>
              <Link href={`/${params.locale}/wall`} className="btn btn-accent">See global wall</Link>
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

      {/* Explore */}
      <section className="band">
        <div className="shell">
          <span className="marker">Explore</span>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="num-card">
              <span className="num-index">A</span>
              <h3 className="font-bold text-lg mt-2">Chhath Sahayak</h3>
              <p className="text-sm text-teal/70 mt-1">Offline guide — dates, vidhi, samagri, songs. No login.</p>
              <Link href={`/${params.locale}/ask`} className="btn btn-ghost mt-4 !py-2 text-sm">Ask →</Link>
            </div>
            <div className="num-card">
              <span className="num-index">B</span>
              <h3 className="font-bold text-lg mt-2">Folk archive</h3>
              <p className="text-sm text-teal/70 mt-1">Lyrics + meaning with singer credit. Community licensed.</p>
              <Link href={`/${params.locale}/songs`} className="btn btn-ghost mt-4 !py-2 text-sm">Browse songs →</Link>
            </div>
            <div className="num-card">
              <span className="num-index">C</span>
              <h3 className="font-bold text-lg mt-2">Vidhi checklist</h3>
              <p className="text-sm text-teal/70 mt-1">Tick steps as you complete them across the 4 days.</p>
              <Link href={`/${params.locale}/vidhi`} className="btn btn-ghost mt-4 !py-2 text-sm">Open guide →</Link>
            </div>
            <div className="num-card">
              <span className="num-index">D</span>
              <h3 className="font-bold text-lg mt-2">Kids mode</h3>
              <p className="text-sm text-teal/70 mt-1">The story + a 3-question quiz for the youngest vrati.</p>
              <Link href={`/${params.locale}/kids`} className="btn btn-ghost mt-4 !py-2 text-sm">Start →</Link>
            </div>
          </div>
          <p className="text-xs text-teal/60 mt-6">{m.disclaimer}</p>
        </div>
      </section>

      {/* Mustard CTA band */}
      <section className="band-mustard">
        <div className="shell">
          <span className="marker">Build it with us</span>
          <h2 className="headline text-3xl md:text-5xl mt-3">Do Chhath anywhere.<br />Pin it for everyone.</h2>
          <p className="mt-3 max-w-xl font-medium">Add your ghat, share a wall photo, translate one line. No code needed.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href={`/${params.locale}/ghats`} className="btn btn-primary">Add your ghat</Link>
            <Link href={`/${params.locale}/about`} className="btn btn-ghost !border-teal/40">Ways to contribute →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
