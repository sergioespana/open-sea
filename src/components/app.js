import { h } from 'preact';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';
import * as stores from '../stores';

// Components
import Header from './Header';

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
				{ stores.AppStore.isLoading ? (
					<h1>Loading...</h1>
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
			</Container>
		</Router>
	</Provider>
);

export default observer(App);