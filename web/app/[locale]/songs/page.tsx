"use client";

import { useState, useMemo } from "react";
import { ALL_TRACKS, type Track } from "../../../lib/playlist";
import { usePlayer } from "../../../components/MusicProvider";

function fmt(s: number): string {
  if (!s) return "0:00";
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

  const categories = useMemo(() => {
    const list = Array.from(new Set(ALL_TRACKS.map((t) => t.category)));
    return ["all", ...list];
  }, []);

  const filteredTracks = useMemo(() => {
    return ALL_TRACKS.filter((t) => {
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
  }, [search, activeCategory]);

  const handlePlaySong = (t: Track) => {
    const idx = ALL_TRACKS.findIndex((item) => item.uid === t.uid);
    if (idx >= 0) {
      if (current?.uid === t.uid) {
        toggle();
      } else {
        playTracks(ALL_TRACKS, idx);
      }
    }
  };

  const handleShufflePlay = () => {
    playRandom(filteredTracks.length ? filteredTracks : ALL_TRACKS);
  };

  return (
    <div className="shell py-8 md:py-12 pb-32">
      {/* Page Header */}
      <div className="mb-8">
        <span className="marker">Sacred Melodies of the Mahaparv</span>
        <h1 className="section-title mt-2">
          Chhath <em>Folk Songs</em> & Geet
        </h1>
        <p className="section-sub text-base max-w-2xl mt-1">
          A pure, deduplicated collection of timeless Chhath songs — from Sharda Sinha's classical renditions to folk
          ghat anthems. Click <strong>Shuffle & Play</strong> to stream songs randomly without duplicate tracks.
        </p>

        {/* Global Action Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleShufflePlay}
            className="btn btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 shadow hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <span className="text-base">🎲</span>
            <span>Shuffle & Play Random</span>
          </button>

          <button
            onClick={toggleShuffle}
            className={`btn !py-2.5 !px-4 text-xs font-bold transition flex items-center gap-2 border ${
              shuffle
                ? "bg-mustard/20 border-mustard text-teal font-extrabold"
                : "bg-white border-line text-teal/70 hover:text-teal"
            }`}
            title="When active, the next song is chosen randomly"
          >
            <span>🔀</span>
            <span>Random Play: {shuffle ? "ACTIVE" : "OFF"}</span>
          </button>

          <div className="ml-auto text-xs font-semibold text-teal/60 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{ALL_TRACKS.length} Unique Songs • 0 Duplicates</span>
          </div>
        </div>
      </div>

      {/* Now Playing Studio Card */}
      {current && (
        <div className="card mb-10 !p-0 overflow-hidden border-teal/30 shadow-card bg-white">
          <div className="p-6 md:p-8 bg-gradient-to-br from-cream via-white to-mustard/10 border-b border-line">
            <div className="grid md:grid-cols-12 gap-6 items-center">
              {/* Artwork / Visualizer */}
              <div className="md:col-span-4 flex flex-col items-center justify-center">
                <div className="relative w-44 h-32 sm:w-56 sm:h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-teal/10 group">
                  {current.thumb ? (
                    <img
                      src={current.thumb}
                      alt={current.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-mustard/40 to-teal/30 flex items-center justify-center text-5xl">
                      🪕
                    </div>
                  )}

                  {/* Sound Wave Animation if playing */}
                  {playing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 backdrop-blur-[1px]">
                      <span className="w-1.5 h-8 bg-mustard rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-12 bg-cream rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-6 bg-mustard rounded-full animate-bounce [animation-delay:300ms]" />
                      <span className="w-1.5 h-10 bg-cream rounded-full animate-bounce [animation-delay:450ms]" />
                    </div>
                  )}

                  <span className="absolute top-2 left-2 chip chip-yellow text-[10px] font-extrabold uppercase">
                    {current.category}
                  </span>
                </div>
              </div>

              {/* Player Details & Controls */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="label text-[11px] text-teal/60">Now Streaming</span>
                    <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-teal">
                        {current.title}
                      </h2>
                      {current.titleDevanagari && (
                        <span className="text-base sm:text-lg font-medium text-mustard">
                          {current.titleDevanagari}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-teal/70 mt-1 font-medium">
                      {current.artist}
                    </p>
                  </div>

                  {current.kind === "youtube" && (
                    <button
                      onClick={() => setVideoOpen(!videoOpen)}
                      className={`btn !py-1.5 !px-3 text-xs border transition ${
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

                {/* Scrubber / Progress Bar */}
                <div className="space-y-1.5">
                  <div
                    className="h-2 rounded-full bg-line cursor-pointer overflow-hidden relative group"
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
                      className="h-full bg-teal group-hover:bg-teal/80 transition-all rounded-full"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-teal/60">
                    <span>{fmt(progress * duration)}</span>
                    <span>{duration ? fmt(duration) : waiting ? "Connecting…" : "--:--"}</span>
                  </div>
                </div>

                {/* Studio Playback Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={prev}
                    className="btn btn-ghost !p-2.5 text-base"
                    aria-label="Previous Song"
                    title="Previous Song"
                  >
                    ⏮
                  </button>

                  <button
                    onClick={toggle}
                    className="btn btn-accent !py-2.5 !px-6 text-sm font-extrabold flex items-center gap-2 shadow hover:scale-105 active:scale-95 transition"
                  >
                    <span>{waiting ? "…" : playing ? "❚❚ Pause" : "▶ Play"}</span>
                  </button>

                  <button
                    onClick={nextRandom}
                    className="btn btn-primary !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shadow"
                    title="Jump to a new random song"
                  >
                    <span>Next Random ⏭</span>
                  </button>

                  <button
                    onClick={toggleShuffle}
                    className={`btn !py-2 !px-3 text-xs border transition ${
                      shuffle
                        ? "bg-mustard/20 border-mustard text-teal font-bold"
                        : "bg-white border-line text-teal/60"
                    }`}
                  >
                    {shuffle ? "🔀 Random: ON" : "🔁 Sequential"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Meaning / Lyric Snippet for the playing song */}
          {(current.meaning || current.lyric) && (
            <div className="px-6 py-4 bg-cream/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs text-teal/80">
              <div className="space-y-1 max-w-3xl">
                {current.meaning && (
                  <p>
                    <strong className="text-teal font-bold uppercase tracking-wider text-[10px]">
                      Significance:{" "}
                    </strong>
                    {current.meaning}
                  </p>
                )}
                {current.lyric && (
                  <p className="italic text-teal/70 font-serif text-sm">
                    "{current.lyric}"
                  </p>
                )}
              </div>
              <span className="chip bg-white border-line text-[10px] whitespace-nowrap text-teal/60 shrink-0">
                Traditional Bhojpuri Folk
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="w-full sm:max-w-md relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by song title, singer, or lyrics..."
              className="input pr-9"
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

          <div className="text-xs text-teal/70 font-semibold self-end sm:self-center">
            Showing {filteredTracks.length} unique songs
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat
                  ? "bg-teal text-cream shadow-sm"
                  : "bg-white text-teal/70 hover:text-teal border border-line"
              }`}
            >
              {cat === "all" ? "All Songs" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Songs List */}
      <div className="space-y-3">
        {filteredTracks.map((t, idx) => {
          const isCurrent = current?.uid === t.uid;
          const isPlayingThis = isCurrent && playing;
          const isExpanded = expandedLyricId === t.uid;

          return (
            <div
              key={t.uid}
              className={`num-card !p-0 overflow-hidden border transition-all duration-200 ${
                isCurrent
                  ? "border-teal ring-2 ring-mustard/50 shadow-md bg-mustard/[0.04]"
                  : "border-line hover:border-teal/40 hover:shadow-sm bg-white"
              }`}
            >
              <div className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                {/* Index / Visualizer */}
                <div className="w-7 text-center shrink-0">
                  {isPlayingThis ? (
                    <div className="flex items-center justify-center gap-0.5 h-4">
                      <span className="w-1 h-3 bg-teal rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-mustard rounded-full animate-pulse [animation-delay:150ms]" />
                      <span className="w-1 h-2 bg-teal rounded-full animate-pulse [animation-delay:300ms]" />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-teal/40">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                <button
                  onClick={() => handlePlaySong(t)}
                  className="relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-teal/10 group cursor-pointer"
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
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white transition-opacity ${
                      isPlayingThis ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <span className="text-xs font-bold">{isPlayingThis ? "❚❚" : "▶"}</span>
                  </div>
                </button>

                {/* Titles & Artist */}
                <div className="min-w-0 flex-1 leading-snug">
                  <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                    <h3
                      onClick={() => handlePlaySong(t)}
                      className="text-sm sm:text-base font-bold text-teal hover:text-mustard cursor-pointer truncate"
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
                    <p className="text-xs text-teal/60 font-medium truncate">{t.artist}</p>
                    <span className="text-[10px] chip !py-0.5 !px-2 bg-cream text-teal/70">
                      {t.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {(t.meaning || t.lyric) && (
                    <button
                      onClick={() =>
                        setExpandedLyricId((prev) => (prev === t.uid ? null : t.uid))
                      }
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition hidden sm:inline-block ${
                        isExpanded
                          ? "bg-cream border-teal/40 font-bold text-teal"
                          : "border-line text-teal/60 hover:text-teal hover:bg-cream"
                      }`}
                      title="View lyrics and meaning"
                    >
                      {isExpanded ? "Hide Words" : "Words"}
                    </button>
                  )}

                  <button
                    onClick={() => handlePlaySong(t)}
                    className={`btn !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 transition ${
                      isPlayingThis
                        ? "btn-accent shadow"
                        : "btn-primary hover:opacity-90"
                    }`}
                  >
                    <span>{isPlayingThis ? "❚❚ Pause" : "▶ Play"}</span>
                  </button>
                </div>
              </div>

              {/* Expandable Words & Meaning Drawer */}
              {isExpanded && (t.meaning || t.lyric) && (
                <div className="px-5 py-4 bg-cream/60 border-t border-line text-xs text-teal/90 animate-fadeIn space-y-2">
                  {t.lyric && (
                    <div>
                      <span className="label text-[10px] text-teal/60">Lyric Line:</span>
                      <p className="font-serif italic text-sm mt-0.5 text-teal">
                        "{t.lyric}"
                      </p>
                    </div>
                  )}
                  {t.meaning && (
                    <div>
                      <span className="label text-[10px] text-teal/60">English Meaning:</span>
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
            <span className="text-3xl">🎵</span>
            <h3 className="font-bold text-base mt-2 text-teal">No songs found</h3>
            <p className="text-xs text-teal/60 mt-1">
              Try a different search word or clear the category filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="btn btn-ghost text-xs !py-1.5 !px-4 mt-3"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
