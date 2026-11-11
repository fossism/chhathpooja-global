// Offline support: keep the festival shell working at the ghat with no signal.
const CACHE = "chhath-v5";
const CORE = [
  "/en",
  "/en/vidhi",
  "/en/ghats",
  "/en/calendar",
  "/en/songs",
  "/hi",
  "/hi/vidhi",
  "/hi/calendar",
  "/icon.svg",
  "/manifest.json"
];

// Same-origin paths that are safe to serve cache-first.
const CACHEABLE = [
  /^\/_next\/static\/(?!.*(hot-update|webpack))/, // immutable content-hashed JS/CSS in prod only
  /^\/icon(-192|-512)?\.(png|svg)$/,
  /^\/maskable-512\.png$/,
  /^\/manifest\.json$/,
  /^\/leaflet\//,                       // map marker icons
  /^\/covers\//,                        // album art
  /^\/images\//,                        // vidhi and ritual images
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

  // Cross-origin: handled directly by browser
  if (url.origin !== location.origin) return;

  // On localhost/127.0.0.1, always bypass cache so Webpack dev chunks are never poisoned
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return;

  // Never intercept or cache HMR or development hot-updates
  if (url.pathname.includes("hot-update") || url.pathname.includes("webpack")) return;

  // Navigations: network first, cached /en shell when offline.
  if (req.mode === "navigate") {
    // @ts-ignore
    e.respondWith(fetch(req).catch(() => caches.match("/en")));
    return;
  }

  // Only known-safe static assets are served from cache
  if (CACHEABLE.some((re) => re.test(url.pathname))) {
    // @ts-ignore
    e.respondWith(cacheFirst(req));
  }
});
