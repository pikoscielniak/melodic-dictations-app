// Auto-generated service worker. Do not edit directly.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('mdict-cache-v1-2def3b0e').then((cache) => cache.addAll(["/index.html","/bundle.js","/styles.css","/favicon.png","/manifest.webmanifest","https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1"]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k === 'mdict-cache-v1-2def3b0e' ? undefined : caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Bypass non-GET
  if (req.method !== 'GET') return;

  // Network-then-cache for magenta CDN to keep it fresh, fallback to cache
  const url = new URL(req.url);
  if (url.hostname.includes('cdn.jsdelivr.net') || (url.hostname.endsWith('storage.googleapis.com') && url.pathname.includes('/magentadata/'))) {
    event.respondWith(
      fetch(req).then((res) => {
        const resClone = res.clone();
        caches.open('mdict-cache-v1-2def3b0e').then((c) => c.put(req, resClone)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for app shell & assets
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const resClone = res.clone();
      caches.open('mdict-cache-v1-2def3b0e').then((c) => c.put(req, resClone)).catch(() => {});
      return res;
    }).catch(() => {
      // Offline fallback to index for navigation requests
      if (req.mode === 'navigate') return caches.match('/index.html');
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }))
  );
});
