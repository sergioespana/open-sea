import * as stores from './stores';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import { createStore } from 'mobx-app';
import Dropzone from 'components/Dropzone';
import Main from 'routes';
import Product from 'routes/product';
import theme from './theme';
import ThemeProvider from 'material-styled-components/theme/ThemeProvider';

const { state, actions } = createStore(stores);

@observer
class App extends Component {

	onNetworkStateChanged = () => {
		const online = navigator.onLine;
		// TODO: Display a message.
		console.info(`Only status changed to: ${online ? 'online' : 'offline'}`);
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
			<Provider actions={actions} state={state}>
				<ThemeProvider theme={theme}>
					<BrowserRouter>
						<Dropzone id="app">
							<Switch>
								<Route path="/product" component={Product} />
								<Route path="/" component={Main} />
							</Switch>
						</Dropzone>
					</BrowserRouter>
				</ThemeProvider>
			</Provider>
		);
	}
}

export default App;