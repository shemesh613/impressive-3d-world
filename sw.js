const CACHE_NAME = 'tikia-yeruka-v44';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sky_city.jpg',
  './sky_mountains.jpg',
  './sky_desert.jpg',
  './sky_ocean.jpg',
  './sky_forest.jpg',
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
  'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
