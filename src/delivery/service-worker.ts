const PRECACHE = "REPLACE_IN_BUILD_STEP";
const RUNTIME = "REPLACE_IN_BUILD_STEP";
const COMPLETED_LEVELS_ENDPOINT = "/completedLevels";
const CURRENT_LEVEL_ENDPOINT = "/currentLevel";
const cachesNotToDelete = [PRECACHE, COMPLETED_LEVELS_ENDPOINT, CURRENT_LEVEL_ENDPOINT];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(cache => {
        return cache.addAll([
          "/index.html",
          "/styles/styles.css",
          "/vendor/doorbell.js",
          "/app.js",
          "/favicon.ico",
          "/assets/how-to-play.gif",
          "/assets/min-selection-info.gif",
        ]);
      })
      .then(() => {
        // Force the SW to transition from installing -> active state
        return (self as any).skipWaiting();
      }),
  );
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        const cachesToDelete = cacheNames.filter(name => cachesNotToDelete.indexOf(name) === -1);
        return Promise.all(cachesToDelete.map(name => caches.delete(name)));
      })
      .then(() => {
        return (self as any).clients.claim();
      }),
  );
});

function cachedEndpoint(event: any, cacheName: string, defaultReponse: string): Response | void {
  if (event.request.method === "POST") {
    event.request.json().then((body: any) => {
      caches.open(cacheName).then(cache => {
        cache.put(cacheName, new Response(JSON.stringify(body)));
      });
    });
    return new Response("{}");
  } else {
    event.respondWith(
      caches.open(cacheName).then(cache => {
        return (
          cache.match(cacheName).then(response => {
            return response || new Response(defaultReponse);
          }) || new Response(defaultReponse)
        );
      }),
    );
  }
}

self.addEventListener("fetch", (event: any) => {
  const { request } = event;

  if (request.url.match(CURRENT_LEVEL_ENDPOINT)) {
    cachedEndpoint(event, CURRENT_LEVEL_ENDPOINT, "");
  } else if (request.url.match(COMPLETED_LEVELS_ENDPOINT)) {
    cachedEndpoint(event, COMPLETED_LEVELS_ENDPOINT, "[]");
  } else if (request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(request, response.clone()).then(() => {
              return response;
            });
          });
        });
      }),
    );
  }
});
