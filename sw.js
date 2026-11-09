const CACHE='money-lab-v2.1.0';
const SHELL=['./','./index.html','./style.css','./app.mjs','./core.mjs','./storage.mjs','./excel.mjs','./excel-worker.js','./vendor/exceljs.min.js','./manifest.webmanifest','./icon.svg','./icons/apple-touch-icon.png','./icons/apple-touch-icon.png?v=2.1.0','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('money-lab-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(e.request);if(hit)return hit;if(e.request.mode==='navigate'){const shell=await cache.match('./index.html');if(shell)return shell;}return fetch(e.request);})());});

self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE_UPDATE')e.waitUntil(self.skipWaiting());});
