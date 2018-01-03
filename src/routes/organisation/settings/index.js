import { inject, observer } from 'mobx-react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SideList, { Group, Heading, ListItem } from 'components/SideList';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Details from './details';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import Main from 'components/Main';
import React from 'react';

const Settings = inject(app('OrganisationsStore'))(observer(({ OrganisationsStore, match: { params: { id } } }) => {
	const organisation = OrganisationsStore.findById(id);
	return (
		<Main>
			<Helmet title={`${organisation.name} / settings`} />
			<Header title="Settings" />
			<Container flex>
				<SideList>
					<Heading>General</Heading>
					<Group>
						<ListItem to={`/${id}/settings/details`}>Organisation details</ListItem>
						<ListItem to={`/${id}/settings/access`}>User and group access</ListItem>
					</Group>
					<Heading>Advanced</Heading>
					<Group>
						<ListItem to={`/${id}/settings/export`}>Export reports and data</ListItem>
						<ListItem to={`/${id}/settings/delete`}>Delete organisation</ListItem>
					</Group>
				</SideList>
				<Switch>
					<Redirect from={`/${id}/settings`} exact to={`/${id}/settings/details`} />
					<Route path="/:id/settings/details" component={Details} />
					<Route path="/:id/settings/access" />
				</Switch>
			</Container>
		</Main>
	);
}));

export default Settings;