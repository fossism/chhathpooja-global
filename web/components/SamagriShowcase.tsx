"use client";

import { useState } from "react";
import Image from "next/image";
import { SamagriItem } from "../lib/samagri";

export default function SamagriShowcase({ items }: { items: SamagriItem[] }) {
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<SamagriItem | null>(null);

  const days = ["All", "Nahay-Khay", "Kharna", "Sandhya Arghya", "Usha Arghya"];

  const filtered = selectedDay === "All"
    ? items
    : items.filter((item) => item.daysUsed.includes(selectedDay));

  return (
    <div className="space-y-6">
      {/* Day Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-teal/70 uppercase tracking-wider mr-1">
          Filter by Day:
        </span>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedDay === day
                ? "bg-teal text-cream shadow-sm scale-105"
                : "bg-cream text-teal/80 border border-line hover:border-teal/40"
            }`}
          >
            {day}
          </button>
        ))}
        <span className="text-xs text-teal/50 ml-auto font-mono">
          Showing {filtered.length} of {items.length} essentials
        </span>
      </div>

      {/* Grid of Samagri Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group card !p-0 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-line bg-white hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative w-full h-56 overflow-hidden bg-teal/10">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="chip chip-yellow text-[10px] font-bold shadow-sm">
                  {item.category}
                </span>
              </div>

              {/* Hindi & Bhojpuri Subtitle in Image */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <div className="text-sm font-bold leading-tight drop-shadow-sm">
                  {item.hindi}
                </div>
                <div className="text-[11px] text-white/80 italic">
                  {item.bhojpuri}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
              <div>
                <h3 className="font-bold text-base text-teal group-hover:text-mustard transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-teal/80 mt-1.5 leading-relaxed line-clamp-3">
                  {item.significance}
                </p>
              </div>

              {/* Days Used Tag Row */}
              <div className="pt-2 border-t border-line/60">
                <div className="text-[10px] uppercase font-bold text-teal/60 mb-1">
                  Required on:
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.daysUsed.map((d) => (
                    <span
                      key={d}
                      className="text-[10px] bg-cream px-2 py-0.5 rounded-md font-semibold text-teal border border-line"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diaspora / Beginner Hack Callout */}
              <div className="p-2.5 rounded-lg bg-mustard/10 border border-mustard/30 text-[11px] text-teal/90">
                <span className="font-bold text-teal block mb-0.5">
                  💡 Beginner / Diaspora Hack:
                </span>
                {item.beginnerHack}
              </div>

              {/* Expand Details Trigger */}
              <button
                onClick={() => setActiveItem(item)}
                className="btn btn-ghost !py-1.5 !px-3 text-xs w-full font-bold flex items-center justify-center gap-1.5 group-hover:bg-teal group-hover:text-cream transition-colors"
              >
                <span>Read Full Vidhi</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Detailed Drawer for Full Samagri Detail */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-line flex flex-col animate-scaleUp">
            {/* Modal Header Image */}
            <div className="relative w-full h-64 sm:h-72 bg-teal/20">
              <Image
                src={activeItem.image}
                alt={activeItem.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="chip chip-yellow text-xs font-bold mb-1.5 inline-block">
                  {activeItem.category}
                </span>
                <h3 className="text-2xl font-bold leading-tight">
                  {activeItem.name}
                </h3>
                <div className="text-sm text-mustard font-medium mt-0.5">
                  {activeItem.hindi} • {activeItem.bhojpuri}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-sm">
              <div>
                <h4 className="font-bold text-teal uppercase text-xs tracking-wider mb-1.5">
                  Spiritual & Eco-Cosmic Significance
                </h4>
                <p className="text-teal/80 leading-relaxed text-sm">
                  {activeItem.significance}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-teal uppercase text-xs tracking-wider mb-1.5">
                  How to Prepare & Use in the Puja
                </h4>
                <p className="text-teal/80 leading-relaxed text-sm bg-cream/70 p-3.5 rounded-xl border border-line">
                  {activeItem.howToUse}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-mustard/15 border border-mustard/40">
                <h4 className="font-bold text-teal flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                  <span>💡</span>
                  <span>Cool Hack for Beginners & Global Diaspora</span>
                </h4>
                <p className="text-teal/90 text-xs leading-relaxed">
                  {activeItem.beginnerHack}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-line">
                <div className="text-xs text-teal/60 font-medium">
                  Used on: {activeItem.daysUsed.join(", ")}
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="btn btn-primary !py-2 !px-5 text-xs font-bold"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
