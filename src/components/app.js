import { h } from 'preact';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import * as stores from '../stores';

// Components
import Header from './Header';
import Drawer from './Drawer';
import Sidebar from './Sidebar';
import Snackbar from './Snackbar';
import Dialog from './Dialog';
import CircularProgress from './CircularProgress';

// Routes
import Login from '../routes/login';
import Signup from '../routes/signup';
import Logout from '../routes/logout';
import Home from '../routes';
import Settings from '../routes/settings';
import Organisation from '../routes/organisation';

const Container = styled.div`
	min-height: 100vh;
`;

const App = () => (
	<Provider {...stores}>
		<Router>
			<Container id="app">
				<Header />
				<Drawer />
				<Sidebar />
				{ stores.AppStore.isLoading ? (
					<CircularProgress centerParent />
				) : (
					<Switch>
						<Route path="/login" exact component={Login} />
						<Route path="/signup" exact component={Signup} />
						<Route path="/logout" exact component={Logout} />

						<Route path="/" exact component={Home} />
						<Route path="/organisation/:id" component={Organisation} />
						<Route path="/settings" component={Settings} />
					</Switch>
				) }
				<Snackbar />
				<Dialog />
			</Container>
		</Router>
	</Provider>
);

export default observer(App);