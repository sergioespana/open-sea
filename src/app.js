import * as stores from './stores';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { injectGlobal, ThemeProvider } from 'styled-components';
import { createStore } from 'mobx-app';
import MainApp from 'routes';
import Product from 'routes/product';
import { Provider } from 'mobx-react';
import React from 'react';
import theme from './theme';

const { state, actions } = createStore(stores);

const App = () => (
	<Provider actions={actions} state={state}>
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Switch>
					<Route path="/product" component={Product} />
					<Route path="*" component={MainApp} />
				</Switch>
			</BrowserRouter>
		</ThemeProvider>
	</Provider>
);

injectGlobal`
	html, body {
		color: ${theme.text.primary};
	}

	#app {
		display: flex;
		min-width: 1024px;
		min-height: 100vh;

		main {
			flex: auto;
		}
	}

	a {
		color: #0052CC;
		text-decoration: none;
		font-size: 0.875rem;
		
		:hover {
			cursor: pointer;
			color: #0065FF;
			text-decoration: underline;
		}
	}

	p {
		font-size: 0.875rem;
	}
`;

export default App;