"use client";
import { useEffect } from "react";

// Registers the offline service worker in production only.
// In development, actively unregisters any worker and clears caches so Webpack HMR chunks
// are never poisoned (preventing "TypeError: Cannot read properties of undefined (reading 'call')").
export default function SwRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if (typeof caches !== "undefined") {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is best-effort; site works fine without it.
    });
  }, []);

  return null;
}
