// Offline shell: serve from cache, refresh in the background. Prices live in the page's own storage, never here.
const C = "grocery-director-v1", SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((r) => { if (r.ok) caches.open(C).then((c) => c.put(e.request, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
