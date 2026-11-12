"use client";

import { useState } from "react";
import Image from "next/image";
import { getSamagriCatalog, SamagriItem } from "../lib/samagri";

const CATEGORIES = [
  "All Items",
  "Ritual Vessels & Containers",
  "Fruits, Vegetables & Farm Produce",
  "Puja Essentials & Ritual Materials",
  "Prasad & Food Preparation Ingredients"
];

export default function SamagriWall() {
  const [items] = useState<SamagriItem[]>(getSamagriCatalog());
  const [selectedCat, setSelectedCat] = useState("All Items");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<SamagriItem | null>(null);

  const filtered = items.filter((item) => {
    const matchesCat = selectedCat === "All Items" || item.category === selectedCat;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.hindi.includes(q) ||
      item.bhojpuri.includes(q) ||
      item.significance.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <section aria-label="Chhath Puja Complete Samagri List" className="mt-8 mb-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <span className="marker">Complete Puja Checklist · सम्पूर्ण पूजन सामग्री</span>
          <h2 className="headline text-2xl sm:text-3xl md:text-4xl mt-1.5">
            Everything Required for <em>Chhath Mahaparv</em>
          </h2>
          <p className="text-xs sm:text-sm text-teal/70 mt-1 max-w-2xl">
            From the terracotta elephant (Mitti ka Hathi) and bamboo baskets to sacred fruits and Thekua ingredients — each item with authentic images and practical diaspora tips.
          </p>
        </div>

        {/* Quick Search */}
        <div className="w-full md:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search samagri (e.g. hathi, soop, thekua)..."
            className="input !text-xs !py-2"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const active = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0 transition ${
                active
                  ? "bg-mustard text-teal shadow-xs"
                  : "bg-white border border-line text-teal/70 hover:bg-cream hover:text-teal"
              }`}
            >
              {cat === "All Items"
                ? `🌟 All (${items.length})`
                : cat === "Ritual Vessels & Containers"
                ? "🏺 Vessels & Baskets"
                : cat === "Fruits, Vegetables & Farm Produce"
                ? "🌾 Farm Produce & Roots"
                : cat === "Puja Essentials & Ritual Materials"
                ? "🪔 Puja Essentials"
                : "🍯 Prasad & Ingredients"}
            </button>
          );
        })}
      </div>

      {/* Grid of Samagri Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="card !p-0 overflow-hidden bg-white border-line hover:border-mustard hover:shadow-lg transition cursor-pointer flex flex-col group"
          >
            {/* Image Box */}
            <div className="relative w-full h-48 bg-teal/10 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Category chip */}
              <span className="absolute top-2.5 left-2.5 chip chip-yellow text-[10px] font-bold shadow-xs">
                {item.category.split("&")[0].trim()}
              </span>

              {/* Hindi Title on image */}
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <p className="font-extrabold text-base leading-tight drop-shadow-sm">{item.hindi}</p>
                <p className="text-[11px] text-mustard font-mono truncate">{item.bhojpuri}</p>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col justify-between flex-1 space-y-2.5">
              <div>
                <h3 className="font-bold text-sm text-teal group-hover:text-amber-800 transition">
                  {item.name}
                </h3>
                <p className="text-xs text-teal/70 mt-1 line-clamp-2 leading-relaxed">
                  {item.significance}
                </p>
              </div>

              {/* Days Used Chips */}
              <div className="pt-2 border-t border-line/60 flex flex-wrap gap-1">
                {item.daysUsed.map((day) => (
                  <span key={day} className="text-[10px] px-2 py-0.5 rounded-full bg-cream border border-line text-teal/80 font-medium">
                    {day}
                  </span>
                ))}
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-teal group-hover:text-mustard">
                <span>View Full Details &amp; Hacks →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-12 bg-white mt-4">
          <p className="text-2xl mb-1">🧺</p>
          <p className="font-bold text-teal">No samagri found matching &ldquo;{search}&rdquo;</p>
          <p className="text-xs text-teal/60 mt-1">Try searching for soop, hathi, coconut, thekua, or nimbu.</p>
          <button onClick={() => { setSearch(""); setSelectedCat("All Items"); }} className="btn btn-ghost text-xs mt-3 !py-1.5 !px-3">
            Reset Filters
          </button>
        </div>
      )}

      {/* DETAILED MODAL POPUP FOR SELECTED SAMAGRI */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="card !p-0 max-w-xl w-full bg-white overflow-hidden shadow-2xl relative border-mustard/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative w-full h-64 sm:h-72 bg-teal/10">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                aria-label="Close modal"
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="chip chip-yellow text-[10px] font-bold mb-1.5 inline-block">
                  {selectedItem.category}
                </span>
                <h3 className="text-2xl font-extrabold leading-tight">{selectedItem.hindi}</h3>
                <p className="text-xs text-mustard font-medium mt-0.5">
                  {selectedItem.name} • {selectedItem.bhojpuri}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal/60 font-mono">
                  Sacred Significance
                </h4>
                <p className="text-xs sm:text-sm text-teal/85 mt-1 leading-relaxed">
                  {selectedItem.significance}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal/60 font-mono">
                  How To Use During Puja
                </h4>
                <p className="text-xs sm:text-sm text-teal/85 mt-1 leading-relaxed">
                  {selectedItem.howToUse}
                </p>
              </div>

              <div className="bg-mustard/15 border-l-4 border-mustard p-3.5 rounded-r-lg">
                <h4 className="text-xs font-bold text-teal uppercase tracking-wide flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Diaspora &amp; Apartment Hack</span>
                </h4>
                <p className="text-xs text-teal/90 mt-1 leading-relaxed">
                  {selectedItem.beginnerHack}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-teal/70">Days Used:</span>
                {selectedItem.daysUsed.map((day) => (
                  <span key={day} className="chip chip-yellow text-[10px] font-bold">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
