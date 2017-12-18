import { Redirect, Route, Switch } from 'react-router-dom';
import SideList, { Group, Heading, ListItem } from 'components/SideList';
import Container from 'components/Container';
import Header from 'components/Header';
import Login from './login';
import Logout from './logout';
import Main from 'components/Main';
import PrivateRoute from 'components/PrivateRoute';
import Profile from './profile';
import React from 'react';
import Signup from './signup';

const Account = () => (
	<Main>
		<Header title="Settings" />
		<Container flex>
			<SideList>
				<Heading>General</Heading>
				<Group>
					<ListItem to="/account/profile">Account settings</ListItem>
					<ListItem to="/account/notifications">Notifications</ListItem>
				</Group>
				<Heading>Security</Heading>
				<Group>
					<ListItem to="/account/sessions">Sessions</ListItem>
				</Group>
				<Heading>Integrations and features</Heading>
				<Group>
					<ListItem to="/account/find-integrations">Find integrations</ListItem>
					<ListItem to="/account/manage-integration">Manage integrations</ListItem>
				</Group>
			</SideList>
			<Switch>
				<Redirect from="/account" exact to="/account/profile" replace />
				<PrivateRoute path="/account/profile" component={Profile} />
				<PrivateRoute path="/account/notifications" />
				<PrivateRoute path="/account/sessions" />
				<PrivateRoute path="/account/find-integrations" />
				<PrivateRoute path="/account/manage-integrations" />

				<Route path="/account/logout" component={Logout} />
				<Route path="/account/signin" component={Login} />
				<Route path="/account/signup" component={Signup} />
			</Switch>
		</Container>
	</Main>
);

export default Account;