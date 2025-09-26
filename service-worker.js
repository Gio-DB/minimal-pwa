self.addEventListener("install", event => {
  console.log("📥 Service Worker installiert");
});

self.addEventListener("fetch", event => {
  console.log("➡️ Request für:", event.request.url);
});
