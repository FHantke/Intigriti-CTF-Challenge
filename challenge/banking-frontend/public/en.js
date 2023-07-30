self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function(error) {
      // We are still working on this function...
      return "You are offline right now";
    })
  );
});