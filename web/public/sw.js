// Offline support: keep the festival shell working at the ghat with no signal.
//
// Rules (learned the hard way):
//  1. Only cache real successes. The old worker cached any response — including
//     a 404/error HTML page for an image URL — and then served it cache-first
//     forever, so the mural/album art stayed invisible even after a fix.
//  2. Never touch /_next/image (query-string URLs) or /api/* — those must
//     always hit the network so a redeploy is visible immediately.
//  3. Bump CACHE whenever this policy changes: activate() deletes old caches,
//     which is what heals already-poisoned browsers.
const CACHE = "chhath-v2";
const CORE = ["/en", "/en/vidhi", "/en/ghats", "/en/calendar", "/icon.svg", "/manifest.json"];

// Same-origin paths that are safe to serve cache-first.
const CACHEABLE = [
  /^\/_next\/static\//,                 // content-hashed JS/CSS — immutable
  /^\/icon(-192|-512)?\.(png|svg)$/,
  /^\/maskable-512\.png$/,
  /^\/manifest\.json$/,
  /^\/leaflet\//,                       // map marker icons
  /^\/covers\//,                        // album art
  /^\/chhath-mural\.jpg$/               // homepage mural
];

self.addEventListener("install", (e) => {
  // @ts-ignore
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(CORE.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  // @ts-ignore
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  // Store only genuine, complete, same-origin successes — never error pages.
  if (res && res.ok && res.type === "basic") {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Cross-origin (map tiles, fonts, YouTube thumbnails): the browser handles
  // these directly — privacy and freshness.
  if (url.origin !== location.origin) return;

  // Navigations: network first, cached /en shell when offline.
  if (req.mode === "navigate") {
    // @ts-ignore
    e.respondWith(fetch(req).catch(() => caches.match("/en")));
    return;
  }

  // Only known-safe static assets are served from cache. Everything else
  // (/_next/image, /api/*, sw.js, …) goes straight to the network.
  if (CACHEABLE.some((re) => re.test(url.pathname))) {
    // @ts-ignore
    e.respondWith(cacheFirst(req));
  }
});
