// Self-destructing service worker - unregisters itself
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.map(n => caches.delete(n))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll()).then(clients => {
      clients.forEach(c => c.postMessage({type:'SW_KILLED'}));
    })
    .then(() => self.registration.unregister())
  );
});
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));
