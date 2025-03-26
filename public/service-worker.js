const CACHE_NAME = "my-nextjs-pwa-cache";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/acounts_icon.png",
  "/addNewExpense",
  "/edit/${yearlyData.year}",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
