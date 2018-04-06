import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../components/Redirect/index';
import { Route } from '../../components/Route/index';
import AccountResetPassword from './reset-password';
import AccountSignin from './signin';
import AccountSignout from './signout';
import AccountSignup from './signup';

const AccountRoutes = () => (
	<Switch>
		<Route path="/account/reset-password" exact component={AccountResetPassword} unauthedOnly />
		<Route path="/account/signin" exact component={AccountSignin} unauthedOnly />
		<Route path="/account/signout" exact component={AccountSignout} authedOnly />
		<Route path="/account/signup" exact component={AccountSignup} unauthedOnly />
		<Redirect from="*" to="/" />
	</Switch>
);

export default AccountRoutes;
