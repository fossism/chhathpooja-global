"use client";
import { useEffect, useState } from "react";
import { getCountdown } from "../lib/chhath";

export default function Countdown({ target, label }: { target: string; label: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) {
    return (
      <div>
        <p className="label">{label} • {target}</p>
        <div className="grid grid-cols-4 gap-2 mt-3">
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
  return (
    <div>
      <p className="label">{label} • {target}</p>
      <div className="grid grid-cols-4 gap-2 mt-3">
        {boxes.map((b) => (
          <div key={b.l} className="count-box">
            <p className="text-2xl md:text-3xl font-bold tabular-nums">{String(b.v).padStart(2, "0")}</p>
            <p className="label mt-0.5">{b.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
