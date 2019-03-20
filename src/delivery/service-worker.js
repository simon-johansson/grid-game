const PRECACHE = "REPLACE_IN_BUILD_STEP";
const RUNTIME = "REPLACE_IN_BUILD_STEP";

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(function(cache) {
        return cache.addAll([
          "/index.html",
          "/styles/styles.css",
          "/vendor/doorbell.js",
          "/app.js",
          "/favicon.ico",
        ]);
      })
      .then(function() {
        // Force the SW to transition from installing -> active state
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function(event) {
  event
    .waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== PRECACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    )
    .then(function() {
      return self.clients.claim();
    });
});

self.addEventListener("fetch", function(e) {
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(e.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(e.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
