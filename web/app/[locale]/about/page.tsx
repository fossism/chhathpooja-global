import Link from "next/link";
import Image from "next/image";
import SamagriShowcase from "../../../components/SamagriShowcase";
import { getSamagriCatalog } from "../../../lib/samagri";

export default function About({ params }: { params: { locale: string } }) {
  const samagriItems = getSamagriCatalog();

  return (
    <div className="pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal/10 via-cream to-cream border-b border-line/70 py-12 md:py-16">
        <div className="shell">
          <div className="max-w-3xl">
            <span className="marker">The Global Mission</span>
            <h1 className="headline text-4xl sm:text-5xl md:text-6xl mt-3 leading-[1.08]">
              Keeping Chhath alive, <em>anywhere</em> on earth
            </h1>
            <p className="section-sub text-base sm:text-lg mt-4 leading-relaxed text-teal/80">
              ChhathMahaparv (<code>chhathpooja-global</code>) is a community-owned, ad-free, 
              open-source digital sanctuary built for over 150 million devotees across Bihar, 
              Jharkhand, Eastern UP, Nepal, and the worldwide diaspora from London and New Jersey to Dubai and Sydney.
            </p>

            {/* Quick In-Page Navigation Anchor Bar */}
            <div className="flex flex-wrap gap-2 mt-8">
              <a href="#about-project" className="chip chip-yellow font-bold hover:scale-105 transition">
                📖 Project Mission
              </a>
              <a href="#beginner-guide" className="chip hover:scale-105 transition">
                🪔 Beginner's Guide & Steps
              </a>
              <a href="#samagri" className="chip hover:scale-105 transition">
                🧺 Samagri with Images
              </a>
              <a href="#diaspora-hacks" className="chip hover:scale-105 transition">
                🏙️ Apartment & Diaspora Hacks
              </a>
              <a href="#contribute" className="chip hover:scale-105 transition">
                💻 Open Source & Help
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Deep Dive Into The Project */}
      <section id="about-project" className="band scroll-mt-20">
        <div className="shell space-y-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="marker">Why We Built This</span>
              <h2 className="section-title mt-2">
                Ancient devotion, modern world: the digital bridge
              </h2>
              <p className="text-teal/80 text-sm sm:text-base leading-relaxed mt-4">
                Chhath is unlike any festival on the planet. There are no middleman priests (pandits), 
                no expensive temples, and no caste boundaries. It is a direct Vedic communion between human beings 
                and Nature—honoring <strong>Pratyaksha Devta Surya</strong> (the visible sun) and 
                <strong> Chhathi Maiya</strong> (Usha, the cosmic morning dawn and protector of children).
              </p>
              <p className="text-teal/80 text-sm sm:text-base leading-relaxed mt-3">
                Yet as families migrate to metropolitan hubs across India and across the oceans, 
                crucial knowledge gets fragmented: dates on one commercial website, sunset timings on another, 
                lyrics remembered only half-way by grandparents, and young second-generation immigrants feeling 
                intimidated by strict rules without understanding the loving essence behind them.
              </p>
              <p className="text-teal/80 text-sm sm:text-base leading-relaxed mt-3">
                <strong>ChhathMahaparv</strong> was built to solve this once and for all: putting every date, 
                ghat location, audio song, vidhi step, and samagri list into a single, lightning-fast, offline-capable 
                home that anyone can access without logins, paywalls, or advertisements.
              </p>
            </div>

            {/* Core Values Card Matrix */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card bg-white hover:border-mustard transition">
                <span className="text-2xl mb-2 block">🌿</span>
                <h3 className="font-bold text-teal">100% Free & Open-Source</h3>
                <p className="text-xs text-teal/70 mt-1.5 leading-relaxed">
                  MIT licensed. No venture capital, no monetization, no tracking cookies, and no advertisements. 
                  Owned collectively by the diaspora.
                </p>
              </div>

              <div className="card bg-white hover:border-mustard transition">
                <span className="text-2xl mb-2 block">📶</span>
                <h3 className="font-bold text-teal">Offline-First PWA</h3>
                <p className="text-xs text-teal/70 mt-1.5 leading-relaxed">
                  Engineered to work flawlessly when you are standing waist-deep in water at the ghat 
                  with zero cellular network bars.
                </p>
              </div>

              <div className="card bg-white hover:border-mustard transition">
                <span className="text-2xl mb-2 block">☀️</span>
                <h3 className="font-bold text-teal">Panchang Verified</h3>
                <p className="text-xs text-teal/70 mt-1.5 leading-relaxed">
                  Every date is checked by human researchers from DrikPanchang. We never let AI or computers 
                  hallucinate sacred fasting dates.
                </p>
              </div>

              <div className="card bg-white hover:border-mustard transition">
                <span className="text-2xl mb-2 block">🗣️</span>
                <h3 className="font-bold text-teal">5 Native Languages</h3>
                <p className="text-xs text-teal/70 mt-1.5 leading-relaxed">
                  Fully translated in English, Hindi, Bhojpuri (भोजपुरी), Maithili (मैथिली), and Nepali (नेपाली) 
                  to honor our mother tongues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Cool Way to Start for Beginners */}
      <section id="beginner-guide" className="band bg-cream/50 border-y border-line scroll-mt-20">
        <div className="shell space-y-10">
          <div>
            <span className="marker">For First-Timers & Youths</span>
            <h2 className="section-title mt-2">
              The beginner's zero-anxiety roadmap to starting Chhath
            </h2>
            <p className="section-sub mt-2 max-w-2xl">
              Many people believe Chhath can only be done if you follow 50 rigid rules. That is a misconception. 
              Chhath is about <em>Shraddha</em> (reverence) and <em>Bhav</em> (devotion). Here is the cool, loving, 
              step-by-step way a beginner or young couple can take their first steps.
            </p>
          </div>

          {/* 3 Step Beginner Onboarding Principles */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-white border-mustard/40">
              <span className="chip chip-yellow text-xs font-bold mb-3 inline-block">Rule 01</span>
              <h3 className="font-bold text-lg text-teal">Start as a "Saha-Vrati" (Helper)</h3>
              <p className="text-xs text-teal/80 mt-2 leading-relaxed">
                You do not have to undertake the full 36-hour nirjala fast on year one! 
                Begin by carrying the Daura, washing the fruits, cleaning the home, preparing thekua dough, 
                or offering Arghya alongside your family or community elders.
              </p>
            </div>

            <div className="card bg-white border-mustard/40">
              <span className="chip chip-yellow text-xs font-bold mb-3 inline-block">Rule 02</span>
              <h3 className="font-bold text-lg text-teal">Intent Matters More than Perfection</h3>
              <p className="text-xs text-teal/80 mt-2 leading-relaxed">
                If you accidentally drop a fruit or don't know a Bhojpuri folk song, do not panic. 
                Surya Dev is the life-giver of all planets; Chhathi Maiya is a loving mother. 
                Keep your heart pure and your surroundings clean.
              </p>
            </div>

            <div className="card bg-white border-mustard/40">
              <span className="chip chip-yellow text-xs font-bold mb-3 inline-block">Rule 03</span>
              <h3 className="font-bold text-lg text-teal">Keep It 100% Eco-Friendly</h3>
              <p className="text-xs text-teal/80 mt-2 leading-relaxed">
                Chhath is the planet's most sustainable festival. Zero plastic packaging. 
                Use bamboo winnowing trays, clay hearths, earthen diyas, cotton clothes, and edible fruits. 
                Leave the river cleaner than you found it.
              </p>
            </div>
          </div>

          {/* The 4 Days Step-By-Step Breakdown */}
          <div className="mt-8 space-y-6">
            <h3 className="headline text-2xl sm:text-3xl text-teal">
              The 4-Day Journey: Exactly what happens each day
            </h3>

            <div className="space-y-4">
              {/* Day 1 */}
              <div className="card bg-white flex flex-col md:flex-row gap-6 items-start hover:border-teal transition">
                <div className="relative w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0 bg-teal/10">
                  <Image
                    src="/images/vidhi/nahay-khay.jpg"
                    alt="Nahay-Khay Day 1"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 chip chip-yellow text-[10px] font-bold">
                    Day 01
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg text-teal">Day 1: Nahay-Khay (नहाय-खाय) — Cleanse & Purify</h4>
                    <span className="text-xs text-teal/60 font-mono">Kartik Shukla Chaturthi</span>
                  </div>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Ritual:</strong> Wake up before sunrise, clean the entire house and kitchen, 
                    take a purifying bath (in a river or with water infused with a few drops of Gangajal). Wear clean, fresh clothes.
                  </p>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Beginner's Meal:</strong> Prepare <em>Lauki-Bhaat</em> (bottle gourd curry and Arwa rice) 
                    and Chana dal, cooked strictly with rock salt (Sendha Namak) and pure desi ghee in clean brass, steel, or clay vessels. 
                    The vrati eats first with a quiet prayer; the family partakes afterwards. No food is eaten after sunset.
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="card bg-white flex flex-col md:flex-row gap-6 items-start hover:border-teal transition">
                <div className="relative w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0 bg-teal/10">
                  <Image
                    src="/images/vidhi/kharna.jpg"
                    alt="Kharna Day 2"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 chip chip-yellow text-[10px] font-bold">
                    Day 02
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg text-teal">Day 2: Kharna (खरना) — The Solemn Fast & Divine Kheer</h4>
                    <span className="text-xs text-teal/60 font-mono">Kartik Shukla Panchami</span>
                  </div>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Ritual:</strong> The vrati fasts the entire day without food or water (Nirjala). 
                    In the evening at dusk, sweet <em>Rasiya</em> (rice kheer cooked in pure cow milk and organic jaggery) 
                    and whole wheat rotis are prepared on a pristine wood or induction flame.
                  </p>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Sacred Moment:</strong> Offered in absolute silence to Chhathi Maiya. The vrati eats this prasad, 
                    drinks water, and then begins the monumental <strong>36-hour unbroken fast (Nirjala)</strong> 
                    which continues without a single drop of water until morning Arghya on Day 4.
                  </p>
                </div>
              </div>

              {/* Day 3 */}
              <div className="card bg-white flex flex-col md:flex-row gap-6 items-start hover:border-teal transition">
                <div className="relative w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0 bg-teal/10">
                  <Image
                    src="/images/vidhi/sandhya-arghya.jpg"
                    alt="Sandhya Arghya Day 3"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 chip chip-yellow text-[10px] font-bold">
                    Day 03
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg text-teal">Day 3: Sandhya Arghya (संध्या अर्घ्य) — Sunset Offering at the Ghat</h4>
                    <span className="text-xs text-teal/60 font-mono">Kartik Shukla Shashthi</span>
                  </div>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Ritual:</strong> During the day, sacred Thekua prasad is freshly prepared. The bamboo Daura 
                    and Soop are reverently loaded with thekua, coconuts, bananas, and autumn fruits. The family walks 
                    to the river or ghat with the Daura on their head while singing traditional geet.
                  </p>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Cosmic Offering:</strong> Standing waist-deep in water facing the western horizon, 
                    the vrati raises the Soop as the crimson sun sets. Family members pour a stream of cow milk and holy water 
                    over the offerings. At night, families keep vigil (<em>Kosi Bharai</em>) under a 5-sugarcane canopy lit with 24 clay lamps.
                  </p>
                </div>
              </div>

              {/* Day 4 */}
              <div className="card bg-white flex flex-col md:flex-row gap-6 items-start hover:border-teal transition">
                <div className="relative w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0 bg-teal/10">
                  <Image
                    src="/images/vidhi/usha-arghya.jpg"
                    alt="Usha Arghya Day 4"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 chip chip-yellow text-[10px] font-bold">
                    Day 04
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-lg text-teal">Day 4: Usha Arghya & Parana (उषा अर्घ्य व पारण) — Welcoming the Dawn</h4>
                    <span className="text-xs text-teal/60 font-mono">Kartik Shukla Saptami</span>
                  </div>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Ritual:</strong> Arrive at the ghat before 4:00 AM (Brahma Muhurta). 
                    As the crimson rays of the rising sun illuminate the eastern sky, the vrati stands in the water 
                    and offers the second Arghya with the morning Soop.
                  </p>
                  <p className="text-xs sm:text-sm text-teal/80 leading-relaxed">
                    <strong>The Joyous Parana:</strong> The fast is broken with a sip of raw milk, fresh ginger with jaggery, 
                    and soaked gram (chana). Everyone at the ghat touches the vrati's feet for blessings and receives holy orange sindoor 
                    and blissful Thekua prasad. The Mahaparv concludes with tears of gratitude and joy!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Detailed Samagri Showcase with Individual Images */}
      <section id="samagri" className="band scroll-mt-20">
        <div className="shell space-y-8">
          <div>
            <span className="marker">Sacred Items Explained</span>
            <h2 className="section-title mt-2">
              Chhath Puja Samagri: Complete guide with individual images
            </h2>
            <p className="section-sub mt-2 max-w-3xl">
              Every single leaf, basket, fruit, and vessel used in Chhath carries profound spiritual, ecological, 
              and Ayurvedic science. Explore each sacred item below with authentic photographs, preparation instructions, 
              and beginner hacks.
            </p>
          </div>

          {/* Interactive Client Component */}
          <SamagriShowcase items={samagriItems} />
        </div>
      </section>

      {/* SECTION 4: Apartment & Global Diaspora Hacks */}
      <section id="diaspora-hacks" className="band bg-teal text-cream scroll-mt-20">
        <div className="shell space-y-8">
          <div>
            <span className="marker marker--on-dark">Modern & Diaspora Solutions</span>
            <h2 className="headline headline--on-dark text-3xl sm:text-4xl md:text-5xl mt-3">
              Living in an apartment or abroad? Here is how to do Chhath!
            </h2>
            <p className="text-cream/80 max-w-2xl mt-2 text-sm sm:text-base">
              You don't need a village riverbank to connect with Surya Dev. 
              Thousands of families in London, Toronto, Chicago, Dubai, and Bangalore celebrate 
              authentically using these shastra-approved modern adaptations:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="card bg-teal/40 border-cream/20 text-cream">
              <span className="text-3xl block mb-2">🏊‍♂️</span>
              <h3 className="font-bold text-mustard text-base">Inflatable Pool / Tub</h3>
              <p className="text-xs text-cream/70 mt-2 leading-relaxed">
                Set up a clean inflatable pool or large water tub on your balcony, terrace, or backyard. 
                Fill it with clean water, add a few drops of Gangajal, and stand inside to offer Arghya facing the open sky.
              </p>
            </div>

            <div className="card bg-teal/40 border-cream/20 text-cream">
              <span className="text-3xl block mb-2">🧭</span>
              <h3 className="font-bold text-mustard text-base">The Sun Compass</h3>
              <p className="text-xs text-cream/70 mt-2 leading-relaxed">
                Can't see the horizon because of tall high-rise buildings? 
                Use our built-in <strong>Arghya Finder compass</strong> on the home page to find the exact astronomical degree 
                and angle of sunrise/sunset in your city.
              </p>
            </div>

            <div className="card bg-teal/40 border-cream/20 text-cream">
              <span className="text-3xl block mb-2">🍳</span>
              <h3 className="font-bold text-mustard text-base">Electric Induction Stove</h3>
              <p className="text-xs text-cream/70 mt-2 leading-relaxed">
                Smoke detectors won't allow a wood fire? Clean a new induction cooktop or dedicate a spotless electric stove 
                strictly for puja prasad. Cleanliness of intent (Shuddhata) takes precedence over smoke.
              </p>
            </div>

            <div className="card bg-teal/40 border-cream/20 text-cream">
              <span className="text-3xl block mb-2">🧺</span>
              <h3 className="font-bold text-mustard text-base">Brass Soop (पीतल का सूप)</h3>
              <p className="text-xs text-cream/70 mt-2 leading-relaxed">
                No fresh Indian bamboo available in your country? Pure brass (Pital) or copper winnowing trays 
                are traditional, sustainable, reusable, and fully sanctioned in the Vedic texts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Open-Source, Code, and Contribution */}
      <section id="contribute" className="band scroll-mt-20">
        <div className="shell space-y-8">
          <div>
            <span className="marker">Community Owned</span>
            <h2 className="section-title mt-2">
              How you can contribute to ChhathMahaparv
            </h2>
            <p className="section-sub mt-2 max-w-2xl">
              This website is written in Next.js 14, TypeScript, and Tailwind CSS. 
              All data files are plain JSON, so you don't even need to write code to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-white hover:shadow-md transition">
              <span className="text-3xl block mb-2">🗺️</span>
              <h3 className="font-bold text-teal text-lg">1. Pin Your Local Ghat</h3>
              <p className="text-xs text-teal/70 mt-2 leading-relaxed">
                Know a ghat in your town, whether on the Hooghly in Kolkata, Yamuna in Delhi, Thames in London, 
                or Raritan in New Jersey? Submit it to help fellow devotees find where to gather.
              </p>
              <Link href={`/${params.locale}/ghats`} className="btn btn-primary text-xs mt-4 inline-flex !py-2">
                Add a Ghat →
              </Link>
            </div>

            <div className="card bg-white hover:shadow-md transition">
              <span className="text-3xl block mb-2">📸</span>
              <h3 className="font-bold text-teal text-lg">2. Share on Global Wall</h3>
              <p className="text-xs text-teal/70 mt-2 leading-relaxed">
                Upload your family's festive Chhath moments, kosi arrangements, or morning arghya memories 
                to showcase the diaspora's vibrant devotion to the world.
              </p>
              <Link href={`/${params.locale}/wall`} className="btn btn-ghost text-xs mt-4 inline-flex !py-2">
                Visit Global Wall →
              </Link>
            </div>

            <div className="card bg-white hover:shadow-md transition">
              <span className="text-3xl block mb-2">💻</span>
              <h3 className="font-bold text-teal text-lg">3. Code & Translations</h3>
              <p className="text-xs text-teal/70 mt-2 leading-relaxed">
                Translate lines in <code>messages/*.json</code>, add missing regional folk songs in <code>data/songs.json</code>, 
                or fix bugs on our open GitHub repository.
              </p>
              <a 
                href="https://github.com/fossism/chhathpooja-global" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-ghost text-xs mt-4 inline-flex !py-2 !border-teal/40"
              >
                GitHub Repository ↗
              </a>
            </div>
          </div>

          {/* Palette Card */}
          <div className="card bg-cream border-line/80 mt-6">
            <h3 className="font-bold text-teal text-sm">Visual Brand Palette</h3>
            <p className="text-xs text-teal/70 mt-1">Inspired by the sacred river, morning sunlight, and pure rice prasad.</p>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {[
                ["Teal", "#16564F", "bg-[#16564F] text-cream"],
                ["Mustard", "#E8B84B", "bg-[#E8B84B] text-teal"],
                ["Cream", "#FFF8F3", "bg-[#FFF8F3] text-teal border border-line"]
              ].map(([n, h, c]) => (
                <div key={h} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${c}`}>
                  <span className="w-3 h-3 rounded-full border border-black/20 inline-block" style={{ backgroundColor: h }} />
                  <span>{n}</span>
                  <span className="font-mono text-[10px] opacity-80">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
