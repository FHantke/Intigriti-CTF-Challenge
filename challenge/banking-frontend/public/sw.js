const searchParams = new URLSearchParams(location.search);
let lng = searchParams.get('lng');
self.importScripts(`/${lng}.js`);

// This is just a simple service worker example
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/home'
      ]);
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
