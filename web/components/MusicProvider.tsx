"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { type Track } from "../lib/playlist";

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void; } }

type Ctx = {
  current: Track | null; playing: boolean;
  shuffle: boolean; repeat: "off" | "all" | "one";
  progress: number; duration: number;
  queue: Track[]; order: number[]; pos: number;
  videoOpen: boolean; setVideoOpen: (b: boolean) => void;
  queueOpen: boolean; setQueueOpen: (b: boolean) => void;
  playTracks: (tracks: Track[], start?: number) => void;
  toggle: () => void; next: () => void; prev: () => void;
  toggleShuffle: () => void; cycleRepeat: () => void; seek: (frac: number) => void;
};

const MusicCtx = createContext<Ctx | null>(null);
export function usePlayer(): Ctx {
  const c = useContext(MusicCtx);
  if (!c) throw new Error("usePlayer outside MusicProvider");
  return c;
}

function shuffledOrder(n: number, first: number): number[] {
  const rest = Array.from({ length: n }, (_, i) => i).filter((i) => i !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("all");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  const playerRef = useRef<any>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const creatingRef = useRef(false);
  const stateRef = useRef({ queue, order, pos, repeat, playing });
  stateRef.current = { queue, order, pos, repeat, playing };

  const current: Track | null = queue.length ? queue[order[pos] ?? 0] ?? null : null;

  // Load YouTube IFrame API once.
  useEffect(() => {
    if (window.YT?.Player) { setApiReady(true); return; }
    if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => setApiReady(true);
  }, []);

  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  // Advance on natural end. Stored in ref so YT callbacks + speech callbacks
  // always see fresh state.
  const advanceRef = useRef<(auto: boolean) => void>(() => {});
  advanceRef.current = (auto: boolean) => {
    const s = stateRef.current;
    if (!s.queue.length) return;
    if (auto && s.repeat === "one") {
      playAtRef.current(s.pos);
      return;
    }
    const nextPos = s.pos + 1;
    if (nextPos < s.order.length) {
      playAtRef.current(nextPos);
    } else if (s.repeat === "all" || !auto) {
      playAtRef.current(0);
    } else {
      setPlaying(false);
    }
  };

  const playAtRef = useRef<(p: number) => void>(() => {});
  playAtRef.current = (p: number) => {
    const s = stateRef.current;
    const t = s.queue[s.order[p]];
    if (!t) return;
    setPos(p);
    setProgress(0);
    setDuration(0);
    if (t.kind === "tts") {
      playerRef.current?.pauseVideo?.();
      stopSpeech();
      if (!("speechSynthesis" in window)) { setPlaying(false); return; }
      const u = new SpeechSynthesisUtterance(`${t.title}. ${t.lyric ?? ""} ${t.meaning ?? ""}`);
      u.lang = "hi-IN";
      u.rate = 0.9;
      u.onend = () => { if (stateRef.current.playing) advanceRef.current(true); };
      u.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(u);
      setPlaying(true);
    } else {
      stopSpeech();
      const start = () => {
        try {
          playerRef.current?.loadVideoById?.(t.youtubeId);
          setPlaying(true);
        } catch { setPlaying(false); }
      };
      if (playerRef.current?.loadVideoById) {
        start();
      } else if (apiReady && !creatingRef.current) {
        creatingRef.current = true;
        try {
          playerRef.current = new window.YT.Player(divRef.current, {
            height: "180", width: "320",
            videoId: t.youtubeId,
            playerVars: { rel: 0 },
            events: {
              onStateChange: (e: any) => {
                if (e.data === window.YT.PlayerState.ENDED) advanceRef.current(true);
                else if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
                else if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);
              }
            }
          });
          setPlaying(true);
        } catch { setPlaying(false); }
        creatingRef.current = false;
      } else {
        // API not ready yet — retry shortly (user gesture already happened).
        setTimeout(() => playAtRef.current(p), 800);
      }
    }
  };

  useEffect(() => () => { stopSpeech(); try { playerRef.current?.destroy?.(); } catch { /* noop */ } }, [stopSpeech]);

  const playTracks = useCallback((tracks: Track[], start = 0) => {
    if (!tracks.length) return;
    stopSpeech();
    setQueue(tracks);
    setOrder(shuffle ? shuffledOrder(tracks.length, start) : tracks.map((_, i) => i));
    // Defer so stateRef catches queue/order before playAt reads them.
    setTimeout(() => playAtRef.current(shuffle ? 0 : start), 0);
    if (shuffle) setPos(0); else setPos(start);
  }, [shuffle, stopSpeech]);

  const toggle = useCallback(() => {
    const t = stateRef.current.queue[stateRef.current.order[stateRef.current.pos]];
    if (!t) return;
    if (t.kind === "tts") {
      if (!("speechSynthesis" in window)) return;
      if (stateRef.current.playing) {
        window.speechSynthesis.pause();
        setPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setPlaying(true);
      }
      return;
    }
    try {
      if (stateRef.current.playing) playerRef.current?.pauseVideo?.();
      else playerRef.current?.playVideo?.();
    } catch { /* noop */ }
  }, []);

  const next = useCallback(() => advanceRef.current(false), []);
  const prev = useCallback(() => {
    const s = stateRef.current;
    playAtRef.current(s.pos > 0 ? s.pos - 1 : s.order.length - 1);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((v) => {
      const nv = !v;
      const s = stateRef.current;
      if (s.queue.length) {
        const curIdx = s.order[s.pos] ?? 0;
        setOrder(nv ? shuffledOrder(s.queue.length, curIdx) : s.queue.map((_, i) => i));
        setPos(nv ? 0 : curIdx);
      }
      return nv;
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const seek = useCallback((frac: number) => {
    try {
      const d = playerRef.current?.getDuration?.();
      if (d) playerRef.current.seekTo(frac * d, true);
    } catch { /* noop */ }
  }, []);

  // Progress ticker for YouTube tracks.
  useEffect(() => {
    if (!playing || !current || current.kind !== "youtube") return;
    const t = setInterval(() => {
      try {
        const d = playerRef.current?.getDuration?.() ?? 0;
        const c = playerRef.current?.getCurrentTime?.() ?? 0;
        if (d > 0) { setDuration(d); setProgress(c / d); }
      } catch { /* noop */ }
    }, 500);
    return () => clearInterval(t);
  }, [playing, current]);

  // Lock-screen / headset controls.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: current.title, artist: current.artist, album: current.album,
        artwork: current.thumb ? [{ src: current.thumb, sizes: "480x360", type: "image/jpeg" }] : []
      });
      navigator.mediaSession.setActionHandler("play", () => toggle());
      navigator.mediaSession.setActionHandler("pause", () => toggle());
      navigator.mediaSession.setActionHandler("previoustrack", () => prev());
      navigator.mediaSession.setActionHandler("nexttrack", () => next());
    } catch { /* noop */ }
  }, [current, toggle, prev, next]);

  const value = useMemo<Ctx>(() => ({
    current, playing, shuffle, repeat, progress, duration,
    queue, order, pos,
    videoOpen, setVideoOpen, queueOpen, setQueueOpen,
    playTracks, toggle, next, prev, toggleShuffle, cycleRepeat, seek
  }), [current, playing, shuffle, repeat, progress, duration, queue, order, pos, videoOpen, queueOpen, playTracks, toggle, next, prev, toggleShuffle, cycleRepeat, seek]);

  return (
    <MusicCtx.Provider value={value}>
      {children}
      {/* YouTube player home. Visible when the video drawer opens;
          parked 1px while audio-only so playback never stops. */}
      <div
        aria-hidden={!videoOpen}
        className={videoOpen
          ? "fixed bottom-24 right-4 z-40 rounded-xl overflow-hidden border border-line shadow-card bg-black"
          : "fixed bottom-0 right-0 z-0 w-px h-px overflow-hidden opacity-0 pointer-events-none"}
      >
        <div ref={divRef} />
      </div>
    </MusicCtx.Provider>
  );
}
