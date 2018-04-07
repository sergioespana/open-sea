/* eslint-disable no-undef */

workbox.routing.registerRoute(
	new RegExp('https://firebasestorage.googleapis.com'),
	workbox.strategies.staleWhileRevalidate()
);

// self.addEventListener('message', ({ data }) => data === 'skipWaiting' && self.skipWaiting());
