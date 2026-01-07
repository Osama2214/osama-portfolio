const STATIC_CACHE = 'static-v1';
const IMAGE_CACHE = 'images-v1';

// ملفات ثابتة آمنة للكاش
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.ico'
];

// install
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (![STATIC_CACHE, IMAGE_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// fetch
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  //  لا تكاش ملفات Vite
  if (url.pathname.startsWith('/assets/')) {
    return;
  }

  //  Images & fonts → Cache First
  if (req.destination === 'image' || req.destination === 'font') {
    event.respondWith(cacheFirst(req));
    return;
  }

  //  HTML → Network First
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  // default
  event.respondWith(fetch(req));
});

// ===== helpers =====

async function cacheFirst(req) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;

  const fresh = await fetch(req);
  cache.put(req, fresh.clone());
  return fresh;
}

async function networkFirst(req) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return cache.match(req);
  }
}
