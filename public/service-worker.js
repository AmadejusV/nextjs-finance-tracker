const CACHE_NAME = "my-nextjs-pwa-cache";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/accounts_icon.png",
  "/addNewExpense",
  "/edit/[year]",
];

self.addEventListener("install", (event) => {
  console.log("adding install listener");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("adding", { cache });
      return await cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache:", error);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("adding fetch listener");
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
