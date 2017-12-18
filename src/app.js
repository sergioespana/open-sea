import * as stores from './stores';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import Main from 'routes';
import Product from 'routes/product';
import theme from './theme';
import ThemeProvider from 'material-styled-components/theme/ThemeProvider';

class App extends Component {

	onNetworkStateChanged = () => {
		const online = navigator.onLine;
		if (!online) stores.SnackbarStore.show('No internet connection', 0);
		else stores.SnackbarStore.hide();
	}

	componentWillMount() {
		window.addEventListener('online', this.onNetworkStateChanged);
		window.addEventListener('offline', this.onNetworkStateChanged);
	}
	
	componentWillUnmount() {
		window.removeEventListener('online', this.onNetworkStateChanged);
		window.removeEventListener('offline', this.onNetworkStateChanged);
	}
	
	render() {
		return (
			<Provider {...stores}>
				<ThemeProvider theme={theme}>
					<BrowserRouter>
						<div id="app">
							<Switch>
								<Route path="/product" component={Product} />
								<Route path="/" component={Main} />
							</Switch>
						</div>
					</BrowserRouter>
				</ThemeProvider>
			</Provider>
		);
	}
}

export default observer(App);