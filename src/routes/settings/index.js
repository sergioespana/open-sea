import { h } from 'preact';
import { Switch } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import Main from '../../components/Main';

import Dashboard from './dashboard';
import Profile from './profile';

const Account = () => (
	<Main>
		<Switch>
			<PrivateRoute path="/settings/profile" component={Profile} />
			<PrivateRoute path="/settings" component={Dashboard} />
		</Switch>
	</Main>
);

export default Account;