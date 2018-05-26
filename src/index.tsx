import createHistory from 'history/createBrowserHistory';
import { createStore } from 'mobx-app';
import { Provider } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import MdInfoOutline from 'react-icons/lib/md/info-outline';
import App from './app';
import * as stores from './stores/index';

export const history = createHistory();

const providerProps = createStore(stores);

const onWindowLoad = () => {
	navigator.serviceWorker.register('/sw.js')
		.then((registration) => {
			registration.onupdatefound = () => {
				const { installing } = registration;
				if (installing) installing.onstatechange = () => {
					if (installing.state === 'installed' && navigator.serviceWorker.controller) {
						const { UIStore } = providerProps.actions;
						UIStore.addFlag({
							appearance: 'normal',
							actions: [{
								label: 'Refresh now',
								onClick: () => window.location.reload()
							}, {
								label: 'Remind me later'
							}],
							icon: <MdInfoOutline />,
							title: 'openSEA was updated',
							description: 'An update for openSEA was downloaded in the background. Refresh to get access.'
						});
					}
				};
			};
		})
		.catch((error) => console.warn(`Couldn't register SW:`, error));
};

ReactDOM.render(<Provider {...providerProps}><App /></Provider>, document.body);

if ('serviceWorker' in navigator) window.addEventListener('load', onWindowLoad);
