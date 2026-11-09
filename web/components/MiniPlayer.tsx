"use client";
import { usePlayer } from "./MusicProvider";

function fmt(s: number): string {
  if (!s) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function MiniPlayer() {
  const {
    current, playing, waiting, shuffle, repeat, progress, duration,
    queue, order, pos, videoOpen, setVideoOpen, queueOpen, setQueueOpen,
    toggle, next, prev, toggleShuffle, cycleRepeat, seek, playTracks, nextRandom
  } = usePlayer();

  if (!current) return null;

  return (
    <>
      {/* Up-next queue */}
      {queueOpen && (
        <div className="fixed bottom-16 inset-x-0 z-40 px-4">
          <div className="shell">
            <div className="card !p-3 max-h-72 overflow-auto ml-auto max-w-md shadow-2xl border-teal/20 bg-white">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-line">
                <p className="label">
                  Queue • {queue.length} songs {shuffle && "• 🔀 Random Shuffle Active"}
                </p>
                <button
                  onClick={() => setQueueOpen(false)}
                  className="text-xs text-teal/60 hover:text-teal font-bold"
                >
                  ✕
                </button>
              </div>
              <ol className="space-y-1">
                {order.map((qi, p) => {
                  const t = queue[qi];
                  if (!t) return null;
                  const isCurrent = p === pos;
                  return (
                    <li key={`${t.uid}-${p}`}>
                      <button
                        onClick={() => playTracks(queue, qi)}
                        className={`w-full text-left text-xs px-2.5 py-2 rounded flex items-center justify-between gap-2 transition ${
                          isCurrent
                            ? "bg-mustard/30 text-teal font-bold"
                            : "hover:bg-cream text-teal/80"
                        }`}
                      >
                        <span className="truncate">
                          {isCurrent ? "▶ " : `${p + 1}. `}
                          {t.title}
                          <span className="text-[10px] text-teal/50 ml-1.5">— {t.artist}</span>
                        </span>
                        {isCurrent && playing && (
                          <span className="text-[10px] chip !py-0 !px-1.5 bg-teal text-cream">
                            Playing
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Player bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-teal/20 shadow-2xl">
        <div
          className="h-1.5 bg-teal/20 cursor-pointer group relative"
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
            className="h-full bg-mustard group-hover:bg-amber-400 transition-all"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <div className="bg-teal text-cream py-2.5 px-3 md:px-6">
          <div className="shell flex items-center justify-between gap-3">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {current.thumb ? (
                <img
                  src={current.thumb}
                  alt={current.title}
                  className={`w-11 h-9 object-cover rounded shadow-sm border border-white/10 shrink-0 ${
                    playing ? "ring-2 ring-mustard/60" : ""
                  }`}
                />
              ) : (
                <span className="w-11 h-9 rounded bg-cream/15 flex items-center justify-center shrink-0 text-base">
                  🪕
                </span>
              )}
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold truncate text-cream">{current.title}</p>
                  {shuffle && (
                    <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-mustard text-teal font-extrabold">
                      RANDOM
                    </span>
                  )}
                </div>
                <p className="text-xs text-cream/70 truncate mt-0.5">
                  {current.artist}
                  {waiting
                    ? " • starting stream…"
                    : current.kind === "tts"
                    ? " • traditional acoustic recite"
                    : duration
                    ? ` • ${fmt(progress * duration)} / ${fmt(duration)}`
                    : ""}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={toggleShuffle}
                aria-label="Toggle Random Shuffle"
                title={shuffle ? "Random Shuffle is ON" : "Turn Random Shuffle ON"}
                className={`p-1.5 rounded-full text-sm transition ${
                  shuffle
                    ? "text-mustard bg-cream/10 font-bold"
                    : "text-cream/50 hover:text-cream"
                }`}
              >
                🔀
              </button>

              <button
                onClick={prev}
                aria-label="Previous Song"
                className="p-1.5 text-base text-cream/80 hover:text-cream transition"
              >
                ⏮
              </button>

              <button
                onClick={toggle}
                aria-label={waiting ? "Starting" : playing ? "Pause" : "Play"}
                className="w-10 h-10 rounded-full bg-mustard text-teal flex items-center justify-center font-extrabold shadow hover:scale-105 active:scale-95 transition"
              >
                {waiting ? "…" : playing ? "❚❚" : "▶"}
              </button>

              <button
                onClick={shuffle ? nextRandom : next}
                aria-label="Next Song (Random)"
                title={shuffle ? "Next Random Song" : "Next Song"}
                className="p-1.5 text-base text-cream/80 hover:text-cream transition"
              >
                ⏭
              </button>

              <button
                onClick={cycleRepeat}
                aria-label="Repeat mode"
                className={`p-1.5 text-xs font-bold transition ${
                  repeat !== "off" ? "text-mustard" : "text-cream/50 hover:text-cream"
                }`}
              >
                {repeat === "one" ? "🔂" : "🔁"}
              </button>

              <button
                onClick={() => setQueueOpen(!queueOpen)}
                aria-label="Queue list"
                className={`p-1.5 text-sm transition ${
                  queueOpen ? "text-mustard bg-cream/10" : "text-cream/70 hover:text-cream"
                }`}
              >
                ☰
              </button>

              {current.kind === "youtube" && (
                <button
                  onClick={() => setVideoOpen(!videoOpen)}
                  aria-label="Toggle Video Player"
                  className={`p-1.5 text-sm transition ${
                    videoOpen ? "text-mustard bg-cream/10" : "text-cream/70 hover:text-cream"
                  }`}
                  title="Toggle video view"
                >
                  🎬
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
