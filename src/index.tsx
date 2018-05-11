import createHistory from 'history/createBrowserHistory';
import { createStore } from 'mobx-app';
import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import * as stores from './stores/index';

export const history = createHistory();

const providerProps = createStore(stores);

const onWindowLoad = () => {
	navigator.serviceWorker.register('/sw.js')
		.then((registration) => registration.waiting && registration.waiting.postMessage('skipWaiting'))
		.catch((error) => console.warn(`Couldn't register SW:`, error));
};

ReactDOM.render(<Provider {...providerProps}><App /></Provider>, document.body);

if ('serviceWorker' in navigator) window.addEventListener('load', onWindowLoad);
