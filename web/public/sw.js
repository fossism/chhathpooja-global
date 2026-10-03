// Offline support: cache the festival shell so vidhi/ghats/calendar open
// at the riverbank with no signal. Photos/tiles stay online-only.
const CACHE = "chhath-v1";
const CORE = ["/en", "/en/vidhi", "/en/ghats", "/en/calendar", "/icon.svg", "/manifest.json"];

self.addEventListener("install", (e) => {
  // @ts-ignore
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  // @ts-ignore
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only handle same-origin; tiles/fonts/API stay network-only (privacy + freshness).
  if (url.origin !== location.origin) return;
  // Navigations: network first, fall back to cached /en when offline.
  if (req.mode === "navigate") {
    // @ts-ignore
    e.respondWith(fetch(req).catch(() => caches.match("/en")));
    return;
  }
  // Static shell: cache first, then network.
  // @ts-ignore
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => hit))
  );
});
