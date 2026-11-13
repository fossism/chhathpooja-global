"use client";

import { useEffect, useRef } from "react";

/**
 * A 3px reading-progress line pinned to the very top of the viewport.
 * The fill is driven directly through refs inside a single
 * requestAnimationFrame tick, so scrolling never re-renders the page.
 * Nothing is measured during render, which keeps SSR and the first
 * client paint identical (no hydration mismatch).
 */
export default function GathaProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      frameRef.current = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio =
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

      if (fillRef.current) {
        fillRef.current.style.width = `${(ratio * 100).toFixed(2)}%`;
      }
    };

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div className="h-full w-full bg-teal/10">
        <div
          ref={fillRef}
          className="relative h-full w-0 bg-mustard"
        >
          <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-mustard shadow-[0_0_10px_rgba(232,184,75,0.85)]" />
        </div>
      </div>
    </div>
  );
}
