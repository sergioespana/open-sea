// eslint-disable-next-line no-undef
importScripts('workbox-sw.prod.js');

// eslint-disable-next-line no-undef
const workbox = new WorkboxSW({ clientsClaim: true });

workbox.precache([]);

workbox.router.registerRoute(new RegExp('https://firebasestorage.googleapis.com'), workbox.strategies.staleWhileRevalidate());

self.addEventListener('message', ({ data }) => data === 'skipWaiting' && self.skipWaiting());