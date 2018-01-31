import App from './app';
import { injectGlobal } from 'styled-components';
import React from 'react';
import ReactDOM from 'react-dom';

injectGlobal`
	@page {
        size:  auto;
        margin: 0mm;
    }

	html, body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
		font-size: 14px;
		line-height: normal;
		margin: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-print-color-adjust: exact;
	}

	*,
	*:before,
	*:after {
		box-sizing: border-box;
	}

	*:focus {
		outline: 0;
	}
`;

ReactDOM.render(<App />, document.body);

if (module.hot) module.hot.accept();

if (process.env.NODE_ENV !== 'development' && 'serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		// eslint-disable-next-line compat/compat
		const registration = await navigator.serviceWorker.register('/sw.js').catch((error) => false);
		if (!registration) return;

		// Immediately activate a waiting Service Worker on page load.
		if (registration.waiting) registration.waiting.postMessage('skipWaiting');

		// Listen for updates, then set a variable when one is ready to be activated. Upon relead,
		// this function will load again and the new Service Worker will be activated.
		registration.addEventListener('updatefound', () => {
			const sw = registration.installing;
			sw.addEventListener('statechange', () => {
				if (sw.state === 'waiting') return window.swHasUpdated = true;
				return window.swHasUpdated = false;
			});
		});
	});
}