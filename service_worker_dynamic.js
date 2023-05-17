const DYNAMIC_CACHE_VERSION = "dynamicV1";

const OFFLINE_CACHE_NAME = "offline";
const OFFLINE_PAGE_URL = "offline.html";
    
self.addEventListener("install", e => {
    console.log("Service Worker installed");

    e.waitUntil(
        caches
            .open(OFFLINE_CACHE_NAME)
            .then(cache => {
                cache.add(new Request(OFFLINE_PAGE_URL, {cache: 'reload'}));
            })
            // .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", e => {
    console.log("Service Worker activated");

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== DYNAMIC_CACHE_VERSION && cache !== OFFLINE_CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            )
        })
            // .then(() => clients.claim())
    )
});

self.addEventListener("fetch", e => {
    console.log("Service worker fetching");

    e.respondWith((async () => {
        try {
            const response = await fetch(e.request);
            const clone = response.clone();

            const dynamicCache = await caches.open(DYNAMIC_CACHE_VERSION);
            await dynamicCache.put(e.request, clone)

            return response;
        } catch (error) {
            const cache = await caches.open(DYNAMIC_CACHE_VERSION);
            const cachedResponse = await cache.match(e.request);

            if (cachedResponse) {
                return cachedResponse;
            }

            const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
            const offlineResponse = await offlineCache.match(OFFLINE_PAGE_URL);

            return offlineResponse;
        }
    })());
});