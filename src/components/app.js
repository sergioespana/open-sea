import { h } from 'preact';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import * as stores from '../stores';
import PrivateRoute from './PrivateRoute';

// Components
import Header from './Header';
import Snackbar from './Snackbar';
import Dialog from './Dialog';
import CircularProgress from './CircularProgress';

// Routes
import Home from '../routes';
import Account from '../routes/account';
import Organisation from '../routes/organisation';

const Container = styled.div`
	min-height: 100vh;
`;

const App = () => (
	<Provider {...stores}>
		<Router>
			<Container id="app">
				<Header />
				{ stores.AppStore.isLoading ? (
					<CircularProgress centerParent />
				) : (
					<Switch>
						<PrivateRoute path="/" exact component={Home} />
						<Route path="/account" component={Account} />
						<Route path="/organisation/:id" component={Organisation} />
					</Switch>
				) }
				<Snackbar />
				<Dialog />
			</Container>
		</Router>
	</Provider>
);

export default observer(App);