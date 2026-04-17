const CACHE = "muslims-path-v1";

// Core shell to cache on install
const SHELL = ["/", "/index.html"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  // Delete old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // Skip non-GET and cross-origin API requests (Supabase, Aladhan, etc.)
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin &&
      !url.hostname.endsWith("r2.dev") &&
      !url.hostname.endsWith("fonts.googleapis.com") &&
      !url.hostname.endsWith("fonts.gstatic.com")) return;

  // Network-first for API calls, cache-first for assets
  const isAsset = url.pathname.match(/\.(js|css|png|jpg|svg|woff2?|ttf)$/);

  if (isAsset) {
    // Cache-first: serve from cache, update in background
    e.respondWith(
      caches.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        });
        return cached || network;
      })
    );
  } else {
    // Network-first: try network, fall back to cache
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match("/")))
    );
  }
});
