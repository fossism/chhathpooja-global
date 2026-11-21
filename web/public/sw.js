// Offline support: keep the festival shell working at the ghat with no signal.
const CACHE = "chhath-v9";
const CORE = [
  "/en",
  "/en/vidhi",
  "/en/ghats",
  "/en/calendar",
  "/en/songs",
  "/hi",
  "/hi/vidhi",
  "/hi/calendar",
  "/bho",
  "/mai",
  "/ne",
  "/icon.svg?v=2",
  "/icon-192.png?v=2",
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
  /^\/chhath-mural\.jpg$/,              // homepage mural
  /^\/chhath-arghya-painting\.jpg$/     // traditional arghya painting
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

// Only cache expected static asset types. This avoids storing error pages or
// unexpected HTML/JSON under a hashed asset URL.
const CACHEABLE_TYPE_RE =
  /^(?:text\/css|text\/javascript|application\/javascript|application\/json|image\/(?:png|jpeg|webp|gif|svg\+xml)|font\/|application\/font)/i;

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (
    res &&
    res.ok &&
    res.type === "basic" &&
    CACHEABLE_TYPE_RE.test(res.headers.get("content-type") || "")
  ) {
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

  // Navigations: network first, cached locale shell when offline.
  if (req.mode === "navigate") {
    // @ts-ignore
    e.respondWith(
      fetch(req).catch(async () => {
        const seg = url.pathname.split("/")[1] || "en";
        const matched = await caches.match(`/${seg}`);
        if (matched) return matched;
        const fallbackEn = await caches.match("/en");
        if (fallbackEn) return fallbackEn;
        return caches.match("/");
      })
    );
    return;
  }

  // Only known-safe static assets are served from cache
  if (CACHEABLE.some((re) => re.test(url.pathname))) {
    // @ts-ignore
    e.respondWith(cacheFirst(req));
  }
});
