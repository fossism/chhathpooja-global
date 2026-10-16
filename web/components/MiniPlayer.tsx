"use client";
import { usePlayer } from "./MusicProvider";

function fmt(s: number): string {
  if (!s) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function MiniPlayer() {
  const {
    current, playing, shuffle, repeat, progress, duration,
    queue, order, pos, videoOpen, setVideoOpen, queueOpen, setQueueOpen,
    toggle, next, prev, toggleShuffle, cycleRepeat, seek, playTracks
  } = usePlayer();

  if (!current) return null;

  return (
    <>
      {/* Up-next queue */}
      {queueOpen && (
        <div className="fixed bottom-16 inset-x-0 z-40 px-4">
          <div className="shell">
            <div className="card !p-3 max-h-64 overflow-auto ml-auto max-w-md">
              <p className="label mb-2">Up next • {queue.length} tracks</p>
              <ol className="space-y-1">
                {order.map((qi, p) => {
                  const t = queue[qi];
                  return (
                    <li key={`${t.uid}-${p}`}>
                      <button
                        onClick={() => playTracks(queue, qi)}
                        className={`w-full text-left text-xs px-2 py-1.5 rounded truncate ${p === pos ? "bg-mustard/30 font-bold" : "hover:bg-cream"}`}
                      >
                        {p === pos ? "♪ " : `${p + 1}. `}{t.title} — {t.artist}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      )}
      {/* Player bar — persists across pages, music never stops on navigate. */}
      <div className="fixed bottom-0 inset-x-0 z-40">
        <div
          className="h-1 bg-teal/15 cursor-pointer"
          onClick={(e) => {
            const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            seek((e.clientX - r.left) / r.width);
          }}
          role="slider" aria-label="Seek" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} tabIndex={0}
        >
          <div className="h-full bg-mustard" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="bg-teal text-cream">
          <div className="shell flex items-center gap-2 py-2">
            {current.thumb
              ? <img src={current.thumb} alt="" className="w-10 h-8 object-cover rounded shrink-0" />
              : <span className="w-10 h-8 rounded bg-cream/15 flex items-center justify-center shrink-0">🔊</span>}
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-sm font-bold truncate">{current.title}</p>
              <p className="text-[11px] text-cream/70 truncate">
                {current.artist}{current.kind === "tts" ? " • folk listen-aloud" : ` • ${fmt(duration)}`}
              </p>
            </div>
            <button onClick={toggleShuffle} aria-label="Shuffle" aria-pressed={shuffle} className={`text-sm px-1.5 ${shuffle ? "text-mustard" : "text-cream/60"}`}>🔀</button>
            <button onClick={prev} aria-label="Previous" className="text-lg px-1">⏮</button>
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="w-9 h-9 rounded-full bg-mustard text-teal font-bold shrink-0">
              {playing ? "❚❚" : "▶"}
            </button>
            <button onClick={next} aria-label="Next" className="text-lg px-1">⏭</button>
            <button onClick={cycleRepeat} aria-label="Repeat" className={`text-xs font-bold px-1.5 ${repeat !== "off" ? "text-mustard" : "text-cream/60"}`}>
              {repeat === "one" ? "🔂" : "🔁"}
            </button>
            <button onClick={() => setQueueOpen(!queueOpen)} aria-label="Queue" className={`text-sm px-1.5 ${queueOpen ? "text-mustard" : "text-cream/60"}`}>☰</button>
            {current.kind === "youtube" && (
              <button onClick={() => setVideoOpen(!videoOpen)} aria-label="Video" className={`text-sm px-1.5 ${videoOpen ? "text-mustard" : "text-cream/60"}`}>🎬</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
