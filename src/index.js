import App from './app';
import { font } from 'material-styled-components/mixins/typography';
import { injectGlobal } from 'styled-components';
import React from 'react';
import ReactDOM from 'react-dom';

injectGlobal`
	@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500');

	html, body {
		${ font(400, 16, 20) }
		margin: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	body {
		overflow-y: scroll;
	}

	*,
	*:before,
	*:after {
		box-sizing: border-box;
	}

	#app {
		min-height: 100vh;
	}

	a {
		color: inherit;
		text-decoration: none;
	}
`;

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(registrationError => {
			console.log('SW registration failed: ', registrationError);
		});
	});
}

ReactDOM.render(<App />, document.body);