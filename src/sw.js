const CACHE_NAME = "vitality-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
];

/**
 * INSTALL EVENT - Cache assets
 */
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Skip waiting para actualizar inmediatamente
  self.skipWaiting();
});

/**
 * ACTIVATE EVENT - Clean up old caches
 */
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim clients para controlar todos los clientes abiertos
  return self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate strategy
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests like Google Auth images or API calls for now to avoid CORS issues in simple SW
  if (
    !event.request.url.startsWith(location.origin) &&
    !ASSETS_TO_CACHE.includes(event.request.url)
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache with new response
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });

      // Return cached response immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

/**
 * MESSAGE EVENT - Handle messages from clients
 */
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case "SHOW_NOTIFICATION":
      showNotification(payload);
      break;
    case "SKIP_WAITING":
      self.skipWaiting();
      break;
    default:
      console.log("Unknown message type:", type);
  }
});

/**
 * PUSH EVENT - Handle push notifications
 */
self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : {
        title: "Vitality",
        body: "Notificación de la app",
        icon: "/icon.png",
      };

  event.waitUntil(showNotification(data));
});

/**
 * NOTIFICATION CLICK EVENT
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "NOTIFICATION_CLICKED",
        payload: event.notification.data,
      });
    });
  });

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow("/");
        }
      })
  );
});

/**
 * NOTIFICATION CLOSE EVENT
 */
self.addEventListener("notificationclose", (event) => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "NOTIFICATION_CLOSED",
        payload: event.notification.data,
      });
    });
  });
});

/**
 * Helper para mostrar notificación
 */
async function showNotification(options) {
  const defaults = {
    icon: "/icon.png",
    badge: "/icon.png",
    tag: "vitality-notification",
  };

  return self.registration.showNotification(options.title, {
    ...defaults,
    ...options,
  });
}
