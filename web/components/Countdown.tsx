"use client";
import { useEffect, useState } from "react";
import { getCountdown } from "../lib/chhath";

export default function Countdown({
  target,
  label,
  variant = "default"
}: {
  target: string;
  label: string;
  variant?: "default" | "hero" | "gold";
}) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!now) {
    if (variant === "hero" || variant === "gold") {
      return (
        <div role="timer" aria-label={`${label} ${target}`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mustard animate-pulse" />
            <p className="text-xs uppercase font-mono tracking-widest text-mustard font-bold">{label} • {target}</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3" aria-hidden="true">
            {["Days", "Hours", "Mins", "Secs"].map((l) => (
              <div key={l} className="rounded-xl border border-mustard/30 bg-black/40 backdrop-blur-md p-3 text-center shadow-inner">
                <p className="text-2xl md:text-3xl font-extrabold tabular-nums text-mustard/60">--</p>
                <p className="text-[10px] md:text-xs font-mono uppercase text-cream/70 mt-1 font-semibold">{l}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div role="timer" aria-label={`${label} ${target}`}>
        <p className="label">{label} • {target}</p>
        <div className="grid grid-cols-4 gap-2 mt-3" aria-hidden="true">
          {["Days", "Hours", "Mins", "Secs"].map((l) => (
            <div key={l} className="count-box">
              <p className="text-2xl md:text-3xl font-bold tabular-nums">--</p>
              <p className="label mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const c = getCountdown(target, now);
  const boxes = [
    { v: c.days, l: "Days" },
    { v: c.hours, l: "Hours" },
    { v: c.minutes, l: "Mins" },
    { v: c.seconds, l: "Secs" }
  ];

  if (variant === "hero" || variant === "gold") {
    return (
      <div role="timer" aria-label={`${label} ${target}`}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mustard"></span>
          </span>
          <p className="text-xs uppercase font-mono tracking-widest text-mustard font-bold">{label} • {target}</p>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3" aria-hidden="true">
          {boxes.map((b) => (
            <div
              key={b.l}
              className="rounded-xl border border-mustard/35 bg-black/45 backdrop-blur-md p-3 text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-mustard/60 transition-all group"
            >
              <p className="text-2xl md:text-4xl font-black tabular-nums text-mustard drop-shadow-[0_2px_8px_rgba(232,184,75,0.4)] group-hover:scale-105 transition-transform">
                {String(b.v).padStart(2, "0")}
              </p>
              <p className="text-[10px] md:text-xs font-mono uppercase text-cream/80 tracking-wider mt-1 font-semibold">{b.l}</p>
            </div>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {c.days} days, {c.hours} hours, {c.minutes} minutes remaining
        </p>
      </div>
    );
  }

  return (
    <div role="timer" aria-label={`${label} ${target}`}>
      <p className="label">{label} • {target}</p>
      {/* Seconds tick visually but are hidden from screen readers; the
          polite live region below announces days/hours/mins only, so it
          doesn't spam every second. */}
      <div className="grid grid-cols-4 gap-2 mt-3" aria-hidden="true">
        {boxes.map((b) => (
          <div key={b.l} className="count-box">
            <p className="text-2xl md:text-3xl font-bold tabular-nums">{String(b.v).padStart(2, "0")}</p>
            <p className="label mt-0.5">{b.l}</p>
          </div>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {c.days} days, {c.hours} hours, {c.minutes} minutes remaining
      </p>
    </div>
  );
}
