var version = 0
var cacheName = "restaurant-cache-" + version;
//var urls = ['service-worker.js'];

// var urls = [
//     'css/responsive.css',
//     'service-worker.js'
// ]


// this.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(cacheName).then(function(cache) {
//             return cache.addAll(urls);
//         })
//     );
// });


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