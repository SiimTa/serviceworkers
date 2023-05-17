const cacheVersion = "v1";

const cacheAssets = [
    "index.html",
    "news.html",
    "style.css",
    "main.js"
]

self.addEventListener("install", e => {
    console.log("Service Worker install");
    e.waitUntil(
        caches
            .open(cacheVersion)
            .then(cache => cache.addAll(cacheAssets))
    );
});

self.addEventListener("activate", e => {
    console.log("Service Worker activate");

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheVersion) {
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

self.addEventListener("fetch", e => {
    console.log("Service Worker fetch");
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
});