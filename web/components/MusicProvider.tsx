"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ALL_TRACKS, type Track } from "../lib/playlist";

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void; } }

type Ctx = {
  current: Track | null; playing: boolean; waiting: boolean;
  shuffle: boolean; repeat: "off" | "all" | "one";
  progress: number; duration: number;
  queue: Track[]; order: number[]; pos: number;
  videoOpen: boolean; setVideoOpen: (b: boolean) => void;
  queueOpen: boolean; setQueueOpen: (b: boolean) => void;
  playTracks: (tracks: Track[], start?: number) => void;
  playRandom: (tracks?: Track[]) => void;
  nextRandom: () => void;
  toggle: () => void; next: () => void; prev: () => void;
  toggleShuffle: () => void; cycleRepeat: () => void; seek: (frac: number) => void;
  /** Create the hidden YouTube player ahead of time so the first tap starts fast. */
  warm: () => void;
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

function loadYoutubeApi() {
  if (typeof window === "undefined" || window.YT?.Player) return;
  if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  }
}

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>(ALL_TRACKS);
  const [order, setOrder] = useState<number[]>(() => shuffledOrder(ALL_TRACKS.length, 0));
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("all");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [epoch, setEpoch] = useState(0);

  const playerRef = useRef<any>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const creatingRef = useRef(false);
  const readyRef = useRef(false);        // YT player fired onReady
  const pendingRef = useRef<string | null>(null); // videoId waiting for the player
  const errorRef = useRef(0);            // consecutive unplayable videos
  // Exact values for the in-flight play request
  const requestRef = useRef<{ queue: Track[]; order: number[]; pos: number }>({ queue: ALL_TRACKS, order: [], pos: 0 });

  const stateRef = useRef({ queue, order, pos, repeat, playing, shuffle, epoch });
  stateRef.current = { queue, order, pos, repeat, playing, shuffle, epoch };

  const current: Track | null = queue.length ? queue[order[pos] ?? 0] ?? null : null;

  // Defer YouTube IFrame API loading until page is painted and browser is idle
  useEffect(() => {
    if (window.YT?.Player) { setApiReady(true); return; }
    let iv = 0;
    const markReady = () => { setApiReady(true); if (iv) window.clearInterval(iv); };
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { try { prev?.(); } catch { /* noop */ } markReady(); };

    const deferLoad = () => {
      loadYoutubeApi();
      iv = window.setInterval(() => { if (window.YT?.Player) markReady(); }, 300);
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(deferLoad, { timeout: 2500 });
    } else {
      setTimeout(deferLoad, 1500);
    }

    return () => { if (iv) window.clearInterval(iv); };
  }, []);

  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const goTo = useCallback((p: number) => {
    const s = stateRef.current;
    const t = s.queue[s.order[p]];
    if (!t) return;
    setPos(p);
    requestRef.current = { queue: s.queue, order: s.order, pos: p };
    setEpoch((e) => e + 1);
  }, []);

  const advance = useCallback((auto: boolean) => {
    const s = stateRef.current;
    if (!s.queue.length || !s.order.length) return;
    if (auto && s.repeat === "one") { goTo(s.pos); return; }
    const np = s.pos + 1;
    if (np < s.order.length) {
      goTo(np);
    } else {
      if (s.shuffle) {
        // Re-shuffle into fresh random loop so songs keep coming randomly
        const nextFirst = Math.floor(Math.random() * s.queue.length);
        const newOrder = shuffledOrder(s.queue.length, nextFirst);
        setOrder(newOrder);
        setPos(0);
        requestRef.current = { queue: s.queue, order: newOrder, pos: 0 };
        setEpoch((e) => e + 1);
      } else if (s.repeat === "all" || !auto) {
        goTo(0);
      } else {
        setPlaying(false);
      }
    }
  }, [goTo]);

  // Create the hidden player once the API is available.
  const ensurePlayer = useCallback(() => {
    if (playerRef.current || creatingRef.current) return;
    if (!apiReady || !window.YT?.Player || !divRef.current) return;
    creatingRef.current = true;
    try {
      playerRef.current = new window.YT.Player(divRef.current, {
        height: "180",
        width: "320",
        playerVars: { rel: 0, playsinline: 1 },
        events: {
          onReady: (e: any) => {
            readyRef.current = true;
            const pending = pendingRef.current;
            pendingRef.current = null;
            if (pending) { try { e.target.loadVideoById(pending); } catch { /* noop */ } }
          },
          onStateChange: (e: any) => {
            if (e.data === 1) { setPlaying(true); setWaiting(false); errorRef.current = 0; }  // playing
            else if (e.data === 2) setPlaying(false);                                        // paused
            else if (e.data === 0) advance(true);                                            // ended -> next random track
            else if (e.data === 5) setWaiting(false);                                        // cued
          },
          onError: () => {
            setWaiting(false);
            setPlaying(false);
            errorRef.current += 1;
            if (errorRef.current <= 5) window.setTimeout(() => advance(true), 60);
          }
        }
      });
    } catch {
      playerRef.current = null;
    }
    creatingRef.current = false;
  }, [apiReady, advance]);

  const warm = useCallback(() => ensurePlayer(), [ensurePlayer]);

  // Start one track.
  const startTrack = useCallback((t: Track) => {
    setProgress(0);
    setDuration(0);
    if (t.kind === "tts") {
      try { playerRef.current?.pauseVideo?.(); } catch { /* noop */ }
      stopSpeech();
      if (!("speechSynthesis" in window)) { setPlaying(false); setWaiting(false); return; }
      const u = new SpeechSynthesisUtterance(`${t.title}. ${t.lyric ?? ""} ${t.meaning ?? ""}`);
      u.lang = "hi-IN";
      u.rate = 0.9;
      const myEpoch = stateRef.current.epoch;
      u.onend = () => { if (stateRef.current.epoch === myEpoch && stateRef.current.playing) advance(true); };
      u.onerror = () => { setPlaying(false); setWaiting(false); };
      window.speechSynthesis.speak(u);
      setPlaying(true);
      setWaiting(false);
      return;
    }
    stopSpeech();
    loadYoutubeApi();
    if (playerRef.current && readyRef.current) {
      try {
        playerRef.current.loadVideoById(t.youtubeId);
        setPlaying(true);
        setWaiting(false);
      } catch { /* noop */ }
      return;
    }
    pendingRef.current = t.youtubeId ?? null;
    setWaiting(true);
    ensurePlayer();
    window.setTimeout(() => {
      if (!readyRef.current && pendingRef.current === t.youtubeId) {
        pendingRef.current = null;
        setWaiting(false);
        setPlaying(false);
      }
    }, 12000);
  }, [ensurePlayer, stopSpeech, advance]);

  // React to play requests.
  useEffect(() => {
    if (epoch === 0) return;
    const req = requestRef.current;
    const t = req.queue[req.order[req.pos]];
    if (t) startTrack(t);
  }, [epoch, startTrack]);

  useEffect(() => () => {
    stopSpeech();
    try { playerRef.current?.destroy?.(); } catch { /* noop */ }
  }, [stopSpeech]);

  const playTracks = useCallback((tracks: Track[], start = 0) => {
    if (!tracks.length) return;
    errorRef.current = 0;
    const sh = stateRef.current.shuffle;
    const s = Math.min(Math.max(start, 0), tracks.length - 1);
    const o = sh ? shuffledOrder(tracks.length, s) : tracks.map((_, i) => i);
    const p = sh ? 0 : s;
    setQueue(tracks);
    setOrder(o);
    setPos(p);
    requestRef.current = { queue: tracks, order: o, pos: p };
    setEpoch((e) => e + 1);
  }, []);

  const playRandom = useCallback((tracks?: Track[]) => {
    const pool = (tracks && tracks.length) ? tracks : (stateRef.current.queue.length ? stateRef.current.queue : ALL_TRACKS);
    if (!pool.length) return;
    errorRef.current = 0;
    const startIdx = Math.floor(Math.random() * pool.length);
    const o = shuffledOrder(pool.length, startIdx);
    setShuffle(true);
    setQueue(pool);
    setOrder(o);
    setPos(0);
    requestRef.current = { queue: pool, order: o, pos: 0 };
    setEpoch((e) => e + 1);
  }, []);

  const nextRandom = useCallback(() => {
    const s = stateRef.current;
    if (!s.queue.length) return;
    if (!s.shuffle) {
      setShuffle(true);
      const curIdx = s.order[s.pos] ?? 0;
      setOrder(shuffledOrder(s.queue.length, curIdx));
      setPos(0);
    }
    advance(false);
  }, [advance]);

  const toggle = useCallback(() => {
    const s = stateRef.current;
    const t = s.queue[s.order[s.pos]];
    if (!t) return;
    if (t.kind === "tts") {
      if (!("speechSynthesis" in window)) return;
      if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPlaying(true); }
      else if (window.speechSynthesis.speaking) { window.speechSynthesis.pause(); setPlaying(false); }
      else {
        requestRef.current = { queue: s.queue, order: s.order, pos: s.pos };
        setEpoch((e) => e + 1);
      }
      return;
    }
    const p = playerRef.current;
    if (!p || !readyRef.current) {
      requestRef.current = { queue: s.queue, order: s.order, pos: s.pos };
      setEpoch((e) => e + 1);
      return;
    }
    try {
      const st = p.getPlayerState();
      if (st === 1 || st === 3) { p.pauseVideo(); setPlaying(false); }
      else { p.playVideo(); setPlaying(true); }
    } catch { /* noop */ }
  }, []);

  const next = useCallback(() => advance(false), [advance]);
  const prev = useCallback(() => {
    const s = stateRef.current;
    if (!s.order.length) return;
    goTo(s.pos > 0 ? s.pos - 1 : s.order.length - 1);
  }, [goTo]);

  const toggleShuffle = useCallback(() => {
    const nv = !stateRef.current.shuffle;
    setShuffle(nv);
    const s = stateRef.current;
    if (s.queue.length) {
      const curIdx = s.order[s.pos] ?? 0;
      setOrder(nv ? shuffledOrder(s.queue.length, curIdx) : s.queue.map((_, i) => i));
      setPos(nv ? 0 : curIdx);
    }
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const seek = useCallback((frac: number) => {
    try {
      const p = playerRef.current;
      const d = p?.getDuration?.() ?? 0;
      if (d) p.seekTo(frac * d, true);
    } catch { /* noop */ }
  }, []);

  // Progress ticker for YouTube tracks.
  useEffect(() => {
    if (!playing || !current || current.kind !== "youtube") return;
    const t = window.setInterval(() => {
      try {
        const p = playerRef.current;
        const d = p?.getDuration?.() ?? 0;
        const c = p?.getCurrentTime?.() ?? 0;
        if (d > 0) { setDuration(d); setProgress(Math.min(1, c / d)); }
      } catch { /* noop */ }
    }, 500);
    return () => window.clearInterval(t);
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
    current, playing, waiting, shuffle, repeat, progress, duration,
    queue, order, pos,
    videoOpen, setVideoOpen, queueOpen, setQueueOpen,
    playTracks, playRandom, nextRandom, toggle, next, prev, toggleShuffle, cycleRepeat, seek, warm
  }), [current, playing, waiting, shuffle, repeat, progress, duration, queue, order, pos, videoOpen, queueOpen, playTracks, playRandom, nextRandom, toggle, next, prev, toggleShuffle, cycleRepeat, seek, warm]);

  return (
    <MusicCtx.Provider value={value}>
      {children}
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
