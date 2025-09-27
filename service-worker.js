const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/minimal-pwa/index.html",
  "/minimal-pwa/page1.html",
  "/minimal-pwa/page2.html",
  "/minimal-pwa/page3.html",
  "/minimal-pwa/style.css",
  "/minimal-pwa/app.js",
  "/minimal-pwa/offline.html",
  "/minimal-pwa/icon-192.png",
  "/minimal-pwa/icon-512.png"
];

// Install Event → Cache anlegen
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate Event → alte Caches löschen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event → Network-first für HTML, Cache-first für andere Ressourcen
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    // HTML-Seiten: Network-first, fallback offline.html
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then(response => {
          return response || caches.match("/minimal-pwa/offline.html");
        });
      })
    );
  } else {
    // CSS, JS, Icons: Cache-first
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
