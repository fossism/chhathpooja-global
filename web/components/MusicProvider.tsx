"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { type Track } from "../lib/playlist";

declare global { interface Window { YT?: any; onYouTubeIframeAPIReady?: () => void; } }

type Ctx = {
  current: Track | null; playing: boolean; waiting: boolean;
  shuffle: boolean; repeat: "off" | "all" | "one";
  progress: number; duration: number;
  queue: Track[]; order: number[]; pos: number;
  videoOpen: boolean; setVideoOpen: (b: boolean) => void;
  queueOpen: boolean; setQueueOpen: (b: boolean) => void;
  playTracks: (tracks: Track[], start?: number) => void;
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

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [shuffle, setShuffle] = useState(false);
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
  // Exact values for the in-flight play request — never read lagging state
  // right after setState, which is what made tracks repeat or never start.
  const requestRef = useRef<{ queue: Track[]; order: number[]; pos: number }>({ queue: [], order: [], pos: 0 });

  const stateRef = useRef({ queue, order, pos, repeat, playing, shuffle, epoch });
  stateRef.current = { queue, order, pos, repeat, playing, shuffle, epoch };

  const current: Track | null = queue.length ? queue[order[pos] ?? 0] ?? null : null;

  // Load the YouTube IFrame API exactly once. Robust to remounts/HMR:
  // the callback is chained, and a short poll covers the case where the
  // script tag already exists but YT never signaled us.
  useEffect(() => {
    if (window.YT?.Player) { setApiReady(true); return; }
    let iv = 0;
    const markReady = () => { setApiReady(true); if (iv) window.clearInterval(iv); };
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { try { prev?.(); } catch { /* noop */ } markReady(); };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    iv = window.setInterval(() => { if (window.YT?.Player) markReady(); }, 400);
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
    if (np < s.order.length) goTo(np);
    else if (s.repeat === "all" || !auto) goTo(0);
    else setPlaying(false);
  }, [goTo]);

  // Create the hidden player once the API is available. It stays parked but
  // alive, so every later track change is a single loadVideoById call — no
  // iframe cold-start in the middle of the queue.
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
            // The player starts cued, not playing — this is the call that was
            // missing before, so the first selected track never actually ran.
            if (pending) { try { e.target.loadVideoById(pending); } catch { /* noop */ } }
          },
          onStateChange: (e: any) => {
            if (e.data === 1) { setPlaying(true); setWaiting(false); errorRef.current = 0; }  // playing
            else if (e.data === 2) setPlaying(false);                                        // paused
            else if (e.data === 0) advance(true);                                            // ended
            else if (e.data === 5) setWaiting(false);                                        // cued
          },
          onError: () => {
            // Removed / embed-blocked video: don't stall the queue, skip ahead.
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

  // Start one track. Everything is driven from here — no retry timers.
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
      // Guard against a cancelled utterance firing onend and skipping a track.
      const myEpoch = stateRef.current.epoch;
      u.onend = () => { if (stateRef.current.epoch === myEpoch && stateRef.current.playing) advance(true); };
      u.onerror = () => { setPlaying(false); setWaiting(false); };
      window.speechSynthesis.speak(u);
      setPlaying(true);
      setWaiting(false);
      return;
    }
    stopSpeech();
    if (playerRef.current && readyRef.current) {
      try {
        playerRef.current.loadVideoById(t.youtubeId);
        setPlaying(true);
        setWaiting(false);
      } catch { /* noop */ }
      return;
    }
    // Player still spinning up: remember the track; onReady starts it.
    pendingRef.current = t.youtubeId ?? null;
    setWaiting(true);
    ensurePlayer();
    // Never hang on "starting…" forever if YouTube is unreachable.
    window.setTimeout(() => {
      if (!readyRef.current && pendingRef.current === t.youtubeId) {
        pendingRef.current = null;
        setWaiting(false);
        setPlaying(false);
      }
    }, 12000);
  }, [ensurePlayer, stopSpeech]);

  // React to play requests only after state committed, so playback always
  // uses the exact queue/order that was requested.
  useEffect(() => {
    if (epoch === 0) return;
    const req = requestRef.current;
    const t = req.queue[req.order[req.pos]];
    if (t) startTrack(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch]);

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

  const toggle = useCallback(() => {
    const s = stateRef.current;
    const t = s.queue[s.order[s.pos]];
    if (!t) return;
    if (t.kind === "tts") {
      if (!("speechSynthesis" in window)) return;
      if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPlaying(true); }
      else if (window.speechSynthesis.speaking) { window.speechSynthesis.pause(); setPlaying(false); }
      else {
        // Finished or cancelled — restart this track.
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
      // Ask the player itself instead of trusting UI state (cued/buffering
      // tracks used to look "playing" while silent).
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
      // No epoch bump — shuffle must not interrupt the current track.
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
    playTracks, toggle, next, prev, toggleShuffle, cycleRepeat, seek, warm
  }), [current, playing, waiting, shuffle, repeat, progress, duration, queue, order, pos, videoOpen, queueOpen, playTracks, toggle, next, prev, toggleShuffle, cycleRepeat, seek, warm]);

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
