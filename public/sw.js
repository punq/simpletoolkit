// Simple Toolkit Service Worker (MVP offline + cache)
// Caches static assets and critical routes for faster repeat loads.
// Privacy: does NOT cache user PDFs (handled in-memory only).

const VERSION = 'v1';
const CORE_ASSETS = [
  '/',
  '/tools',
  '/tools/merge',
  '/tools/split',
  '/tools/rearrange',
  '/tools/compress',
  '/globals.css',
  '/site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(CORE_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first for pages, cache-first for static assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Avoid caching POST/PUT/etc.
  if (request.method !== 'GET') return;

  // Skip PDF blobs / downloads to avoid storing user files
  if (request.destination === 'document' && url.pathname.endsWith('.pdf')) return;

  // Strategy selection
  const isPage = request.mode === 'navigate';
  const cacheName = VERSION;

  if (isPage) {
    // Network-first with fallback to cache
    event.respondWith(
      fetch(request)
        .then(resp => {
          const copy = resp.clone();
          caches.open(cacheName).then(c => c.put(request, copy));
          return resp;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/'))) // fallback to home
    );
    return;
  }

  // Cache-first for static resources
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(resp => {
        // Only cache successful basic responses
        if (resp.ok && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(cacheName).then(c => c.put(request, copy));
        }
        return resp;
      }).catch(() => cached); // if network fails and nothing cached
    })
  );
});
