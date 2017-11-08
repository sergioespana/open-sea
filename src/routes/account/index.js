import { h } from 'preact';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import Main from '../../components/Main';

import Dashboard from './dashboard';
import Profile from './profile';

const Account = () => (
	<Main>
		<Switch>
			<Route path="/account/profile" component={Profile} />
			<PrivateRoute path="/account" component={Dashboard} />
		</Switch>
	</Main>
);

export default Account;