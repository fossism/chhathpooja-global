import Link from "next/link";
import Image from "next/image";
import SamagriShowcase from "../../../components/SamagriShowcase";
import { getSamagriCatalog } from "../../../lib/samagri";

export default function About({ params }: { params: { locale: string } }) {
  const samagriItems = getSamagriCatalog();

  return (
    <div className="pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal/10 via-cream to-cream border-b border-line/70 py-10 md:py-14">
        <div className="shell">
          <div className="max-w-3xl">
            <span className="marker">Open-Source Digital Sanctuary</span>
            <h1 className="headline text-3xl sm:text-4xl md:text-5xl mt-2.5 leading-[1.1]">
              Keeping Chhath alive, <em>anywhere</em> on earth
            </h1>
            <p className="section-sub text-sm sm:text-base mt-3 leading-relaxed text-teal/80">
              A community-owned, ad-free initiative uniting over 150 million devotees across Bihar, 
              Jharkhand, Purvanchal, Nepal, and the global diaspora.
            </p>

            {/* Quick Navigation Anchors */}
            <div className="flex flex-wrap gap-2 mt-6">
              <a href="#mission" className="chip chip-yellow font-bold hover:scale-105 transition">
                📖 Mission
              </a>
              <a href="#beginner-guide" className="chip hover:scale-105 transition">
                🪔 Beginner Guide
              </a>
              <a href="#samagri" className="chip hover:scale-105 transition">
                🧺 Samagri Catalog
              </a>
              <a href="#diaspora-hacks" className="chip hover:scale-105 transition">
                🏙️ Diaspora Hacks
              </a>
              <a href="#contribute" className="chip hover:scale-105 transition">
                💻 Contribute
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Mission & Core Values */}
      <section id="mission" className="band scroll-mt-20">
        <div className="shell">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="marker">Why We Built This</span>
              <h2 className="section-title mt-2">
                Ancient devotion, modern world: <em>the digital bridge</em>
              </h2>
              <div className="space-y-3 mt-4 text-xs sm:text-sm text-teal/80 leading-relaxed">
                <p>
                  <strong>No Priests, No Hierarchy:</strong> Chhath is direct Vedic nature communion with 
                  <strong> Pratyaksha Devta Surya</strong> and <strong>Chhathi Maiya</strong>. 
                  Everyone stands as equals in the river.
                </p>
                <p>
                  <strong>Uniting the Diaspora:</strong> As families move from village ghats to London, 
                  California, or Dubai, crucial knowledge gets lost. We preserve authentic dates, lyrics, and rituals in one home.
                </p>
                <p>
                  <strong>Public Good:</strong> Free forever. Zero paywalls, zero ads, zero tracking, and fully offline-capable.
                </p>
              </div>
            </div>

            {/* 4 Value Pillars */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="card bg-white p-4">
                <span className="text-xl mb-1 block">🌿</span>
                <h3 className="font-bold text-xs sm:text-sm text-teal">100% Open-Source</h3>
                <p className="text-[11px] text-teal/70 mt-1">MIT licensed. Built by and for the global community.</p>
              </div>
              <div className="card bg-white p-4">
                <span className="text-xl mb-1 block">📶</span>
                <h3 className="font-bold text-xs sm:text-sm text-teal">Offline First (PWA)</h3>
                <p className="text-[11px] text-teal/70 mt-1">Works in waist-deep water with zero cell signal.</p>
              </div>
              <div className="card bg-white p-4">
                <span className="text-xl mb-1 block">☀️</span>
                <h3 className="font-bold text-xs sm:text-sm text-teal">Drik Verified</h3>
                <p className="text-[11px] text-teal/70 mt-1">Astronomical Panchang dates checked by human researchers.</p>
              </div>
              <div className="card bg-white p-4">
                <span className="text-xl mb-1 block">🗣️</span>
                <h3 className="font-bold text-xs sm:text-sm text-teal">5 Native Languages</h3>
                <p className="text-[11px] text-teal/70 mt-1">English, हिन्दी, भोजपुरी, मैथिली, and नेपाली.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Beginner Zero-Anxiety Guide */}
      <section id="beginner-guide" className="band bg-cream/50 scroll-mt-20">
        <div className="shell space-y-8">
          <div>
            <span className="marker">For First-Timers & Youths</span>
            <h2 className="section-title mt-1.5">
              Starting Chhath: <em>Zero Anxiety, Pure Devotion</em>
            </h2>
            <p className="section-sub mt-1 max-w-2xl">
              Chhath is about <em>Shraddha</em> (reverence) and <em>Bhaav</em> (love) — not fear of 50 rigid rules.
            </p>
          </div>

          {/* 3 Core Rules */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-white border-mustard/30 p-5">
              <span className="chip chip-yellow text-[10px] font-bold mb-2 inline-block">Step 01</span>
              <h3 className="font-bold text-sm text-teal">Start as a Saha-Vrati (Helper)</h3>
              <p className="text-xs text-teal/75 mt-1.5 leading-relaxed">
                You don&apos;t have to do the full 36-hour fast in year one! Carry the Daura, wash fruits, or prepare thekua alongside elders.
              </p>
            </div>
            <div className="card bg-white border-mustard/30 p-5">
              <span className="chip chip-yellow text-[10px] font-bold mb-2 inline-block">Step 02</span>
              <h3 className="font-bold text-sm text-teal">Intent Over Perfection</h3>
              <p className="text-xs text-teal/75 mt-1.5 leading-relaxed">
                If you drop a fruit or don&apos;t know all songs, don&apos;t panic. Surya Dev and Chhathi Maiya see purity of heart above all.
              </p>
            </div>
            <div className="card bg-white border-mustard/30 p-5">
              <span className="chip chip-yellow text-[10px] font-bold mb-2 inline-block">Step 03</span>
              <h3 className="font-bold text-sm text-teal">100% Eco-Friendly</h3>
              <p className="text-xs text-teal/75 mt-1.5 leading-relaxed">
                Zero single-use plastic. Use bamboo winnowing trays, terracotta diyas, and cotton garments. Leave the ghat cleaner than you found it.
              </p>
            </div>
          </div>

          {/* Compact 4-Day Checklist */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-teal">The 4 Sacred Days at a Glance</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  day: "Day 01",
                  title: "Nahay-Khay (नहाय-खाय)",
                  date: "Kartik Shukla Chaturthi",
                  img: "/images/vidhi/nahay-khay.jpg",
                  desc: "Holy bath, clean kitchen. Simple satvik Lauki-Bhaat and Chana dal cooked in pure ghee and Sendha Namak."
                },
                {
                  day: "Day 02",
                  title: "Kharna (खरना)",
                  date: "Kartik Shukla Panchami",
                  img: "/images/vidhi/kharna.jpg",
                  desc: "Day-long fast. Evening kheer (Rasiya) made with cow milk and organic jaggery. 36-hr nirjala fast begins."
                },
                {
                  day: "Day 03",
                  title: "Sandhya Arghya (संध्या अर्घ्य)",
                  date: "Kartik Shukla Shashthi",
                  img: "/images/vidhi/sandhya-arghya.jpg",
                  desc: "Fresh Thekua made. Family carries bamboo Daura on head to the riverbank. Evening sunset offering."
                },
                {
                  day: "Day 04",
                  title: "Usha Arghya (उषा अर्घ्य)",
                  date: "Kartik Shukla Saptami",
                  img: "/images/vidhi/usha-arghya.jpg",
                  desc: "Pre-dawn gathering. Offering arghya to the rising sun, breaking fast with ginger-jaggery, and receiving prasad."
                }
              ].map((d) => (
                <div key={d.day} className="card bg-white !p-0 overflow-hidden flex flex-col border-line hover:border-teal transition">
                  <div className="relative w-full h-32 bg-teal/10">
                    <Image src={d.img} alt={d.title} fill className="object-cover" />
                    <span className="absolute top-2 left-2 chip chip-yellow text-[10px] font-bold">{d.day}</span>
                  </div>
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-bold text-xs text-teal">{d.title}</h4>
                      <p className="text-[10px] text-teal/50 font-mono">{d.date}</p>
                      <p className="text-xs text-teal/70 mt-1.5 leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Samagri Catalog Preview */}
      <section id="samagri" className="band scroll-mt-20">
        <div className="shell space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="marker">Puja Essentials</span>
              <h2 className="section-title mt-1.5">
                Sacred Samagri <em>Showcase</em>
              </h2>
              <p className="section-sub mt-1 max-w-xl">
                Every basket, fruit, and vessel carries deep spiritual and Ayurvedic science.
              </p>
            </div>
            <Link href={`/${params.locale}/wall#samagri-checklist`} className="btn btn-primary text-xs !py-2 !px-4 self-start sm:self-auto">
              View Full Wall Checklist →
            </Link>
          </div>

          <SamagriShowcase items={samagriItems} />
        </div>
      </section>

      {/* SECTION 4: Modern Apartment & Global Diaspora Hacks */}
      <section id="diaspora-hacks" className="band bg-teal text-cream scroll-mt-20">
        <div className="shell space-y-6">
          <div>
            <span className="marker marker--on-dark">Modern & Diaspora Solutions</span>
            <h2 className="headline headline--on-dark text-2xl sm:text-3xl md:text-4xl mt-2">
              Apartment or Abroad? <em>How to do Chhath anywhere</em>
            </h2>
            <p className="text-cream/70 text-xs sm:text-sm mt-1 max-w-xl">
              You don&apos;t need a natural riverbank. Shastra-approved adaptations used by thousands worldwide:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-teal/40 border-cream/20 text-cream p-4">
              <span className="text-2xl block mb-1">🏊‍♂️</span>
              <h3 className="font-bold text-mustard text-sm">Inflatable Pool / Tub</h3>
              <p className="text-xs text-cream/70 mt-1 leading-relaxed">
                Place a clean tub on your balcony or terrace, add Gangajal, and stand inside facing the open sky.
              </p>
            </div>
            <div className="card bg-teal/40 border-cream/20 text-cream p-4">
              <span className="text-2xl block mb-1">🧭</span>
              <h3 className="font-bold text-mustard text-sm">Sun Compass</h3>
              <p className="text-xs text-cream/70 mt-1 leading-relaxed">
                Surrounded by skyscrapers? Use our home Arghya Finder to get the exact astronomical sunrise angle.
              </p>
            </div>
            <div className="card bg-teal/40 border-cream/20 text-cream p-4">
              <span className="text-2xl block mb-1">🍳</span>
              <h3 className="font-bold text-mustard text-sm">Induction Stove</h3>
              <p className="text-xs text-cream/70 mt-1 leading-relaxed">
                Smoke detectors prohibit wood fire? A spotless virgin induction cooktop dedicated to puja is accepted.
              </p>
            </div>
            <div className="card bg-teal/40 border-cream/20 text-cream p-4">
              <span className="text-2xl block mb-1">🧺</span>
              <h3 className="font-bold text-mustard text-sm">Brass Soop (पीतल सूप)</h3>
              <p className="text-xs text-cream/70 mt-1 leading-relaxed">
                Fresh bamboo unavailable abroad? Pure brass or copper winnowing trays are sustainable and Vedic-sanctioned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Contribute */}
      <section id="contribute" className="band scroll-mt-20">
        <div className="shell space-y-6">
          <div>
            <span className="marker">Community Owned</span>
            <h2 className="section-title mt-1.5">
              Contribute to <em>Chhath Mahaparv</em>
            </h2>
            <p className="section-sub mt-1 max-w-xl">
              100% open-source on GitHub. Add a ghat, share a wall photo, or improve translations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-white p-5 hover:shadow-md transition">
              <span className="text-2xl block mb-1">🗺️</span>
              <h3 className="font-bold text-teal text-base">Pin Your Local Ghat</h3>
              <p className="text-xs text-teal/70 mt-1 leading-relaxed">
                Add ghats from your city to help fellow devotees find where to gather.
              </p>
              <Link href={`/${params.locale}/ghats`} className="btn btn-primary text-xs mt-3 inline-flex !py-1.5 !px-3">
                Add a Ghat →
              </Link>
            </div>

            <div className="card bg-white p-5 hover:shadow-md transition">
              <span className="text-2xl block mb-1">📸</span>
              <h3 className="font-bold text-teal text-base">Share on Global Wall</h3>
              <p className="text-xs text-teal/70 mt-1 leading-relaxed">
                Upload your family&apos;s festive memories to showcase diaspora devotion.
              </p>
              <Link href={`/${params.locale}/wall`} className="btn btn-ghost text-xs mt-3 inline-flex !py-1.5 !px-3">
                Visit Wall →
              </Link>
            </div>

            <div className="card bg-white p-5 hover:shadow-md transition">
              <span className="text-2xl block mb-1">💻</span>
              <h3 className="font-bold text-teal text-base">Code &amp; Translations</h3>
              <p className="text-xs text-teal/70 mt-1 leading-relaxed">
                Translate strings, add missing songs, or contribute bug fixes on GitHub.
              </p>
              <a 
                href="https://github.com/fossism/chhathpooja-global" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-ghost text-xs mt-3 inline-flex !py-1.5 !px-3 !border-teal/40"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
