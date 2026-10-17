"use client";
import { useEffect } from "react";
import { ALBUMS, type Track } from "../lib/playlist";
import { usePlayer } from "./MusicProvider";

function fmt(s: number): string {
  if (!s) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function AlbumCard({ albumId }: { albumId: string }) {
  const album = ALBUMS.find((a) => a.id === albumId)!;
  const { playTracks, current, playing, toggle, queue, order, pos, warm, playTracks: pt } = usePlayer();
  // Explicit album cover wins; otherwise fall back to the first track's artwork.
  const cover = album.cover ?? album.tracks.find((t) => t.thumb)?.thumb;

  function playAt(i: number) {
    const cur = queue[order[pos] ?? -1];
    if (cur && album.tracks.some((t) => t.uid === cur.uid)) {
      // Same album playing — jump within it.
      const idx = queue.findIndex((t) => t.uid === album.tracks[i].uid);
      if (idx >= 0) { pt(queue, idx); return; }
    }
    playTracks(album.tracks, i);
  }

  return (
    <div className="num-card !p-0 overflow-hidden" onPointerEnter={warm}>
      <button onClick={() => playTracks(album.tracks, 0)} className="block w-full text-left" aria-label={`Play album ${album.title}`}>
        {cover
          ? <img src={cover} alt="" loading="lazy" className="w-full aspect-video object-cover" />
          : <div className="w-full aspect-video bg-gradient-to-br from-mustard to-teal flex items-center justify-center text-5xl">☀️</div>}
      </button>
      <div className="p-5">
        <h3 className="font-bold text-lg">{album.title}</h3>
        <p className="text-xs text-teal/60 mt-0.5">{album.subtitle} • {album.tracks.length} tracks</p>
        <div className="flex gap-2 mt-3">
          <button onClick={() => playTracks(album.tracks, 0)} className="btn btn-primary !py-2 !px-5 text-sm">▶ Play all</button>
        </div>
        <ol className="mt-3 divide-y divide-line border-t border-b border-line">
          {album.tracks.map((t, i) => {
            const active = current?.uid === t.uid;
            return (
              <li key={t.uid}>
                <button onClick={() => playAt(i)} className={`w-full flex items-center gap-3 py-2.5 text-left hover:bg-cream px-1 rounded ${active ? "bg-mustard/20" : ""}`}>
                  <span className="text-xs font-bold text-teal/50 w-6 text-center tabular-nums">
                    {active && playing ? "♪" : String(i + 1).padStart(2, "0")}
                  </span>
                  {t.thumb
                    ? <img src={t.thumb} alt="" loading="lazy" className="w-11 h-8 object-cover rounded border border-line shrink-0" />
                    : <span className="w-11 h-8 rounded bg-cream border border-line flex items-center justify-center text-base shrink-0">🔊</span>}
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">{t.title}</span>
                    <span className="block text-xs text-teal/60 truncate">{t.artist}{t.kind === "tts" ? " • folk listen-aloud" : ""}</span>
                  </span>
                  {active && (
                    <span onClick={(e) => { e.stopPropagation(); toggle(); }} className="ml-auto text-xs font-bold rounded-full border border-teal/30 px-3 py-1 shrink-0">
                      {playing ? "❚❚" : "▶"}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default function AlbumView() {
  const { warm } = usePlayer();
  // Pre-create the hidden YouTube player while the visitor browses, so the
  // first tap on a song starts playing instantly instead of cold-starting
  // an iframe. Idle time only — never blocks the page.
  useEffect(() => {
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    const cic = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;
    let id: number;
    if (ric) id = ric(() => warm(), { timeout: 3000 });
    else id = window.setTimeout(warm, 2500);
    return () => {
      if (ric && cic) cic(id);
      else window.clearTimeout(id);
    };
  }, [warm]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {ALBUMS.map((a) => (
        <AlbumCard key={a.id} albumId={a.id} />
      ))}
    </div>
  );
}
