var version = 0
var cacheName = "restaurant-cache-" + version;

this.addEventListener('fetch', event => {
    var request = event.request;
    event.respondWith(
        fetch(request)
        .then(async function(response) {
            const cache = await caches.open(cacheName);
            cache.put(request.url, response.clone());
            return response;
        }).catch(error => {
            return caches.match(request.url);
        })
    );
});