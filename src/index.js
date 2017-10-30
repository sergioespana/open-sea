import './style';
import 'linkstate/polyfill';

import { h } from 'preact';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import store from './stores';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

// Components
import App from './components/App';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Snackbar, { SnackbarAction } from './components/Snackbar';

// Routes
import Signup from './routes/signup';
import Login from './routes/login';
import Logout from './routes/logout';
import Home from './routes';
import Organisation from './routes/organisation';

const SEAMan = () => store.appIsLoading ? (
	<h1>Loading...</h1>
) : (
	<Provider store={store}>
		<Router>
			<App id="app">
				<Route path="/:org?" component={Header} />
				<Route path="/:org?" component={Drawer} />
				
				<Switch>
					<PublicRoute path="/signup" component={Signup} />
					<PublicRoute path="/login" component={Login} />

					<Route path="/logout" component={Logout} />

					<PrivateRoute path="/" exact component={Home} />

					<Route path="/:org" component={Organisation} />
				</Switch>

				<Snackbar />
			</App>
		</Router>
	</Provider>
);

export default observer(SEAMan);