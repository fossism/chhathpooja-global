"use client";

import { useState, useMemo, useEffect } from "react";
import { ALL_TRACKS, type Track } from "../../../lib/playlist";
import { usePlayer } from "../../../components/MusicProvider";

function fmt(s: number): string {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function Songs() {
  const {
    current,
    playing,
    waiting,
    shuffle,
    progress,
    duration,
    toggle,
    nextRandom,
    prev,
    playRandom,
    playTracks,
    toggleShuffle,
    seek,
    videoOpen,
    setVideoOpen
  } = usePlayer();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedLyricId, setExpandedLyricId] = useState<string | null>(null);
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customArtist, setCustomArtist] = useState("");
  const [addError, setAddError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load custom saved songs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chhath_custom_songs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCustomTracks(parsed);
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  // Merge default tracks with custom tracks
  const combinedTracks = useMemo(() => {
    return [...customTracks, ...ALL_TRACKS];
  }, [customTracks]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(combinedTracks.map((t) => t.category)));
    return ["all", ...list];
  }, [combinedTracks]);

  const filteredTracks = useMemo(() => {
    return combinedTracks.filter((t) => {
      const matchCat = activeCategory === "all" || t.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.titleDevanagari && t.titleDevanagari.includes(q)) ||
        t.artist.toLowerCase().includes(q) ||
        (t.meaning && t.meaning.toLowerCase().includes(q)) ||
        (t.lyric && t.lyric.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [combinedTracks, search, activeCategory]);

  const handlePlaySong = (t: Track) => {
    const idx = combinedTracks.findIndex((item) => item.uid === t.uid);
    if (idx >= 0) {
      if (current?.uid === t.uid) {
        toggle();
      } else {
        playTracks(combinedTracks, idx);
      }
    }
  };

  const handleShufflePlay = () => {
    playRandom(filteredTracks.length ? filteredTracks : combinedTracks);
  };

  const handlePlaySharda = () => {
    const sharda = combinedTracks.filter((t) => t.artist.toLowerCase().includes("sharda"));
    if (sharda.length) playTracks(sharda, 0);
    else handleShufflePlay();
  };

  const extractYoutubeId = (url: string): string | null => {
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const handleAddCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    const ytid = extractYoutubeId(customUrl);
    if (!ytid) {
      setAddError("Please paste a valid YouTube video URL or 11-character video ID.");
      return;
    }
    const newTrack: Track = {
      uid: `custom-${ytid}-${Date.now()}`,
      id: `custom-${ytid}`,
      title: customTitle.trim() || `Chhath Geet (${ytid})`,
      artist: customArtist.trim() || "Community Added",
      category: "Added by You",
      kind: "youtube",
      youtubeId: ytid,
      thumb: `https://i.ytimg.com/vi/${ytid}/hqdefault.jpg`,
      meaning: "Custom YouTube track added to your local playlist."
    };

    const updated = [newTrack, ...customTracks];
    setCustomTracks(updated);
    try {
      localStorage.setItem("chhath_custom_songs", JSON.stringify(updated));
    } catch {
      /* ignore */
    }

    // Immediately play the added song
    playTracks([newTrack, ...combinedTracks], 0);

    // Reset modal
    setCustomUrl("");
    setCustomTitle("");
    setCustomArtist("");
    setShowAddModal(false);
  };

  const handleCopyShare = (t: Track) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://chhathmahaparv.org";
    const shareText = `🎵 Listening to "${t.title}" (${t.artist}) on Chhath Mahaparv: ${origin}/en/songs?track=${t.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(t.uid);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="shell py-8 md:py-12 pb-36 space-y-10">
      {/* ========================================================================= */}
      {/* HERO BANNER: SACRED DUSK & DAWN CHHATH ATMOSPHERE                         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-mustard/60 bg-gradient-to-br from-[#062420] via-[#0f3c36] to-[#1a5a52] text-cream p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(22,86,79,0.35)]">
        {/* Ambient Glowing Orbs */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-mustard/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Sacred Sun Motif in Background */}
        <svg
          className="absolute right-0 top-0 w-80 h-80 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4"
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

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mustard/20 border border-mustard/40 text-mustard text-xs font-bold uppercase tracking-wider mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mustard"></span>
            </span>
            पवित्र छठ महापर्व संगीत संगम • Curated Archive
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Chhath <em>Folk Songs</em> & Bhakti Dhun
          </h1>
          <p className="text-cream/80 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            A small, carefully kept archive of the Chhathi Maiya geet families actually sing at the ghat — Sharda Sinha’s immortal hymns, sunset and sunrise arghya, and the walk to the river. Every track is a verified YouTube embed: no jukebox filler, no party tracks, no dead or mislabelled links.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono text-cream/70">
            <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cream/15">
              {ALL_TRACKS.length} hand-picked geet
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cream/15">
              Only Chhathi Maiya songs
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cream/15">
              Verified YouTube embeds
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cream/15">
              Sharda Sinha · Anuradha Paudwal & more
            </span>
          </div>

          {/* Master Toolbar CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-cream/15">
            <button
              onClick={handleShufflePlay}
              className="inline-flex items-center gap-2 rounded-full bg-mustard px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#092521] hover:brightness-105 active:scale-95 transition shadow-lg"
            >
              <span className="text-base">🔀</span>
              <span>Instant Shuffle & Play</span>
            </button>

            <button
              onClick={handlePlaySharda}
              className="inline-flex items-center gap-2 rounded-full bg-black/45 border border-mustard/40 px-4 py-2.5 text-xs sm:text-sm font-bold text-cream hover:bg-black/60 active:scale-95 transition"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
                <path d="M19 11a7 7 0 0 1-14 0" />
                <path d="M12 18v3" />
              </svg>
              <span>Play Sharda classics</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-black/45 border border-cream/30 px-4 py-2.5 text-xs sm:text-sm font-bold text-cream hover:border-mustard/60 transition"
            >
              <span>➕</span>
              <span>Play from YouTube Link</span>
            </button>

            <button
              onClick={toggleShuffle}
              className={`ml-auto text-xs font-mono font-bold px-3 py-1.5 rounded-full border transition ${
                shuffle
                  ? "bg-mustard/20 border-mustard text-mustard"
                  : "bg-black/30 border-cream/20 text-cream/60"
              }`}
              title="Toggle Random Shuffle Mode"
            >
              {shuffle ? "🔀 Shuffle: ON" : "🔁 Sequential"}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* NOW STREAMING: HIGH-END AESTHETIC AUDIO DECK                              */}
      {/* ========================================================================= */}
      {current && (
        <section
          aria-label="Current Track Player"
          className="relative overflow-hidden rounded-2xl border-2 border-teal/40 bg-white p-6 md:p-8 shadow-card"
        >
          <div className="grid md:grid-cols-12 gap-6 items-center">
            {/* Artwork with Vinyl Glow / Sound Wave */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-48 h-36 sm:w-60 sm:h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-[#0b2925] group">
                {current.thumb ? (
                  <img
                    src={current.thumb}
                    alt={current.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-mustard/30 to-teal/40 flex items-center justify-center text-5xl">
                    🪕
                  </div>
                )}

                {/* Animated Equalizer Waveform overlay when playing */}
                {playing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 backdrop-blur-[1px]">
                    <span className="w-1.5 h-6 bg-mustard rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-12 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-8 bg-mustard rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="w-1.5 h-14 bg-white rounded-full animate-bounce [animation-delay:450ms]" />
                    <span className="w-1.5 h-7 bg-mustard rounded-full animate-bounce [animation-delay:200ms]" />
                  </div>
                )}

                <span className="absolute top-2.5 left-2.5 chip chip-yellow text-[10px] font-black uppercase shadow">
                  {current.category}
                </span>
              </div>
            </div>

            {/* Track Info & Scrubber & Playback Controls */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-90"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-mustard"></span>
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-teal/70">
                      Now Streaming
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-teal tracking-tight">
                      {current.title}
                    </h2>
                    {current.titleDevanagari && (
                      <span className="text-lg sm:text-xl font-medium text-mustard">
                        {current.titleDevanagari}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-teal/70 mt-1">
                    🎙️ {current.artist}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyShare(current)}
                    className="p-2 rounded-lg border border-line hover:border-teal text-teal/70 text-xs transition"
                    title="Share this song"
                  >
                    {copiedId === current.uid ? "✓ Copied" : "🔗 Share"}
                  </button>

                  {current.kind === "youtube" && (
                    <button
                      onClick={() => setVideoOpen(!videoOpen)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        videoOpen
                          ? "bg-teal text-cream border-teal"
                          : "bg-white text-teal/70 border-line hover:border-teal"
                      }`}
                      title="Open YouTube video popup"
                    >
                      🎬 Video
                    </button>
                  )}
                </div>
              </div>

              {/* Scrubber Bar */}
              <div className="space-y-1.5">
                <div
                  className="h-2.5 rounded-full bg-line cursor-pointer overflow-hidden relative group"
                  onClick={(e) => {
                    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    seek((e.clientX - r.left) / r.width);
                  }}
                  role="slider"
                  aria-label="Seek track"
                  aria-valuenow={Math.round(progress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  tabIndex={0}
                >
                  <div
                    className="h-full bg-gradient-to-r from-teal via-mustard to-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-teal/60">
                  <span>{fmt(progress * duration)}</span>
                  <span>{duration ? fmt(duration) : waiting ? "Connecting stream…" : "--:--"}</span>
                </div>
              </div>

              {/* Master Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={prev}
                  className="p-3 rounded-full bg-cream hover:bg-mustard/20 text-teal transition text-sm font-bold"
                  aria-label="Previous Track"
                  title="Previous Song"
                >
                  ⏮
                </button>

                <button
                  onClick={toggle}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-mustard px-7 py-3 text-sm font-black text-[#0b2925] shadow-md hover:scale-105 active:scale-95 transition"
                >
                  <span>{waiting ? "⏳ Connecting" : playing ? "❚❚ Pause" : "▶ Play Now"}</span>
                </button>

                <button
                  onClick={nextRandom}
                  className="inline-flex items-center gap-1.5 rounded-full bg-teal px-5 py-3 text-xs font-bold text-cream hover:opacity-90 shadow transition"
                  title="Play next random song"
                >
                  <span>Next Song</span>
                  <span>⏭</span>
                </button>

                <div className="ml-auto text-xs text-teal/60 font-medium italic hidden lg:block">
                  अरघ के बेर, सुरुज देव के नमन
                </div>
              </div>

              {/* Sacred Meaning & Lyrics Drawer */}
              {(current.meaning || current.lyric) && (
                <div className="p-3.5 rounded-xl bg-cream/70 border border-line text-xs text-teal/80 space-y-1 mt-3">
                  {current.lyric && (
                    <p className="italic font-serif text-teal text-sm">
                      "{current.lyric}"
                    </p>
                  )}
                  {current.meaning && (
                    <p className="text-teal/70 leading-relaxed font-medium">
                      <strong className="text-teal font-bold uppercase tracking-wider text-[10px]">
                        Significance:{" "}
                      </strong>
                      {current.meaning}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CURATORIAL NOTE                                                           */}
      {/* ========================================================================= */}
      <section className="flex items-start gap-3 rounded-2xl border border-line bg-cream/60 px-4 py-3 sm:px-5">
        <span className="mt-0.5 shrink-0 rounded-full border border-teal/25 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-teal/60">
          Curated
        </span>
        <p className="text-xs text-teal/70 leading-relaxed">
          The archive is deliberately small. We kept the geet that families actually sing at the ghat, removed duplicate uploads and non-Chhath tracks, and checked every link.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* SEARCH & RITUAL FILTER TABS                                              */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:max-w-md relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, singer (Sharda Sinha, Anuradha...), or lyrics..."
              className="input pr-9 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-xs text-teal/50 hover:text-teal font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs text-teal/70 font-semibold font-mono">
              Showing {filteredTracks.length} Songs
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition shadow-sm ${
                activeCategory === cat
                  ? "bg-teal text-cream"
                  : "bg-white text-teal/70 hover:text-teal border border-line"
              }`}
            >
              {cat === "all" ? "🌟 All Songs" : cat}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SONGS GRID / LIST                                                         */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        {filteredTracks.map((t, idx) => {
          const isCurrent = current?.uid === t.uid;
          const isPlayingThis = isCurrent && playing;
          const isExpanded = expandedLyricId === t.uid;

          return (
            <div
              key={t.uid}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isCurrent
                  ? "border-mustard ring-2 ring-mustard/60 bg-gradient-to-r from-mustard/[0.08] to-transparent shadow-md"
                  : "border-line bg-white hover:border-teal/40 hover:shadow-sm"
              }`}
            >
              <div className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                {/* Index / Visualizer */}
                <div className="w-8 text-center shrink-0">
                  {isPlayingThis ? (
                    <div className="flex items-center justify-center gap-0.5 h-4">
                      <span className="w-1 h-3.5 bg-mustard rounded-full animate-bounce" />
                      <span className="w-1 h-5 bg-teal rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-2.5 bg-mustard rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-teal/40">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Thumbnail with quick Play overlay */}
                <button
                  onClick={() => handlePlaySong(t)}
                  className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-[#0b2925] group cursor-pointer shadow-sm"
                  aria-label={`Play ${t.title}`}
                >
                  {t.thumb ? (
                    <img
                      src={t.thumb}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center bg-cream text-lg">
                      🪕
                    </span>
                  )}
                  <div
                    className={`absolute inset-0 bg-black/45 flex items-center justify-center text-white transition-opacity ${
                      isPlayingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <span className="text-xs font-black">{isPlayingThis ? "❚❚" : "▶"}</span>
                  </div>
                </button>

                {/* Title & Artist & Category */}
                <div className="min-w-0 flex-1 leading-snug">
                  <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                    <h3
                      onClick={() => handlePlaySong(t)}
                      className={`text-sm sm:text-base font-bold cursor-pointer truncate transition ${
                        isCurrent ? "text-teal" : "text-teal hover:text-mustard"
                      }`}
                    >
                      {t.title}
                    </h3>
                    {t.titleDevanagari && (
                      <span className="text-xs text-mustard font-semibold truncate">
                        {t.titleDevanagari}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-xs text-teal/70 font-semibold truncate">{t.artist}</p>
                    <span className="text-[10px] chip !py-0.5 !px-2 bg-cream text-teal/80 border-line">
                      {t.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyShare(t)}
                    className="p-2 rounded-lg border border-line hover:border-teal text-teal/60 text-xs hidden sm:inline-block transition"
                    title="Copy share link"
                  >
                    {copiedId === t.uid ? "✓" : "🔗"}
                  </button>

                  {(t.meaning || t.lyric) && (
                    <button
                      onClick={() => setExpandedLyricId((prev) => (prev === t.uid ? null : t.uid))}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition hidden sm:inline-block ${
                        isExpanded
                          ? "bg-cream border-teal/40 font-bold text-teal"
                          : "border-line text-teal/70 hover:text-teal hover:bg-cream"
                      }`}
                      title="Read lyrics and meaning"
                    >
                      {isExpanded ? "Hide" : "Lyrics & Meaning"}
                    </button>
                  )}

                  <button
                    onClick={() => handlePlaySong(t)}
                    className={`btn !py-2 !px-4 text-xs font-black flex items-center gap-1.5 transition ${
                      isPlayingThis
                        ? "btn-accent shadow-md scale-105"
                        : "btn-primary hover:opacity-90"
                    }`}
                  >
                    <span>{isPlayingThis ? "❚❚ Pause" : "▶ Play"}</span>
                  </button>
                </div>
              </div>

              {/* Expandable Lyrics & English Meaning */}
              {isExpanded && (t.meaning || t.lyric) && (
                <div className="px-5 py-4 bg-cream/70 border-t border-line text-xs text-teal/90 space-y-2 animate-fadeIn">
                  {t.lyric && (
                    <div>
                      <span className="label text-[10px] text-teal/60">Sacred Folk Lyric:</span>
                      <p className="font-serif italic text-sm mt-0.5 text-teal font-medium">
                        "{t.lyric}"
                      </p>
                    </div>
                  )}
                  {t.meaning && (
                    <div>
                      <span className="label text-[10px] text-teal/60">English Meaning & Significance:</span>
                      <p className="mt-0.5 leading-relaxed text-teal/80 font-medium">
                        {t.meaning}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredTracks.length === 0 && (
          <div className="card text-center py-12">
            <span className="text-4xl">🪕</span>
            <h3 className="font-bold text-base mt-2 text-teal">No songs found</h3>
            <p className="text-xs text-teal/60 mt-1">
              Try searching by a different name, or paste a YouTube link to play it directly.
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="btn btn-ghost text-xs !py-1.5 !px-4"
              >
                Reset filters
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary text-xs !py-1.5 !px-4"
              >
                ➕ Add from YouTube
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* MODAL: ADD / PLAY ANY YOUTUBE CHHATH SONG                                  */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-line space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-lg font-bold text-teal">Play Any YouTube Chhath Song</h3>
                <p className="text-xs text-teal/60 mt-0.5">
                  Paste any YouTube URL. It plays instantly and stays saved on your device.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-teal/50 hover:text-teal font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomSong} className="space-y-3.5">
              <div>
                <label className="label text-[11px] mb-1 block">
                  YouTube Link or Video ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=... or youtu.be/..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-[11px] mb-1 block">Song Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kaanch Hi Baans"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label text-[11px] mb-1 block">Singer (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharda Sinha"
                    value={customArtist}
                    onChange={(e) => setCustomArtist(e.target.value)}
                    className="input text-xs"
                  />
                </div>
              </div>

              {addError && <p className="text-xs text-red-600 font-medium">{addError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-ghost text-xs !py-2 !px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs !py-2 !px-5 font-bold">
                  ▶ Play & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
