import { h } from 'preact';
import { Route, Switch } from 'react-router-dom';
import Main from '../../components/Main';

import Dashboard from './dashboard';
import Profile from './profile';

const Account = () => (
	<Main>
		<Switch>
			<Route path="/settings/profile" component={Profile} />
			<Route path="/settings" component={Dashboard} />
		</Switch>
	</Main>
);

export default Account;