"use client";
import { sunsetAzimuth } from "../lib/sun";

// North-up dial: arrow points to sunset direction. For exact pointing on the
// ghat, align the dial's N with your phone compass, then face the arrow.
export default function SunCompass({ lat, date }: { lat: number; date: string }) {
  const { azimuth, label } = sunsetAzimuth(lat, date);
  return (
    <div className="mt-4 rounded-xl border border-line bg-cream p-4 flex items-center gap-4">
      <div className="relative w-24 h-24 shrink-0 rounded-full border-2 border-teal/30 bg-white" role="img" aria-label={`Sunset direction ${azimuth} degrees ${label}`}>
        {["N", "E", "S", "W"].map((d, i) => (
          <span
            key={d}
            className="absolute text-[10px] font-bold text-teal/60"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${i * 90}deg) translateY(-42px) rotate(${-i * 90}deg) translate(-50%,-50%)`
            }}
          >
            {d}
          </span>
        ))}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${azimuth}deg)` }}>
          <div className="text-mustard text-2xl font-bold" style={{ transform: "translateY(-26px)" }}>▲</div>
        </div>
        <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-teal" style={{ transform: "translate(-50%,-50%)" }} />
      </div>
      <div>
        <p className="font-bold text-lg tabular-nums">{azimuth}° <span className="text-teal/60">{label}</span></p>
        <p className="text-xs text-teal/70 mt-1">Face this way for Sandhya Arghya. North-up dial — align N with your phone compass at the ghat. Math ±2°.</p>
      </div>
    </div>
  );
}
