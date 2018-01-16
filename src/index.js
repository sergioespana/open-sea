import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import App from './app';
import { injectGlobal } from 'styled-components';
import React from 'react';
import ReactDOM from 'react-dom';

injectGlobal`
	html, body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
		font-size: 16px;
		line-height: normal;
		margin: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
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

OfflinePluginRuntime.install();

ReactDOM.render(<App />, document.body);

if (module.hot) module.hot.accept();