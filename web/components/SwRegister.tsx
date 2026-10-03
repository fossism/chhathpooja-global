"use client";
import { useEffect } from "react";

// Registers the offline service worker in production only.
// Caches vidhi/ghats/calendar shell so the guide works at the ghat with no signal.
export default function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is best-effort; site works fine without it.
    });
  }, []);
  return null;
}
