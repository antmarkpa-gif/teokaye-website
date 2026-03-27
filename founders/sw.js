// ══════════════════════════════════════════════════════════════════════════════
// TEOKAYE FOUNDERS - SERVICE WORKER
// ══════════════════════════════════════════════════════════════════════════════

const CACHE_NAME = 'founders-v1';
const STATIC_ASSETS = [
  '/founders/app/',
  '/founders/css/founders-app.css',
  '/founders/js/founders-config.js',
  '/founders/js/founders-qr.js',
  '/founders/js/founders-vcard.js',
  '/simbolo.svg'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Supabase API calls (always network)
  if (event.request.url.includes('supabase.co')) return;

  // Skip CDN requests
  if (event.request.url.includes('cdnjs.cloudflare.com')) return;
  if (event.request.url.includes('fonts.googleapis.com')) return;
  if (event.request.url.includes('fonts.gstatic.com')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});
