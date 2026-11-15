"use client";
import { useEffect, useState } from "react";
import { getCountdown } from "../lib/chhath";

export type CountdownProps = {
  // Backwards compatibility / single target
  target?: string;
  label?: string;
  variant?: "default" | "hero" | "gold";

  // Multi-arghya support
  sandhyaTarget?: string;
  ushaTarget?: string;
  sandhyaLabel?: string;
  ushaLabel?: string;
  sandhyaTime?: string; // Default: "18:00"
  ushaTime?: string;    // Default: "06:30"
  tabLabels?: {
    sandhya?: string;
    usha?: string;
  };
  initialArghya?: "sandhya" | "usha";
};

export default function Countdown({
  target,
  label,
  variant = "default",
  sandhyaTarget,
  ushaTarget,
  sandhyaLabel,
  ushaLabel,
  sandhyaTime = "18:00",
  ushaTime = "06:30",
  tabLabels,
  initialArghya
}: CountdownProps) {
  const sandhyaDate = sandhyaTarget || target || "";
  const ushaDate = ushaTarget || "";
  const hasBoth = Boolean(sandhyaDate && ushaDate);

  // Initialize with current Date so server and client have immediate valid timestamps
  const [now, setNow] = useState<Date>(() => new Date());
  const [userSelectedTab, setUserSelectedTab] = useState<"sandhya" | "usha" | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Compute timing milestones
  const nowMs = now.getTime();
  const sandhyaMs = sandhyaDate ? new Date(`${sandhyaDate}T${sandhyaTime}:00+05:30`).getTime() : 0;
  const ushaMs = ushaDate ? new Date(`${ushaDate}T${ushaTime}:00+05:30`).getTime() : 0;

  const isSandhyaPassed = sandhyaMs > 0 && sandhyaMs <= nowMs;
  const isUshaPassed = ushaMs > 0 && ushaMs <= nowMs;

  // Determine active tab: automatically track upcoming arghya unless user manually selected a tab
  let activeTab: "sandhya" | "usha" = initialArghya || "sandhya";
  if (userSelectedTab) {
    activeTab = userSelectedTab;
  } else if (hasBoth && isSandhyaPassed && !isUshaPassed) {
    activeTab = "usha";
  } else if (!sandhyaDate && ushaDate) {
    activeTab = "usha";
  }

  const isUsha = activeTab === "usha";
  const activeTarget = isUsha ? ushaDate : sandhyaDate;
  const activeTime = isUsha ? ushaTime : sandhyaTime;
  const activeLabel = isUsha
    ? (ushaLabel || "Countdown to Usha Arghya")
    : (sandhyaLabel || label || "Countdown to Sandhya Arghya");
  const timeDesc = isUsha ? `Sunrise (~${ushaTime} IST)` : `Sunset (~${sandhyaTime} IST)`;

  const sandhyaTabName = tabLabels?.sandhya || "Sandhya Arghya";
  const ushaTabName = tabLabels?.usha || "Usha Arghya";

  // Render Tab Selector
  const renderTabs = () => {
    if (!hasBoth) return null;

    if (variant === "hero" || variant === "gold") {
      return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center p-1 bg-black/50 rounded-xl border border-mustard/30 text-xs font-mono w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setUserSelectedTab("sandhya")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !isUsha
                  ? "bg-mustard text-black font-extrabold shadow-md scale-100"
                  : "text-cream/70 hover:text-mustard hover:bg-white/5"
              }`}
            >
              <span>🌅</span>
              <span>{sandhyaTabName}</span>
              {isSandhyaPassed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-mustard border border-mustard/40">
                  ✓
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setUserSelectedTab("usha")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isUsha
                  ? "bg-mustard text-black font-extrabold shadow-md scale-100"
                  : "text-cream/70 hover:text-mustard hover:bg-white/5"
              }`}
            >
              <span>🌄</span>
              <span>{ushaTabName}</span>
              {isSandhyaPassed && !isUshaPassed && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              )}
              {isUshaPassed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-cream/60">
                  ✓
                </span>
              )}
            </button>
          </div>
          <span className="text-[10px] md:text-xs font-mono uppercase text-mustard/80 font-semibold tracking-wider text-right sm:text-left">
            {timeDesc}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center p-1 bg-cream rounded-xl border border-line text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setUserSelectedTab("sandhya")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              !isUsha
                ? "bg-teal text-cream font-bold shadow-sm"
                : "text-teal/70 hover:text-teal hover:bg-white/60"
            }`}
          >
            <span>🌅</span>
            <span>{sandhyaTabName}</span>
            {isSandhyaPassed && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal/10 text-teal border border-teal/20">
                ✓
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setUserSelectedTab("usha")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              isUsha
                ? "bg-teal text-cream font-bold shadow-sm"
                : "text-teal/70 hover:text-teal hover:bg-white/60"
            }`}
          >
            <span>🌄</span>
            <span>{ushaTabName}</span>
            {isSandhyaPassed && !isUshaPassed && (
              <span className="inline-block w-2 h-2 rounded-full bg-mustard animate-pulse" />
            )}
            {isUshaPassed && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal/10 text-teal/60">
                ✓
              </span>
            )}
          </button>
        </div>
        <span className="text-[10px] md:text-xs font-mono uppercase text-teal/60 font-semibold tracking-wider text-right sm:text-left">
          {timeDesc}
        </span>
      </div>
    );
  };

  // SSR skeleton
  if (!now) {
    if (variant === "hero" || variant === "gold") {
      return (
        <div role="timer" aria-label={`${activeLabel} ${activeTarget}`}>
          {renderTabs()}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mustard animate-pulse" />
            <p className="text-xs uppercase font-mono tracking-widest text-mustard font-bold">
              {activeLabel} • {activeTarget}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3" aria-hidden="true">
            {["Days", "Hours", "Mins", "Secs"].map((l) => (
              <div
                key={l}
                className="rounded-xl border border-mustard/30 bg-black/40 backdrop-blur-md p-3 text-center shadow-inner"
              >
                <p className="text-2xl md:text-3xl font-extrabold tabular-nums text-mustard/60">--</p>
                <p className="text-[10px] md:text-xs font-mono uppercase text-cream/70 mt-1 font-semibold">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div role="timer" aria-label={`${activeLabel} ${activeTarget}`}>
        {renderTabs()}
        <p className="label">{activeLabel} • {activeTarget}</p>
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

  const c = getCountdown(activeTarget, now, activeTime);
  const boxes = [
    { v: c.days, l: "Days" },
    { v: c.hours, l: "Hours" },
    { v: c.minutes, l: "Mins" },
    { v: c.seconds, l: "Secs" }
  ];

  if (variant === "hero" || variant === "gold") {
    return (
      <div role="timer" suppressHydrationWarning aria-label={`${activeLabel} ${activeTarget}`}>
        {renderTabs()}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  c.isPassed ? "bg-cream/40" : "bg-mustard"
                } opacity-75`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  c.isPassed ? "bg-cream/40" : "bg-mustard"
                }`}
              />
            </span>
            <p className="text-xs uppercase font-mono tracking-widest text-mustard font-bold">
              {activeLabel} • {activeTarget} {c.isPassed && "(Concluded)"}
            </p>
          </div>
          {!hasBoth && (
            <span className="text-[10px] md:text-xs font-mono uppercase text-cream/70">
              {timeDesc}
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mt-3" aria-hidden="true" suppressHydrationWarning>
          {boxes.map((b) => (
            <div
              key={b.l}
              className="rounded-xl border border-mustard/35 bg-black/45 backdrop-blur-md p-3 text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-mustard/60 transition-all group"
            >
              <p className="text-2xl md:text-4xl font-black tabular-nums text-mustard drop-shadow-[0_2px_8px_rgba(232,184,75,0.4)] group-hover:scale-105 transition-transform">
                {String(b.v).padStart(2, "0")}
              </p>
              <p className="text-[10px] md:text-xs font-mono uppercase text-cream/80 tracking-wider mt-1 font-semibold">
                {b.l}
              </p>
            </div>
          ))}
        </div>

        {!isUsha && isSandhyaPassed && hasBoth && !isUshaPassed && (
          <div className="mt-3 p-2.5 rounded-xl border border-mustard/40 bg-mustard/15 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs text-cream">
            <span>Sandhya Arghya concluded at sunset. Next is <strong>Usha Arghya</strong> at dawn.</span>
            <button
              type="button"
              onClick={() => setUserSelectedTab("usha")}
              className="px-3 py-1 rounded-lg bg-mustard text-black font-extrabold hover:bg-mustard/90 transition shadow text-xs shrink-0"
            >
              Switch to Usha Arghya 🌄 →
            </button>
          </div>
        )}

        {isUsha && isUshaPassed && (
          <div className="mt-3 p-3 rounded-xl border border-mustard/40 bg-black/40 text-center text-xs text-cream font-medium">
            ✦ Usha Arghya &amp; Parana completed. Chhath Mahaparv Sampann! May Chhathi Maiya &amp; Surya Dev bless all devotees.
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {c.isPassed
            ? `${activeLabel} has passed.`
            : `${c.days} days, ${c.hours} hours, ${c.minutes} minutes remaining until ${activeLabel}`}
        </p>
      </div>
    );
  }

  return (
    <div role="timer" suppressHydrationWarning aria-label={`${activeLabel} ${activeTarget}`}>
      {renderTabs()}

      <div className="flex items-center justify-between gap-2">
        <p className="label flex items-center gap-1.5">
          <span>{activeLabel} • {activeTarget}</span>
          {c.isPassed && (
            <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full border border-teal/20">
              Concluded
            </span>
          )}
        </p>
        {!hasBoth && (
          <span className="text-[10px] md:text-xs font-mono uppercase text-teal/60 font-semibold tracking-wider">
            {timeDesc}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3" aria-hidden="true" suppressHydrationWarning>
        {boxes.map((b) => (
          <div key={b.l} className="count-box">
            <p className="text-2xl md:text-3xl font-bold tabular-nums">
              {String(b.v).padStart(2, "0")}
            </p>
            <p className="label mt-0.5">{b.l}</p>
          </div>
        ))}
      </div>

      {!isUsha && isSandhyaPassed && hasBoth && !isUshaPassed && (
        <div className="mt-3 p-2.5 rounded-lg border border-teal/20 bg-teal/5 flex flex-wrap items-center justify-between gap-2 text-xs text-teal">
          <span>Sandhya Arghya concluded at sunset. Next is <strong>Usha Arghya</strong> at dawn.</span>
          <button
            type="button"
            onClick={() => setUserSelectedTab("usha")}
            className="px-2.5 py-1 rounded-md bg-teal text-cream font-bold hover:opacity-90 transition text-xs shrink-0"
          >
            Switch to Usha Arghya 🌄 →
          </button>
        </div>
      )}

      {isUsha && isUshaPassed && (
        <div className="mt-3 p-3 rounded-lg border border-line bg-cream text-center text-xs text-teal font-medium">
          ✦ Usha Arghya &amp; Parana completed. Chhath Mahaparv Sampann! May Chhathi Maiya &amp; Surya Dev bless all devotees.
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {c.isPassed
          ? `${activeLabel} has passed.`
          : `${c.days} days, ${c.hours} hours, ${c.minutes} minutes remaining until ${activeLabel}`}
      </p>
    </div>
  );
}
