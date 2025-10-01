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
  "/minimal-pwa/icon-512.png",
  "/minimal-pwa/2_nomen.html",
  "/minimal-pwa/1_subjekt.html",
  "/minimal-pwa/3_attribut.html",
  "/minimal-pwa/nav.html"
];

// Install Event → Cache anlegen
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate Event → alte Caches löschen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    // Network-first Strategie für HTML-Seiten
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(res => res || caches.match("/minimal-pwa/offline.html"))
        )
    );
  } else {
    // Stale-while-revalidate für statische Ressourcen
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, networkResponse.clone())
          );
          return networkResponse;
        });
        return cached || fetchPromise;
      })
    );
  }
});
