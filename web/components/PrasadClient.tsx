"use client";

import { useState, useEffect, useMemo } from "react";
import { PrasadListing, PrasadCategory, getInitialPrasadListings, generateWhatsAppLink } from "../lib/prasad";

const CATEGORIES: { id: PrasadCategory; label: string }[] = [
  { id: "all", label: "All Cities & Posts" },
  { id: "armed-forces", label: "Indian Army & Border Cantts" },
  { id: "students", label: "Student & Coaching Hubs" },
  { id: "industrial", label: "Industrial & Labour Belts" },
  { id: "metro-tech", label: "Metro & Tech Corridors" },
  { id: "bihar-jharkhand", label: "Bihar & Jharkhand" },
  { id: "diaspora", label: "Global Diaspora" }
];

const PRASAD_FILTER_TYPES = [
  "All Items",
  "Thekua",
  "Kasar",
  "Kharna",
  "Daura"
];

const LOCAL_STORAGE_KEY = "chhath_prasad_user_listings_v3";

export default function PrasadClient() {
  const [listings, setListings] = useState<PrasadListing[]>(getInitialPrasadListings());
  const [activeTab, setActiveTab] = useState<"all" | "offer" | "request">("all");
  const [selectedCategory, setSelectedCategory] = useState<PrasadCategory>("all");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedPrasad, setSelectedPrasad] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLandmarkListing, setSelectedLandmarkListing] = useState<PrasadListing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formType, setFormType] = useState<"offer" | "request">("offer");
  const [formHubName, setFormHubName] = useState("");
  const [formCategory, setFormCategory] = useState<PrasadCategory>("metro-tech");
  const [formCity, setFormCity] = useState("Bengaluru");
  const [customCity, setCustomCity] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formLandmark, setFormLandmark] = useState("");
  const [formTargetAudience, setFormTargetAudience] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>(["Traditional Thekua"]);
  const [formPickupMode, setFormPickupMode] = useState("Walk-in Seva Desk (No Phone Needed)");
  const [formQuantity, setFormQuantity] = useState("");
  const [formTiming, setFormTiming] = useState("Nov 15 (Sandhya Arghya) & Nov 16 (Usha Arghya)");
  const [formContactType, setFormContactType] = useState<"walkin" | "whatsapp">("walkin");
  const [formPhone, setFormPhone] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load user-created listings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const userPosts: PrasadListing[] = JSON.parse(stored);
        if (Array.isArray(userPosts) && userPosts.length > 0) {
          setListings((prev) => {
            const initialIds = new Set(prev.map((l) => l.id));
            const freshUserPosts = userPosts.filter((p) => !initialIds.has(p.id));
            return [...freshUserPosts, ...prev];
          });
        }
      }
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleItemToggle = (item: string) => {
    if (selectedItems.includes(item)) {
      if (selectedItems.length > 1) {
        setSelectedItems(selectedItems.filter((i) => i !== item));
      }
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const city = formCity === "Other" ? customCity.trim() : formCity;
    const hubName = formHubName.trim();
    const area = formArea.trim();
    const landmark = formLandmark.trim();

    if (!hubName) {
      setFormError("Please enter a name for this Prasad point or group.");
      return;
    }
    if (!city) {
      setFormError("Please select or enter the city.");
      return;
    }
    if (!area) {
      setFormError("Please specify the area or sector.");
      return;
    }
    if (!landmark) {
      setFormError("Please provide a public landmark for zero-contact pickup.");
      return;
    }
    if (!pledgeAccepted) {
      setFormError("You must accept the sacred Pavitrata pledge that Chhath Prasad is strictly free.");
      return;
    }

    const defaultAudience = formType === "offer"
      ? "Students, soldiers, workers & devotees away from home"
      : "Hostel students & devotees hoping to receive holy prasad";

    const newListing: PrasadListing = {
      id: `user-${Date.now()}`,
      type: formType,
      hubName,
      category: formCategory,
      city,
      area,
      landmark,
      targetAudience: formTargetAudience.trim() || defaultAudience,
      prasadItems: selectedItems,
      pickupMode: formPickupMode,
      quantityNote: formQuantity.trim(),
      availableFrom: formTiming.trim() || "Nov 15 Sandhya Arghya & Nov 16 Usha Arghya",
      contactType: formContactType,
      phone: formContactType === "whatsapp" ? formPhone.trim() : "",
      notes: formNotes.trim(),
      verified: true,
      createdAt: new Date().toISOString(),
      isUserCreated: true
    };

    const updated = [newListing, ...listings];
    setListings(updated);

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existingUserPosts: PrasadListing[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newListing, ...existingUserPosts]));
    } catch {}

    setIsModalOpen(false);
    showToast(formType === "offer" ? "Prasad Seva point registered." : "Prasad request registered.");

    // Reset Form
    setFormHubName("");
    setFormArea("");
    setFormLandmark("");
    setFormTargetAudience("");
    setFormQuantity("");
    setFormPhone("");
    setFormNotes("");
    setPledgeAccepted(false);
  };

  const handleDeleteListing = (id: string) => {
    const updated = listings.filter((l) => l.id !== id);
    setListings(updated);

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const existing: PrasadListing[] = JSON.parse(stored);
        const filtered = existing.filter((l) => l.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch {}

    showToast("Post removed.");
  };

  // Distinct cities for city dropdown
  const allCities = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => set.add(l.city));
    return ["All Cities", ...Array.from(set).sort()];
  }, [listings]);

  // Overall counts
  const typeCounts = useMemo(() => {
    let offers = 0;
    let requests = 0;
    listings.forEach((l) => {
      if (l.type === "offer") offers++;
      else requests++;
    });
    return { all: listings.length, offer: offers, request: requests };
  }, [listings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Giver vs Receiver Tab Filter
      if (activeTab !== "all" && l.type !== activeTab) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && l.category !== selectedCategory) {
        return false;
      }
      // City filter
      if (selectedCity !== "All Cities" && l.city !== selectedCity) {
        return false;
      }
      // Prasad item filter
      if (selectedPrasad !== "All Items") {
        const hasItem = l.prasadItems.some((item) =>
          item.toLowerCase().includes(selectedPrasad.toLowerCase())
        );
        if (!hasItem) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHub = l.hubName.toLowerCase().includes(q);
        const matchesCity = l.city.toLowerCase().includes(q);
        const matchesArea = l.area.toLowerCase().includes(q);
        const matchesLandmark = l.landmark.toLowerCase().includes(q);
        const matchesAudience = l.targetAudience.toLowerCase().includes(q);
        const matchesItems = l.prasadItems.some((i) => i.toLowerCase().includes(q));
        const matchesNotes = l.notes.toLowerCase().includes(q);

        if (!matchesHub && !matchesCity && !matchesArea && !matchesLandmark && !matchesAudience && !matchesItems && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [listings, activeTab, selectedCategory, selectedCity, selectedPrasad, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal text-cream px-5 py-3 rounded-xl shadow-2xl border border-mustard/40 flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <svg className="w-5 h-5 text-mustard shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner: Concise, Impactful with Italics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal via-[#134e47] to-teal p-6 sm:p-8 text-cream shadow-xl border border-teal/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-mustard/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mustard/20 border border-mustard/40 text-mustard text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-mustard animate-ping" />
            Zero-Contact • <em>Pure Seva</em>
          </div>

          <h1 className="font-extrabold text-2xl sm:text-4xl text-cream tracking-tight leading-tight">
            Prasad Seva &bull; <em>Mahaprasad</em> for Everyone
          </h1>

          <p className="text-cream/85 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Connecting fasting families with soldiers, students, and workers <em>far from home</em> — 100% free, zero contact, served with pure devotion.
          </p>

          {/* 3 Sleek Micro-Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
              <p className="font-bold text-mustard text-[11px]">Armed Forces</p>
              <p className="text-cream/80 text-[11px] mt-0.5 leading-snug"><em>Jawans on duty</em> in Leh, Siachen, Srinagar &amp; desert borders.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
              <p className="font-bold text-mustard text-[11px]">Students &amp; Workers</p>
              <p className="text-cream/80 text-[11px] mt-0.5 leading-snug"><em>Hostels &amp; shifts</em> in Kota, DU, Prayagraj &amp; Surat.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-lg border border-white/10">
              <p className="font-bold text-mustard text-[11px]">Zero-Contact Walk-in</p>
              <p className="text-cream/80 text-[11px] mt-0.5 leading-snug"><em>Public desks</em> at landmarks — no phone numbers needed.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setFormType("offer");
                setIsModalOpen(true);
              }}
              className="btn btn-accent text-xs !py-2.5 !px-5 font-bold shadow-md hover:scale-[1.02] transition"
            >
              List a Prasad Point
            </button>
            <button
              onClick={() => {
                setFormType("request");
                setIsModalOpen(true);
              }}
              className="btn btn-ghost !text-cream !border-cream/40 text-xs !py-2.5 !px-4 hover:bg-white/10 transition"
            >
              Request Prasad
            </button>
          </div>
        </div>
      </div>

      {/* Giver & Receiver Primary Segment Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="inline-flex p-1 rounded-xl bg-white border border-line shadow-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "all"
                ? "bg-teal text-cream shadow-xs"
                : "text-teal/70 hover:text-teal hover:bg-cream/50"
            }`}
          >
            <span>All Seva</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "all" ? "bg-white/20 text-cream" : "bg-cream text-teal/70"}`}>
              {typeCounts.all}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("offer")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "offer"
                ? "bg-amber-600 text-cream shadow-xs"
                : "text-teal/70 hover:text-teal hover:bg-cream/50"
            }`}
          >
            <span>Prasad Givers (सेवा)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "offer" ? "bg-white/20 text-cream" : "bg-amber-100 text-amber-900"}`}>
              {typeCounts.offer}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "request"
                ? "bg-teal text-cream shadow-xs"
                : "text-teal/70 hover:text-teal hover:bg-cream/50"
            }`}
          >
            <span>Prasad Receivers (आग्रह)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "request" ? "bg-white/20 text-cream" : "bg-teal/10 text-teal"}`}>
              {typeCounts.request}
            </span>
          </button>
        </div>

        <p className="text-xs text-teal/65 font-medium italic">
          Showing {filteredListings.length} active listings
        </p>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const isArmedForces = cat.id === "armed-forces";

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? isArmedForces
                      ? "bg-[#2d4a22] text-[#f7e07a] shadow-sm ring-2 ring-[#f7e07a]"
                      : "bg-teal text-cream shadow-sm"
                    : isArmedForces
                    ? "bg-[#2d4a22]/10 text-[#2d4a22] border border-[#2d4a22]/30 hover:bg-[#2d4a22]/20"
                    : "bg-white text-teal/80 border border-line hover:border-teal/40"
                }`}
              >
                {isArmedForces && (
                  <span className="w-2 h-2 rounded-full bg-[#f7e07a]" />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row: Search + City + Item */}
        <div className="card !p-3.5 bg-white border-line shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, garrison, college, or landmark (e.g. Leh, Kota, Siachen, Whitefield)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-line bg-cream/30 text-teal placeholder:text-teal/40 focus:outline-hidden focus:ring-2 focus:ring-teal/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-teal/40 hover:text-teal text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* City Dropdown */}
          <div className="shrink-0 flex items-center gap-2">
            <label className="text-xs font-semibold text-teal/70 whitespace-nowrap">
              City:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter by City"
              className="text-xs py-1.5 px-3 rounded-lg border border-line bg-cream/30 text-teal font-medium focus:outline-hidden focus:ring-2 focus:ring-teal/20 cursor-pointer"
            >
              {allCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Prasad Item Dropdown */}
          <div className="shrink-0 flex items-center gap-2">
            <label className="text-xs font-semibold text-teal/70 whitespace-nowrap">
              Item:
            </label>
            <select
              value={selectedPrasad}
              onChange={(e) => setSelectedPrasad(e.target.value)}
              aria-label="Filter by Prasad Item"
              className="text-xs py-1.5 px-3 rounded-lg border border-line bg-cream/30 text-teal font-medium focus:outline-hidden focus:ring-2 focus:ring-teal/20 cursor-pointer"
            >
              {PRASAD_FILTER_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="card !p-12 text-center bg-white border-dashed border-line space-y-4">
          <p className="text-base font-extrabold text-teal">
            No entries found matching this view.
          </p>
          <p className="text-xs text-teal/65 max-w-md mx-auto">
            Be the first to list an offering or post a request in this city.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary text-xs !py-2.5 !px-5 font-bold"
          >
            Post a Prasad Point / Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((listing) => {
            const isOffer = listing.type === "offer";
            const isArmedForces = listing.category === "armed-forces";
            const isStudents = listing.category === "students";
            const isIndustrial = listing.category === "industrial";

            let categoryLabel = "City Seva";
            if (isArmedForces) categoryLabel = "Armed Forces Post";
            else if (isStudents) categoryLabel = "Student & Hostel";
            else if (isIndustrial) categoryLabel = "Labour & Workers";
            else if (listing.category === "diaspora") categoryLabel = "Global Diaspora";

            return (
              <div
                key={listing.id}
                className={`card !p-5 bg-white border-line flex flex-col justify-between hover:shadow-md transition relative ${
                  isArmedForces ? "border-l-4 border-l-[#2d4a22]" : ""
                } ${listing.isUserCreated ? "ring-2 ring-mustard/60" : ""}`}
              >
                <div className="space-y-3">
                  {/* Card Header & Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                          isOffer
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-teal/10 text-teal border border-teal/20"
                        }`}
                      >
                        {isOffer ? "Offering Prasad (सेवा)" : "Seeking Prasad (आग्रह)"}
                      </span>
                      <span className="text-[10px] font-mono text-teal/60">
                        {categoryLabel}
                      </span>
                    </div>

                    {listing.isUserCreated && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-mustard text-teal font-extrabold shrink-0">
                        Your Post
                      </span>
                    )}
                  </div>

                  {/* Hub Name */}
                  <h3 className="font-extrabold text-base text-teal leading-snug">
                    {listing.hubName}
                  </h3>

                  {/* City & Public Landmark */}
                  <div className="text-xs space-y-1 bg-cream/40 p-2.5 rounded-lg border border-line/60">
                    <p className="font-bold text-teal flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-mustard shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{listing.city} &bull; {listing.area}</span>
                    </p>
                    <p className="text-[11px] text-teal/80 pl-5 leading-tight font-medium">
                      <span className="text-teal font-semibold">Landmark:</span> {listing.landmark}
                    </p>
                  </div>

                  {/* Target Audience */}
                  <div className="text-[11px] text-teal/85 leading-snug">
                    <span className="font-bold text-teal">{isOffer ? "Dedicated for:" : "From:"}</span>{" "}
                    <span className="text-teal/80">{listing.targetAudience}</span>
                  </div>

                  {/* Prasad Items Tagged */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {listing.prasadItems.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cream text-teal border border-line"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Timing & Quantity Info */}
                  <div className="text-xs text-teal/80 space-y-1 pt-1">
                    <p className="text-[11px] leading-relaxed">
                      <span className="font-bold text-teal">Timing:</span> {listing.availableFrom}
                    </p>
                    {listing.quantityNote && (
                      <p className="text-teal/70 text-[11px] leading-relaxed italic">
                        &ldquo;{listing.quantityNote}&rdquo;
                      </p>
                    )}
                  </div>

                  {listing.notes && (
                    <p className="text-xs text-teal/70 leading-relaxed border-t border-line/40 pt-2">
                      {listing.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-line/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedLandmarkListing(listing)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal text-cream font-bold text-xs hover:brightness-110 transition shadow-xs"
                  >
                    <svg className="w-3.5 h-3.5 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Walk-in Directions</span>
                  </button>

                  {listing.phone && (
                    <a
                      href={generateWhatsAppLink(listing)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#25D366]/10 text-[#128C7E] font-bold text-xs hover:bg-[#25D366]/20 transition"
                      title="WhatsApp Seva Desk"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {listing.isUserCreated && (
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold underline ml-auto"
                      title="Remove your post"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zero-Contact Walk-in Details Modal */}
      {selectedLandmarkListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="card !p-6 max-w-lg w-full bg-white shadow-2xl rounded-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-teal/20">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-teal/70 px-2 py-0.5 rounded-full bg-cream border border-line">
                  {selectedLandmarkListing.type === "offer" ? "Walk-in Seva Desk" : "Devotee Request Spot"}
                </span>
                <h3 className="font-extrabold text-lg text-teal mt-1">
                  {selectedLandmarkListing.hubName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLandmarkListing(null)}
                className="text-teal/40 hover:text-teal font-mono text-sm p-1"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-teal/85">
              <div className="bg-amber-50 p-3 rounded-xl border border-mustard/30 space-y-1">
                <p className="font-bold text-teal text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>Public Landmark:</span>
                </p>
                <p className="font-semibold text-teal pl-5 text-sm">
                  {selectedLandmarkListing.landmark}
                </p>
                <p className="text-[11px] text-teal/70 pl-5">
                  {selectedLandmarkListing.area}, {selectedLandmarkListing.city}
                </p>
              </div>

              <div className="space-y-1.5 bg-cream/40 p-3 rounded-xl border border-line/60">
                <p>
                  <span className="font-bold text-teal">When to Visit:</span> {selectedLandmarkListing.availableFrom}
                </p>
                <p>
                  <span className="font-bold text-teal">Prasad Items:</span> {selectedLandmarkListing.prasadItems.join(", ")}
                </p>
                <p>
                  <span className="font-bold text-teal">{selectedLandmarkListing.type === "offer" ? "Dedicated For:" : "Requested By:"}</span> {selectedLandmarkListing.targetAudience}
                </p>
                {selectedLandmarkListing.quantityNote && (
                  <p>
                    <span className="font-bold text-teal">Quantity:</span> {selectedLandmarkListing.quantityNote}
                  </p>
                )}
              </div>

              <div className="border border-teal/20 bg-teal/5 p-3 rounded-xl space-y-1.5 text-[11px] text-teal/80">
                <p className="font-bold text-teal">Zero-Contact Protocol:</p>
                <ul className="list-disc pl-4 space-y-1 text-teal/75">
                  <li>No registration, phone number, or personal disclosure required.</li>
                  <li>Reach the landmark desk during the specified time slot.</li>
                  <li>Say <em>&ldquo;Jai Chhathi Maiya&rdquo;</em>, receive your sacred prasad with dignity, and walk away with blessings.</li>
                  <li>Everything is 100% free and served with sacred love.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedLandmarkListing(null)}
                className="btn btn-primary text-xs !py-2 !px-5 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: List a New Prasad Seva Point / Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="card !p-6 sm:!p-8 max-w-xl w-full bg-white shadow-2xl rounded-2xl space-y-4 max-h-[92vh] overflow-y-auto border border-teal/20">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-teal">
                  {formType === "offer" ? "Offer Prasad (सेवा)" : "Request Prasad (आग्रह)"}
                </h3>
                <p className="text-xs text-teal/70 mt-0.5">
                  Zero-contact community exchange for students, soldiers, workers &amp; families.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-teal/40 hover:text-teal font-mono text-sm p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Giver vs Receiver Toggle Inside Modal */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-cream/50 rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setFormType("offer")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                  formType === "offer"
                    ? "bg-amber-600 text-cream shadow-xs"
                    : "text-teal/70 hover:text-teal"
                }`}
              >
                Offering Prasad (सेवा)
              </button>
              <button
                type="button"
                onClick={() => setFormType("request")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                  formType === "request"
                    ? "bg-teal text-cream shadow-xs"
                    : "text-teal/70 hover:text-teal"
                }`}
              >
                Requesting Prasad (आग्रह)
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Category */}
              <div>
                <label className="block font-bold text-teal mb-1">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as PrasadCategory)}
                  aria-label="Seva Category"
                  className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal font-medium focus:ring-2 focus:ring-teal/20"
                >
                  <option value="armed-forces">Indian Army, BSF &amp; Border Cantonments</option>
                  <option value="students">Student Hostels &amp; Coaching Hubs (Kota, DU, Prayagraj)</option>
                  <option value="industrial">Industrial &amp; Labour Belts (Surat, Kolkata, etc.)</option>
                  <option value="metro-tech">Metro &amp; Tech Hubs (Bengaluru, Pune, Hyderabad, Noida)</option>
                  <option value="bihar-jharkhand">Bihar &amp; Jharkhand Heartland</option>
                  <option value="diaspora">Global Diaspora (USA, UK, Gulf)</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-teal mb-1">
                  {formType === "offer" ? "Point Title *" : "Group / Requester Title *"}
                </label>
                <input
                  type="text"
                  value={formHubName}
                  onChange={(e) => setFormHubName(e.target.value)}
                  placeholder={formType === "offer" ? "e.g. Leh Spituk Military Gate Seva, or Kota Landmark Hostel Desk" : "e.g. Kota JEE Hostel Roommates, or Whitefield PG Bachelors"}
                  className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal placeholder:text-teal/35 focus:ring-2 focus:ring-teal/20"
                  required
                />
              </div>

              {/* City & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-teal mb-1">
                    City / Garrison *
                  </label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    aria-label="City or Garrison"
                    className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal font-medium focus:ring-2 focus:ring-teal/20"
                  >
                    <option value="Leh & Ladakh">Leh &amp; Ladakh</option>
                    <option value="Siachen Base & Nubra">Siachen Base &amp; Nubra</option>
                    <option value="Srinagar & Kashmir Valley">Srinagar &amp; Kashmir Valley</option>
                    <option value="Barmer & Jaisalmer">Barmer &amp; Jaisalmer</option>
                    <option value="Tezpur & Tawang">Tezpur &amp; Tawang</option>
                    <option value="Pathankot & Jammu">Pathankot &amp; Jammu</option>
                    <option value="Kota">Kota</option>
                    <option value="Delhi NCR">Delhi NCR / DU / Noida</option>
                    <option value="Prayagraj & Varanasi">Prayagraj &amp; Varanasi</option>
                    <option value="Surat & Ahmedabad">Surat &amp; Ahmedabad</option>
                    <option value="Kolkata & Howrah">Kolkata &amp; Howrah</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Patna">Patna</option>
                    <option value="Ranchi & Jamshedpur">Ranchi &amp; Jamshedpur</option>
                    <option value="International / USA">International / USA</option>
                    <option value="International / UK">International / UK</option>
                    <option value="International / Gulf">International / Gulf</option>
                    <option value="Other">Other City / Military Station</option>
                  </select>

                  {formCity === "Other" && (
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Type your city or garrison name"
                      className="mt-2 w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal text-xs"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-teal mb-1">
                    Area / Sector *
                  </label>
                  <input
                    type="text"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    placeholder="e.g. Indra Vihar, Whitefield, Mamun Cantt"
                    className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal placeholder:text-teal/35 focus:ring-2 focus:ring-teal/20"
                    required
                  />
                </div>
              </div>

              {/* Public Landmark */}
              <div>
                <label className="block font-bold text-teal mb-1">
                  Public Landmark for Zero-Contact Pickup *
                </label>
                <input
                  type="text"
                  value={formLandmark}
                  onChange={(e) => setFormLandmark(e.target.value)}
                  placeholder="e.g. Outside Main Sentry Cabin, Near Metro Exit Gate 2, or Chhath Pandal Entry"
                  className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal placeholder:text-teal/35 focus:ring-2 focus:ring-teal/20"
                  required
                />
              </div>

              {/* Dedicated For */}
              <div>
                <label className="block font-bold text-teal mb-1">
                  {formType === "offer" ? "Dedicated For" : "Who We Are"}
                </label>
                <input
                  type="text"
                  value={formTargetAudience}
                  onChange={(e) => setFormTargetAudience(e.target.value)}
                  placeholder={formType === "offer" ? "e.g. Jawans on duty, IIT-JEE hostel students, factory workers" : "e.g. 4 hostel students from Bihar preparing for exams"}
                  className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal placeholder:text-teal/35 focus:ring-2 focus:ring-teal/20"
                />
              </div>

              {/* Prasad Items */}
              <div>
                <label className="block font-bold text-teal mb-1">
                  Prasad Items
                </label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {[
                    "Traditional Thekua",
                    "Kasar Laddus",
                    "Kharna Kheer",
                    "Fruit Prasad",
                    "Daura Prasad"
                  ].map((item) => {
                    const isChecked = selectedItems.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => handleItemToggle(item)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                          isChecked
                            ? "bg-teal text-cream border-teal"
                            : "bg-cream/40 text-teal/80 border-line hover:border-teal/30"
                        }`}
                      >
                        {item} {isChecked ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timing & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-teal mb-1">
                    Timing *
                  </label>
                  <input
                    type="text"
                    value={formTiming}
                    onChange={(e) => setFormTiming(e.target.value)}
                    placeholder="e.g. Nov 15 Sandhya Arghya & Nov 16 morning"
                    className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal placeholder:text-teal/35 focus:ring-2 focus:ring-teal/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-teal mb-1">
                    Quantity Note
                  </label>
                  <input
                    type="text"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    placeholder="e.g. 50 packets, or 2-3 packets needed"
                    className="w-full py-1.5 px-3 rounded-lg border border-line bg-white text-teal placeholder:text-teal/35 focus:ring-2 focus:ring-teal/20"
                  />
                </div>
              </div>

              {/* Pavitrata Pledge */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-mustard/40 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="pledge"
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-teal focus:ring-teal border-line cursor-pointer"
                  required
                />
                <label htmlFor="pledge" className="text-[11px] text-teal/85 leading-snug cursor-pointer select-none">
                  <strong className="text-teal font-extrabold">Sacred Pavitrata Pledge:</strong> I confirm that this Prasad exchange is completely free and sacred. It shall never involve any payment, trade, or commercial transaction.
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost text-xs !py-1.5 !px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs !py-1.5 !px-5 font-bold shadow-sm"
                >
                  Publish {formType === "offer" ? "Seva Point" : "Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
