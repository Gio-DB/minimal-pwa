const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/minimal-pwa/index.html",
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

// Fetch Event → Cache-first Strategie
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Wenn im Cache → zurückgeben
      if (cachedResponse) return cachedResponse;

      // Wenn nicht → Netzwerk abrufen
      return fetch(event.request).catch(() => {
        // Bei Navigation offline.html zurückgeben
        if (event.request.mode === "navigate") {
          return caches.match("/minimal-pwa/offline.html");
        }
      });
    })
  );
});
