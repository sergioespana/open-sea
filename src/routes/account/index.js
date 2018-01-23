import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import AccountLogout from './logout';
import AccountProfile from './profile';
import AccountSignIn from './signin';
import AccountSignUp from './signup';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Header from 'components/Header';
import { NavLink as Link } from 'components/Link';
import Route from 'components/Route';
import Sidenav from 'components/Sidenav';

const AccountNavigation = () => (
	<Sidenav>
		<Link to="/account/profile">Profile</Link>
		<Link to="/account/notifications">Notifications</Link>
		<Link to="/account/logout">Sign out</Link>
	</Sidenav>
);

const AccountAuthenticationRoutes = () => (
	<Switch>
		<Route path="/account/signin" exact component={AccountSignIn} unauthedOnly />
		<Route path="/account/signup" exact component={AccountSignUp} unauthedOnly />
		<Route path="/account/logout" exact component={AccountLogout} authedOnly />
	</Switch>
);

const AccountMainRoutes = () => (
	<Fragment>
		<Header>
			<h1>Account</h1>
		</Header>
		<Container flex>
			<AccountNavigation />
			<Container>
				<Switch>
					<Redirect from="/account" exact to="/account/profile" replace />
					<Route path="/account/profile" exact component={AccountProfile} authedOnly />
				</Switch>
			</Container>
		</Container>
	</Fragment>
);

const AccountRoutes = inject(app('state'))(observer((props) => {
	const { state } = props;
	const { loading } = state;

	if (loading) return (
		<main>
			<Switch>
				<Route path="/account/(signin|signup|logout)" component={AccountAuthenticationRoutes} />
			</Switch>
		</main>
	);

	return (
		<main>
			<Switch>
				<Route path="/account/(signin|signup|logout)" component={AccountAuthenticationRoutes} />
				<Route path="*" component={AccountMainRoutes} />
			</Switch>
		</main>
	);
}));

export default AccountRoutes;