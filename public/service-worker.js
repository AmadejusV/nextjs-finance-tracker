const generateMockYearUrls = () => {
  const MOCK_START_YEAR = 1975;
  const currentYear = new Date().getFullYear();
  const allowedYears = [];

  for (let i = MOCK_START_YEAR; i <= currentYear; i++) {
    allowedYears.push({ year: `edit/${i.toString()}` });
  }

  return allowedYears;
};

const generatedYearUrls = generateMockYearUrls();
const CACHE_NAME = "my-nextjs-pwa-cache";
const urlsToCache = [
  "",
  "manifest.json",
  "accounts_icon.png",
  "addNewExpense",
  ...generatedYearUrls,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      return await cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache:", error);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
