// Service Worker Registrierung
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(reg => console.log("✅ Service Worker registriert:", reg.scope))
    .catch(err => console.error("❌ Service Worker Fehler:", err));
}

console.log("PWA läuft 🎉");

function openNav() {
  document.getElementById("mySidenav").style.width = "200px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// Optional: Aktiven Menüpunkt automatisch markieren
document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop();
  document.querySelectorAll(".navbar a, .dropdown-content a").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
});

