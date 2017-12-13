import * as stores from './stores';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import React, { Component } from 'react';
import CenterProgress from './components/CenterProgress';
import Drawer from 'components/Drawer';
import Dropzone from 'components/Dropzone';
import Header from 'components/Header';
import Home from 'routes';
import Login from 'routes/login';
import Logout from 'routes/logout';
import New from 'routes/new';
import Organisation from 'routes/organisation';
import PrivateRoute from 'components/PrivateRoute';
import Settings from 'routes/settings';
import Signup from 'routes/signup';
import Snackbar from 'components/Snackbar';
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
						<Dropzone id="app">
							<Header />
							<Drawer />

							{ stores.AuthStore.loading ? (
								<CenterProgress />
							) : (
								<Switch>
									<Route path="/login" exact component={Login} />
									<Route path="/logout" exact component={Logout} />
									<Route path="/signup" exact component={Signup} />

									<Route path="/contact" exact />
									<Route path="/about" />

									<PrivateRoute path="/" exact component={Home} />
									<PrivateRoute path="/new" exact component={New} />
									<PrivateRoute path="/settings" component={Settings} />
									<Route path="/:id" component={Organisation} />
								</Switch>
							) }

							<Snackbar />
						</Dropzone>
					</BrowserRouter>
				</ThemeProvider>
			</Provider>
		);
	}
}

export default observer(App);