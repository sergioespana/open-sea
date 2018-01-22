import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import { Link, NavLink, Redirect, Switch } from 'react-router-dom';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import OrganisationSettingsAccess from './access';
import OrganisationSettingsDetails from './details';
import Route from 'components/Route';
import Sidenav from 'components/Sidenav';

const OrganisationSettings = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<Fragment>
			<Helmet title={`${organisation.name} / Settings`} />
			<Header>
				<Breadcrumbs>
					<Link to={`/${orgId}`}>{ organisation.name }</Link>
				</Breadcrumbs>
				<h1>Settings</h1>
			</Header>
			<Container flex>
				<Sidenav>
					<h3>General</h3>
					<NavLink to={`/${orgId}/settings/details`} exact>Organisation details</NavLink>
					<NavLink to={`/${orgId}/settings/access`} exact>User and group access</NavLink>
					<h3>Advanced</h3>
					<NavLink to={`/${orgId}/settings/export`} exact>Export data</NavLink>
					<NavLink to={`/${orgId}/settings/delete`} exact>Delete organisation</NavLink>
				</Sidenav>
				<Container>
					<Switch>
						<Redirect from={`/${orgId}/settings`} exact to={`/${orgId}/settings/details`} replace />
						<Route path="/:orgId/settings/details" component={OrganisationSettingsDetails} />
						<Route path="/:orgId/settings/access" component={OrganisationSettingsAccess} />
						<Route path="/:orgId/settings/export" />
						<Route path="/:orgId/settings/delete" />
					</Switch>
				</Container>
			</Container>
		</Fragment>
	);
}));

export default OrganisationSettings;