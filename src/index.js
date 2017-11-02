import './style';
import 'linkstate/polyfill';

import { h } from 'preact';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import store from './stores';
import PrivateRoute from './components/PrivateRoute';

// Components
import App from './components/App';
import Header from './components/Header';
import Snackbar from './components/Snackbar';
import CircularProgress from './components/CircularProgress';

// Routes
import Home from './routes';
import Account from './routes/account';
import Organisation from './routes/organisation';

const SEAMan = () => (
	<Provider store={store}>
		<Router>
			<App id="app">
				<Header />
				{ store.appIsLoading ? (
					<CircularProgress centerParent />
				) : (
					<Switch>
						<PrivateRoute path="/" exact component={Home} />
						<Route path="/account" component={Account} />
						<Route path="/:org" component={Organisation} />
					</Switch>
				) }
				<Snackbar />
			</App>
		</Router>
	</Provider>
);

export default observer(SEAMan);