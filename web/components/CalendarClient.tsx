"use client";

import { useState } from "react";
import type { ChhathDates } from "../lib/chhath";
import Countdown from "./Countdown";
import IcsButton from "./IcsButton";

interface CalendarClientProps {
  events: ChhathDates[];
  locale?: string;
}

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateShort(iso: string): string {
  try {
    const dt = parseDate(iso);
    return dt.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  } catch {
    return iso;
  }
}

function formatDateFull(iso: string): string {
  try {
    const dt = parseDate(iso);
    return dt.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}

export default function CalendarClient({ events, locale = "en" }: CalendarClientProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const now = new Date();
  const currentYear = now.getFullYear();

  // Find the active or next upcoming festival for the current year
  const currentYearEvents = events.filter((e) => e.year === currentYear);

  // Pick the spotlight event: prefer the upcoming/current one, or main Kartik, or first
  const spotlightEvent =
    currentYearEvents.find((e) => parseDate(e.ushaArghya + "T23:59:59") >= now) ||
    currentYearEvents.find((e) => e.type.toLowerCase() === "kartik") ||
    currentYearEvents[0] ||
    events[0];

  // Secondary events in the same current year (e.g., Chaiti Chhath earlier in the year)
  const secondaryCurrentEvents = currentYearEvents.filter((e) => e !== spotlightEvent);

  // All events that belong to other years
  const otherYearEvents = events.filter((e) => e.year !== currentYear);

  // Filter other year events
  const filteredOtherYears = otherYearEvents.filter((e) => {
    if (filter === "upcoming") return e.year > currentYear;
    if (filter === "past") return e.year < currentYear;
    return true;
  });

  const fourDays = spotlightEvent
    ? [
        {
          num: "01",
          name: "Nahay-Khay",
          hindi: "नहाय-खाय",
          iso: spotlightEvent.nahayKhay,
          ritual: "Holy bath & Kaddu-Bhat prasad",
          desc: "Vratis take a sacred dip in the river, cleanse home, and partake in pure sattvik Lauki-Bhaat.",
          icon: "🌊",
          isPeak: false
        },
        {
          num: "02",
          name: "Kharna",
          hindi: "खरना (लोहंडा)",
          iso: spotlightEvent.kharna,
          ritual: "Day nirjala fast & Gur-Kheer prasad",
          desc: "A day-long waterless fast. In the quiet of dusk, sacred sugarcane kheer (rasiyaav) and rotis are offered.",
          icon: "🪔",
          isPeak: false
        },
        {
          num: "03",
          name: "Sandhya Arghya",
          hindi: "संध्या अर्घ्य (पहिला अर्घ्य)",
          iso: spotlightEvent.sandhyaArghya,
          ritual: "Sunset offering to Astaachalgami Surya",
          desc: "Devotees stand waist-deep in holy waters holding bamboo soop laden with thekua, fruits & daura.",
          icon: "🌅",
          isPeak: true
        },
        {
          num: "04",
          name: "Usha Arghya & Parana",
          hindi: "उषा अर्घ्य एवं पारण",
          iso: spotlightEvent.ushaArghya,
          ritual: "Dawn offering to Udayachalgami Surya",
          desc: "Final morning arghya at sunrise, seeking blessings of Chhathi Maiya, followed by breaking the 36hr fast.",
          icon: "☀️",
          isPeak: false
        }
      ]
    : [];

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-teal/70 mb-2">
            <span className="w-2 h-2 rounded-full bg-mustard"></span>
            DrikPanchang Verified • 2025–2030
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-teal">
            Chhath Mahaparv Calendar
          </h1>
          <p className="text-sm md:text-base text-teal/70 mt-1 max-w-2xl">
            Accurate dates for Kartik and Chaiti Chhath. The active festival cycle of the current year is spotlighted below with live timing and vidhi steps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IcsButton events={events} label="Download All Years (.ics)" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STANDALONE HERO SHOWCASE: CURRENT YEAR CHHATH (UNIQUE & COOL THEME)       */}
      {/* ========================================================================= */}
      {spotlightEvent && (
        <section aria-label="Current Year Festival Showcase" className="relative">
          {/* Section Marker */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mustard/20 border border-mustard/40 text-teal text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mustard"></span>
              </span>
              Current Year Spotlight
            </span>
            <span className="text-xs text-teal/60 font-mono hidden sm:inline">
              Happening / Scheduled for {currentYear}
            </span>
          </div>

          {/* Standalone Card with Divine Twilight & Gold Gradient */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-mustard/70 bg-gradient-to-br from-[#072421] via-[#103f39] to-[#1c5a52] text-cream p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(22,86,79,0.35)]">
            {/* Ambient Background Glowing Orbs */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-mustard/20 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Radiant Decorative Sun Rays Pattern (SVG) */}
            <svg
              className="absolute right-0 top-0 w-96 h-96 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="40" stroke="#E8B84B" strokeWidth="2" />
              <circle cx="100" cy="100" r="65" stroke="#E8B84B" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="90" stroke="#E8B84B" strokeWidth="1" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="100"
                  y1="10"
                  x2="100"
                  y2="30"
                  stroke="#E8B84B"
                  strokeWidth="2"
                  transform={`rotate(${deg} 100 100)`}
                />
              ))}
            </svg>

            {/* Top Row: Year Banner & Source */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mustard text-[#0b2925] text-xs font-black uppercase tracking-wider shadow-sm">
                  ★ {spotlightEvent.year} • {spotlightEvent.type.toUpperCase()} CHHATH
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-mustard/30 text-cream/90 text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-mustard"></span>
                  Active Sacred Cycle
                </span>
              </div>
              <span className="text-xs text-mustard/80 font-mono tracking-wide">
                Source: {spotlightEvent.source}
              </span>
            </div>

            {/* Main Headline & Date Range */}
            <div className="relative z-10 mt-6 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Chhath Mahaparv{" "}
                  <span className="text-mustard font-serif italic font-normal">
                    {spotlightEvent.year}
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-cream/90 font-medium mt-2">
                  {formatDateShort(spotlightEvent.nahayKhay)} – {formatDateShort(spotlightEvent.ushaArghya)}, {spotlightEvent.year}
                </p>
                <p className="text-xs sm:text-sm text-cream/70 mt-2 max-w-xl leading-relaxed">
                  The supreme festival of solar gratitude, austere fasting, and community harmony. Devotees honor both the setting and rising sun at river ghats worldwide.
                </p>

                {/* Quick Navigation Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <IcsButton
                    events={[spotlightEvent]}
                    label={`Add ${spotlightEvent.year} ${spotlightEvent.type} (.ics)`}
                  />
                  <a
                    href={`/${locale}/vidhi`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-mustard px-4 py-2 text-xs font-bold text-teal hover:brightness-105 transition shadow-md"
                  >
                    📖 4-Day Vidhi Guide
                  </a>
                  <a
                    href={`/${locale}#arghya`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-mustard/40 px-4 py-2 text-xs font-bold text-cream hover:bg-black/60 transition"
                  >
                    🌅 City Arghya Times
                  </a>
                  <a
                    href={`/${locale}/ghats`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-mustard/40 px-4 py-2 text-xs font-bold text-cream hover:bg-black/60 transition"
                  >
                    📍 Ghat Finder
                  </a>
                </div>
              </div>

              {/* Live Festival Countdown Widget */}
              <div className="lg:col-span-5 bg-black/35 backdrop-blur-md rounded-2xl border border-mustard/40 p-5 sm:p-6 shadow-xl">
                <Countdown
                  target={spotlightEvent.sandhyaArghya}
                  label={`Sandhya Arghya Countdown`}
                  variant="hero"
                />
              </div>
            </div>

            {/* Standalone Visual Progression: The 4 Sacred Days */}
            <div className="relative z-10 mt-8 pt-8 border-t border-cream/15">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-mustard font-bold flex items-center gap-2">
                  <span>✦</span> The 4 Sacred Days of {spotlightEvent.year}
                </h3>
                <span className="text-[11px] text-cream/60 font-mono">
                  All 4 days required for Vrata
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {fourDays.map((day) => (
                  <div
                    key={day.num}
                    className={`relative rounded-xl p-4 transition-all duration-300 flex flex-col justify-between ${
                      day.isPeak
                        ? "bg-gradient-to-b from-[#e8b84b] to-[#d8a436] text-[#0a2924] border-2 border-yellow-200 shadow-[0_8px_24px_rgba(232,184,75,0.35)] scale-[1.02]"
                        : "bg-black/35 backdrop-blur-sm border border-cream/15 hover:border-mustard/40 text-cream"
                    }`}
                  >
                    {day.isPeak && (
                      <span className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-[#0a2924] text-mustard text-[10px] font-extrabold uppercase tracking-wider shadow">
                        ★ Sunset Arghya
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            day.isPeak ? "bg-[#0a2924]/15 text-[#0a2924]" : "bg-white/10 text-mustard"
                          }`}
                        >
                          Day {day.num}
                        </span>
                        <span className="text-xl" role="img" aria-hidden="true">
                          {day.icon}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p
                          className={`text-sm font-black tracking-tight ${
                            day.isPeak ? "text-[#0a2924]" : "text-white"
                          }`}
                        >
                          {day.name}
                        </p>
                        <p
                          className={`text-xs font-medium mt-0.5 ${
                            day.isPeak ? "text-[#0a2924]/80" : "text-cream/70"
                          }`}
                        >
                          {day.hindi}
                        </p>
                      </div>

                      <div
                        className={`mt-3 py-1.5 px-2.5 rounded-lg text-xs font-mono font-bold tracking-tight inline-block ${
                          day.isPeak ? "bg-[#0a2924] text-mustard" : "bg-mustard/20 text-mustard border border-mustard/30"
                        }`}
                      >
                        {formatDateFull(day.iso)}
                      </div>

                      <p
                        className={`text-xs mt-3 leading-relaxed ${
                          day.isPeak ? "text-[#0a2924]/90 font-medium" : "text-cream/70"
                        }`}
                      >
                        {day.desc}
                      </p>
                    </div>

                    <div
                      className={`mt-4 pt-3 border-t text-[11px] font-semibold flex items-center justify-between ${
                        day.isPeak ? "border-[#0a2924]/20 text-[#0a2924]" : "border-white/10 text-cream/60"
                      }`}
                    >
                      <span>{day.ritual}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Event Notice in the Same Year (e.g., Chaiti Chhath in March) */}
            {secondaryCurrentEvents.length > 0 && (
              <div className="relative z-10 mt-6 pt-6 border-t border-cream/15">
                <p className="text-xs font-mono uppercase tracking-wider text-mustard/90 mb-3">
                  Also Observed in {currentYear}:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {secondaryCurrentEvents.map((sec) => (
                    <div
                      key={`${sec.year}-${sec.type}`}
                      className="rounded-xl border border-mustard/30 bg-black/40 backdrop-blur-sm p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase">
                            {sec.type} Chhath {sec.year}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-cream/15 text-cream text-[10px]">
                            Spring Cycle
                          </span>
                        </div>
                        <p className="text-cream/70 mt-1">
                          {formatDateShort(sec.nahayKhay)} – {formatDateShort(sec.ushaArghya)} • Sandhya: {sec.sandhyaArghya}
                        </p>
                      </div>
                      <IcsButton events={[sec]} label={`${sec.type} (.ics)`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* OTHER YEARS SECTION: MARKED DISTINCTLY AS ANOTHER YEAR                   */}
      {/* ========================================================================= */}
      <section aria-label="Other Calendar Years" className="space-y-6 pt-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-teal/60">
              <span>📅</span> Festival Archive & Forward Schedules
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-teal mt-1">
              All Other Years (2025, 2027–2030)
            </h2>
            <p className="text-xs sm:text-sm text-teal/70 mt-0.5">
              These dates mark other festival years. Pre-plan travel, leaves, and family gatherings at the ghat.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex rounded-lg border border-line bg-white p-1 text-xs font-semibold shadow-sm">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md transition ${
                filter === "all" ? "bg-teal text-cream" : "text-teal/70 hover:text-teal"
              }`}
            >
              All Other ({otherYearEvents.length})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-3 py-1.5 rounded-md transition ${
                filter === "upcoming" ? "bg-teal text-cream" : "text-teal/70 hover:text-teal"
              }`}
            >
              Upcoming (2027–30)
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-3 py-1.5 rounded-md transition ${
                filter === "past" ? "bg-teal text-cream" : "text-teal/70 hover:text-teal"
              }`}
            >
              Past (2025)
            </button>
          </div>
        </div>

        {/* Other Years Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {filteredOtherYears.map((d) => {
            const isFuture = d.year > currentYear;
            const yearsDiff = Math.abs(d.year - currentYear);
            const relativeLabel = isFuture
              ? yearsDiff === 1
                ? "Next Year"
                : `In ${yearsDiff} Years`
              : "Past Festival";

            return (
              <div
                key={`${d.year}-${d.type}`}
                className="group relative rounded-xl border border-line bg-white p-5 shadow-card hover:shadow-soft hover:border-teal/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Explicit Another Year Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isFuture
                            ? "bg-teal/10 text-teal border border-teal/20"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {isFuture ? `📅 Future Year • ${d.year}` : `📜 Past Year • ${d.year}`}
                      </span>
                      <span className="text-[11px] font-mono text-teal/70 capitalize font-medium">
                        {d.type} Chhath
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-teal/60 bg-cream px-2 py-0.5 rounded border border-line/60">
                      {relativeLabel}
                    </span>
                  </div>

                  {/* 4 Days Clean Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-lg border border-line/70 bg-cream/50 p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal/60">
                        1. Nahay-Khay
                      </p>
                      <p className="font-extrabold text-teal mt-0.5 text-xs">
                        {formatDateShort(d.nahayKhay)}
                      </p>
                      <p className="text-[10px] text-teal/50 font-mono mt-0.5">{d.nahayKhay}</p>
                    </div>

                    <div className="rounded-lg border border-line/70 bg-cream/50 p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal/60">
                        2. Kharna
                      </p>
                      <p className="font-extrabold text-teal mt-0.5 text-xs">
                        {formatDateShort(d.kharna)}
                      </p>
                      <p className="text-[10px] text-teal/50 font-mono mt-0.5">{d.kharna}</p>
                    </div>

                    <div className="rounded-lg border border-teal/30 bg-teal/5 p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal">
                        3. Sandhya Arghya
                      </p>
                      <p className="font-extrabold text-teal mt-0.5 text-xs">
                        {formatDateShort(d.sandhyaArghya)}
                      </p>
                      <p className="text-[10px] text-teal/70 font-mono mt-0.5">{d.sandhyaArghya}</p>
                    </div>

                    <div className="rounded-lg border border-line/70 bg-cream/50 p-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal/60">
                        4. Usha Arghya
                      </p>
                      <p className="font-extrabold text-teal mt-0.5 text-xs">
                        {formatDateShort(d.ushaArghya)}
                      </p>
                      <p className="text-[10px] text-teal/50 font-mono mt-0.5">{d.ushaArghya}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Source & ICS Download */}
                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-teal/60 truncate">
                    {d.source}
                  </span>
                  <IcsButton
                    events={[d]}
                    label={`${d.year} ${d.type} (.ics)`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
