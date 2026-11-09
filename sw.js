const CACHE = 'money-lab-v2.1.4';
const SHELL = [
  './', './index.html', './style.css', './app.mjs', './split-studio.js', './core.mjs',
  './storage.mjs', './excel.mjs', './excel-worker.js',
  './vendor/exceljs.min.js', './manifest.webmanifest', './icon.svg',
  './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(async cache => {
      // An optional asset must not prevent the app from installing.
      await Promise.allSettled(SHELL.map(url => cache.add(url)));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('money-lab-') && key !== CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE);
        return (await cache.match(request)) ||
          (await cache.match('./index.html')) ||
          Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') {
    event.waitUntil(self.skipWaiting());
  }
});
