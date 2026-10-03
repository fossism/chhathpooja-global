"use client";
import { useState } from "react";

// Song card with listen-aloud (Web Speech API, free, no audio files).
// hi-IN voice reads Devanagari + romanized lyrics; stop anytime.
export default function SongCard({ s }: { s: any }) {
  const [speaking, setSpeaking] = useState(false);

  function toggle() {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(`${s.title}. ${s.lyricsSnippet} ${s.meaning_en}`);
    u.lang = "hi-IN";
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }

  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <div className="card">
      <p className="font-bold">{s.title} <span className="text-teal/70 font-medium">• {s.titleDevanagari}</span></p>
      <p className="text-sm text-teal/70 mt-1">{s.meaning_en}</p>
      <div className="rounded-xl bg-cream border border-line p-3 mt-3">
        <p className="label">Lyric snippet</p>
        <p className="font-medium mt-1">{s.lyricsSnippet}</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <p className="text-xs text-teal/70">{s.singerCredit} • {s.license}</p>
      </div>
      {supported && (
        <button onClick={toggle} className="btn btn-ghost mt-3 !py-1.5 !px-4 text-xs" aria-pressed={speaking}>
          {speaking ? "⏹ Stop" : "🔊 Listen"}
        </button>
      )}
    </div>
  );
}
