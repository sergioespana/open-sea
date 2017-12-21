import { Redirect, Route, Switch } from 'react-router-dom';
import SideList, { Group, Heading, ListItem } from 'components/SideList';
import Container from 'components/Container';
import Header from 'components/Header';
import Main from 'components/Main';
import Profile from './profile';
import React from 'react';

const Account = () => (
	<Main>
		<Header title="Settings" />
		<Container flex>
			<SideList>
				<Heading>General</Heading>
				<Group>
					<ListItem to="/account/profile">Account settings</ListItem>
					<ListItem to="/account/notifications">Notifications</ListItem>
					<ListItem to="/account/logout">Sign out</ListItem>
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
				<Route path="/account/profile" component={Profile} />
				<Route path="/account/notifications" />
				<Route path="/account/sessions" />
				<Route path="/account/find-integrations" />
				<Route path="/account/manage-integrations" />
			</Switch>
		</Container>
	</Main>
);

export default Account;