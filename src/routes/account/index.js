import { h } from 'preact';
import { Route, Switch } from 'react-router-dom';
import PublicRoute from '../../components/PublicRoute';
import PrivateRoute from '../../components/PrivateRoute';
import Main from '../../components/Main';

import Dashboard from './dashboard';
import Create from './create';
import Login from './login';
import Logout from './logout';

const Account = () => (
	<Main>
		<Switch>
			<PrivateRoute path="/account" exact component={Dashboard} />
			<PublicRoute path="/account/create" component={Create} />
			<PublicRoute path="/account/login" component={Login} />
			<Route path="/account/logout" component={Logout} />
		</Switch>
	</Main>
);

export default Account;