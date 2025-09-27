const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/minimal-pwa/index.html",
  "/minimal-pwa/style.css",
  "/minimal-pwa/app.js",
  "/minimal-pwa/offline.html"
];

// Install Event → Cache anlegen
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event → zuerst Netzwerk, dann Cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Wenn offline → offline.html anzeigen
      if (event.request.mode === "navigate") {
        return caches.match("/minimal-pwa/offline.html");
      }
    })
  );
});
