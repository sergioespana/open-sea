import { h } from 'preact';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import store from '../stores';
import PrivateRoute from './PrivateRoute';

// Components
import Header from './Header';
import Snackbar from './Snackbar';
import CircularProgress from './CircularProgress';

// Routes
import Home from '../routes';
import Account from '../routes/account';
import Organisation from '../routes/organisation';

const Container = styled.div`
	min-height: 100vh;
`;

const App = () => (
	<Provider store={store}>
		<Router>
			<Container id="app">
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
			</Container>
		</Router>
	</Provider>
);

export default observer(App);