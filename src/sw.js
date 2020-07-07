import { precacheAndRoute } from 'workbox-precaching';
import { skipWaiting, clientsClaim } from 'workbox-core';

// pre-cache bundled resources
precacheAndRoute(self.__WB_MANIFEST || []);
skipWaiting();
clientsClaim();

// respond to fetch event with cached content
self.addEventListener('fetch', (event) => {
    console.log('fetch: ', event);

    event.respondWith(
        caches.match(event.request).then((response) => {
            console.log('matched: ', response);
            return response || fetch(event.request);
        })
    );
});
