"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import samagriData from "../../../../data/samagri.json";

interface VidhiDay {
  id: "nahayKhay" | "kharna" | "sandhyaArghya" | "ushaArghya";
  dayNum: string;
  title: string;
  hindiTitle: string;
  tithi: string;
  tagline: string;
  image: string;
  alt: string;
  overview: string;
  steps: string[];
  essentialSamagri: string[];
  ritualTip: string;
}

const VIDHI_DAYS: VidhiDay[] = [
  {
    id: "nahayKhay",
    dayNum: "Day 01",
    title: "Nahay-Khay",
    hindiTitle: "नहाय-खाय",
    tithi: "Kartik Shukla Chaturthi",
    tagline: "Purification, Holy Bath & The First Satvik Meal",
    image: "/images/vidhi/nahay-khay.jpg",
    alt: "Nahay-Khay holy bath, clean earthen courtyard and satvik kaddu-bhat meal in brass thali",
    overview:
      "The Mahaparv begins with total purity of mind, body, and home. The vrati takes a holy dip in the river, cleans the entire home, and cooks the satvik meal of Kaddu-Bhat (pumpkin curry and arwa rice) on a clean stove. This is the only meal eaten today.",
    steps: [
      "Deep clean the entire home and wash all bed linens and clothes",
      "Take a sacred holy bath (preferably at a river, or mix Gangajal at home)",
      "Wear pristine, washed traditional cotton clothes",
      "Cook pure Kaddu-Bhat (bottle gourd with chana dal & rice) with sendha namak in brass/bronze",
      "Offer the meal first to Surya Dev and Agni Dev with folded hands",
      "Vrati partakes of the single satvik meal of the day",
      "Serve family and rest early to prepare the mind for the fast ahead"
    ],
    essentialSamagri: [
      "Kaddu (Bottle Gourd)",
      "Arwa Rice",
      "Chana Dal",
      "Sendha Namak (Rock Salt)",
      "Pure Cow Ghee",
      "Gangajal",
      "Brass / Bronze Utensils"
    ],
    ritualTip:
      "Cook exclusively with sendha namak (rock salt) and pure cow ghee. No onion, garlic, or refined table salt is used throughout the 4 days."
  },
  {
    id: "kharna",
    dayNum: "Day 02",
    title: "Kharna (Lohanda)",
    hindiTitle: "खरना • लोहंडा",
    tithi: "Kartik Shukla Panchami",
    tagline: "Strict Waterless Fast & Sacred Sweet Rasiya Prasad",
    image: "/images/vidhi/kharna.jpg",
    alt: "Kharna clay stove with mango wood, jaggery kheer in brass pot and rotis on banana leaf",
    overview:
      "The vrati observes a complete waterless (nirjala) fast throughout the day. At twilight, sacred Gur ki Rasiya (jaggery kheer) and ghee rotis are cooked on a traditional clay stove (chulha) using sacred mango wood. After offering to Chhathi Maiya, the vrati eats in solitude, initiating the 36-hour fast.",
    steps: [
      "Observe a strict waterless (nirjala) fast from sunrise through sunset",
      "Set up the earthen stove (chulha) using pure clay and dry mango wood (aam ki lakdi)",
      "Cook Gur ki Rasiya (jaggery kheer) and whole-wheat rotis smeared with pure cow ghee",
      "Arrange the offerings respectfully on fresh green banana leaves",
      "Light clay diyas and incense; offer quiet prayers to Surya Dev and Chhathi Maiya",
      "Vrati eats the blessed prasad in complete silence (Shanti-bhojan)",
      "Once the meal concludes, the 36-hour unbroken waterless fast officially begins",
      "Distribute the holy Kharna prasad to all family members and visitors"
    ],
    essentialSamagri: [
      "Mitti ka Chulha (Clay stove)",
      "Aam ki Lakdi (Mango wood)",
      "Gur (Sugarcane Jaggery)",
      "Pure Cow Milk",
      "Arwa Rice",
      "Banana Leaves",
      "Clay Diyas & Camphor"
    ],
    ritualTip:
      "The vrati eats in complete silence. If any loud sound occurs during the meal, eating stops immediately. Once finished, no water or food is taken until Day 4."
  },
  {
    id: "sandhyaArghya",
    dayNum: "Day 03",
    title: "Sandhya Arghya",
    hindiTitle: "संध्या अर्घ्य",
    tithi: "Kartik Shukla Shashthi",
    tagline: "Reverence to the Setting Sun at the Sacred Ghat",
    image: "/images/vidhi/sandhya-arghya.jpg",
    alt: "Sandhya Arghya river ghat sunset, vrati standing in water holding bamboo soop",
    overview:
      "The most iconic celebration of Chhath. Families make sacred Thekua and Kasar prasad at home, then walk together singing folk songs towards the river ghat. At golden hour, the vrati stands waist-deep in the water holding the bamboo Soop, and arghya is offered to the setting Surya Dev with raw milk and Gangajal.",
    steps: [
      "Prepare sacred Thekua, Kasar, and rice laddoos with pure cow ghee and whole wheat",
      "Pack the bamboo Soop and Daura with fruits, coconuts, sprouted ginger, and sugarcane",
      "Walk in family procession to the ghat carrying the Daura basket on the head",
      "Reach the river or pond ghat at least 1 hour before scheduled sunset",
      "Vrati steps waist-deep into the flowing sacred water facing west",
      "Light the clay lamp (diya) placed inside the bamboo soop",
      "Offer Sandhya Arghya with raw milk and holy water to the setting sun",
      "Return home or arrange Kosi Bharai (earthen canopy vigil) with traditional songs"
    ],
    essentialSamagri: [
      "Bamboo Soop & Daura",
      "Thekua & Kasar Prasad",
      "Coconuts with Husk",
      "Sugarcane Stalks (Ganna)",
      "Clay Diyas & Wicks",
      "Raw Cow Milk & Gangajal",
      "Alpana / Yellow Sindoor"
    ],
    ritualTip:
      "Face west towards the setting sun. Family members gently pour raw milk and water as arghya while the vrati holds the decorated bamboo soop."
  },
  {
    id: "ushaArghya",
    dayNum: "Day 04",
    title: "Usha Arghya & Parana",
    hindiTitle: "उषा अर्घ्य एवं पारण",
    tithi: "Kartik Shukla Saptami",
    tagline: "Welcoming the Radiant Rising Sun & Fast Completion",
    image: "/images/vidhi/usha-arghya.jpg",
    alt: "Usha Arghya dawn river ghat, vrati offering morning arghya to rising sun",
    overview:
      "Before dawn, the ghat fills with the glow of thousands of earthen diyas. As the golden rays of the morning sun touch the waters, the final Arghya is offered. The 36-hour nirjala fast is completed with Parana (breaking fast with Gangajal, raw ginger, and prasad), followed by taking blessings from the vrati and sharing prasad.",
    steps: [
      "Arrive at the river ghat in the predawn hours before sunrise",
      "Arrange the bamboo soops and light rows of clay diyas along the water bank",
      "Vrati enters the water before the first rays of dawn appear in the sky",
      "Offer Usha Arghya with raw milk and Gangajal as the sun crests the horizon",
      "Perform pradakshina (five rotations in water) offering prayers for family health",
      "Family members touch the vrati's feet for blessings and yellow vermilion",
      "Perform Parana: Vrati sips Gangajal and eats a bite of raw ginger with gur",
      "Share Thekua and Mahaprasad with all devotees and neighbors on the ghat"
    ],
    essentialSamagri: [
      "Fresh Bamboo Soop",
      "Brass Lota with Raw Milk",
      "Gangajal",
      "Raw Ginger & Jaggery (for Parana)",
      "Mati ka Diya & Camphor",
      "Sindoor (Vermilion)",
      "Thekua Mahaprasad for All"
    ],
    ritualTip:
      "Face east towards the rising sun. Arghya is offered at the exact moment the disc of the sun appears over the horizon."
  }
];

const STORE_KEY = "chhath-vidhi-done-v1";

function loadDone(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const j = JSON.parse(raw);
    return typeof j === "object" && j !== null ? j : {};
  } catch {
    return {};
  }
}

export default function Vidhi() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showSamagriDrawer, setShowSamagriDrawer] = useState<boolean>(false);

  useEffect(() => {
    setDone(loadDone());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(done));
    } catch {
      // Storage unavailable in private browsing; continues in memory
    }
  }, [done]);

  const toggle = (k: string) => {
    setDone((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const toggleAllForDay = (day: VidhiDay) => {
    const allKeys = day.steps.map((_, i) => `${day.id}-${i}`);
    const allDone = allKeys.every((k) => !!done[k]);
    setDone((prev) => {
      const next = { ...prev };
      allKeys.forEach((k) => {
        next[k] = !allDone;
      });
      return next;
    });
  };

  const totalSteps = useMemo(() => VIDHI_DAYS.flatMap((v) => v.steps).length, []);
  const doneCount = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const progressPercent = Math.round((doneCount / totalSteps) * 100);

  const filteredDays = useMemo(() => {
    if (activeTab === "all") return VIDHI_DAYS;
    return VIDHI_DAYS.filter((d) => d.id === activeTab);
  }, [activeTab]);

  return (
    <div className="shell py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="marker">Sacred Ritual Guide</span>
            <h1 className="section-title mt-2">
              The 4-Day <em>Vidhi</em> Guide
            </h1>
            <p className="section-sub text-base max-w-2xl mt-1">
              Complete visual walkthrough and checklist for Nahay-Khay, Kharna, Sandhya Arghya, and Usha Arghya.
              Your progress is saved offline on this device.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSamagriDrawer((prev) => !prev)}
              className="btn btn-ghost text-xs !py-2 !px-4"
            >
              {showSamagriDrawer ? "Hide Master Samagri" : "View Master Samagri"}
            </button>
            {doneCount > 0 && (
              <button
                className="btn btn-ghost text-xs !py-2 !px-3 text-red-700 border-red-300 hover:bg-red-50"
                onClick={() => setDone({})}
                title="Clear all checked steps"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Progress Card */}
        <div className="card mt-6 !p-4 bg-white/90 backdrop-blur shadow-soft border-line">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-teal">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
              <span>Overall Ritual Progress</span>
            </div>
            <span>
              {doneCount} of {totalSteps} steps completed ({progressPercent}%)
            </span>
          </div>
          <div className="mt-2.5 h-3 rounded-full bg-line overflow-hidden p-0.5">
            <div
              className="h-full bg-teal rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              activeTab === "all"
                ? "bg-teal text-cream shadow-sm"
                : "bg-white text-teal/70 hover:text-teal border border-line"
            }`}
          >
            All 4 Days
          </button>
          {VIDHI_DAYS.map((d) => {
            const dayDone = d.steps.filter((_, i) => !!done[`${d.id}-${i}`]).length;
            const isCompleted = dayDone === d.steps.length;
            return (
              <button
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  activeTab === d.id
                    ? "bg-teal text-cream shadow-sm"
                    : "bg-white text-teal/70 hover:text-teal border border-line"
                }`}
              >
                <span>{d.title}</span>
                {isCompleted ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <span className="text-teal/40 font-normal">
                    ({dayDone}/{d.steps.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Master Samagri View */}
      {showSamagriDrawer && (
        <div className="card mb-10 border-mustard/40 bg-mustard/10 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-teal">Master Samagri List (Day-by-Day Packing)</h2>
            <button
              onClick={() => setShowSamagriDrawer(false)}
              className="text-xs text-teal/60 hover:text-teal font-semibold"
            >
              Close ✕
            </button>
          </div>
          <p className="text-xs text-teal/70 mt-1">
            Check that you have gathered all traditional ritual elements before heading to the ghat.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {Object.entries(samagriData as Record<string, string[]>).map(([k, v]) => {
              const matchedDay = VIDHI_DAYS.find((d) => d.id === k);
              return (
                <div key={k} className="rounded-xl border border-line bg-white p-3.5 shadow-sm">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/60">
                    <p className="font-bold text-xs uppercase tracking-wider text-teal">
                      {matchedDay ? matchedDay.title : k}
                    </p>
                    <span className="text-[10px] chip !py-0.5 !px-2 bg-cream text-teal/70">
                      {v.length} items
                    </span>
                  </div>
                  <ul className="text-xs text-teal/80 space-y-1.5">
                    {v.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="text-mustard font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vidhi Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {filteredDays.map((v) => {
          const completedCount = v.steps.filter((_, i) => !!done[`${v.id}-${i}`]).length;
          const isAllDone = completedCount === v.steps.length;

          return (
            <div
              key={v.id}
              className="num-card !p-0 overflow-hidden flex flex-col border-line shadow-card hover:shadow-lg transition-shadow duration-300"
            >
              {/* Card Image Area */}
              <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-teal/10 group">
                <Image
                  src={v.image}
                  alt={v.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={v.id === "nahayKhay"}
                />
                {/* Visual Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="chip chip-yellow text-xs font-bold uppercase tracking-wider shadow">
                      {v.dayNum}
                    </span>
                    <span className="chip bg-black/50 text-cream backdrop-blur-sm border-white/20 text-[11px]">
                      {v.tithi}
                    </span>
                  </div>
                  <div>
                    {isAllDone ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow">
                        ✓ All Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-cream backdrop-blur-sm border border-white/20 shadow">
                        {completedCount}/{v.steps.length} done
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-3.5 inset-x-3.5 text-white pointer-events-none">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                      {v.title}
                    </h2>
                    <span className="text-base text-mustard font-medium drop-shadow-sm">
                      {v.hindiTitle}
                    </span>
                  </div>
                  <p className="text-xs text-cream/90 font-medium drop-shadow-sm mt-0.5 line-clamp-1">
                    {v.tagline}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 bg-white space-y-5 flex-1 flex flex-col justify-between">
                {/* Overview */}
                <div>
                  <p className="text-sm text-teal/80 leading-relaxed font-normal">
                    {v.overview}
                  </p>
                </div>

                {/* Checklist Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-line">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal">
                      Ritual Checklist ({completedCount}/{v.steps.length})
                    </span>
                    <button
                      onClick={() => toggleAllForDay(v)}
                      className="text-xs font-bold text-teal hover:text-mustard transition underline underline-offset-2"
                    >
                      {isAllDone ? "Uncheck all" : "Mark day complete"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {v.steps.map((step, idx) => {
                      const key = `${v.id}-${idx}`;
                      const isChecked = !!done[key];

                      return (
                        <label
                          key={key}
                          className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition select-none ${
                            isChecked
                              ? "bg-teal/[0.04] border-teal/30 text-teal/60"
                              : "bg-cream/40 border-line hover:bg-cream hover:border-teal/40 text-teal"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(key)}
                            className="w-4 h-4 mt-0.5 accent-teal rounded cursor-pointer shrink-0"
                          />
                          <span
                            className={`text-sm leading-snug ${
                              isChecked ? "line-through text-teal/50" : "font-medium"
                            }`}
                          >
                            {step}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Day Essential Samagri */}
                <div className="pt-3 border-t border-line/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal/70 block mb-2">
                    Essential Items for {v.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {v.essentialSamagri.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center text-xs bg-cream border border-line rounded-md px-2.5 py-1 text-teal/80 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Elder's Tip Callout */}
                <div className="rounded-xl bg-mustard/15 border border-mustard/35 p-3.5 flex items-start gap-3 text-xs text-teal">
                  <span className="text-base leading-none">☀️</span>
                  <div>
                    <span className="font-bold block uppercase text-[10px] tracking-wider text-teal/80 mb-0.5">
                      Elder's Niyam & Advice
                    </span>
                    <p className="leading-relaxed text-teal/90">{v.ritualTip}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
