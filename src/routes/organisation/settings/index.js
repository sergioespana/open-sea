import Header, { Breadcrumbs, Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import { Link, NavLink } from 'components/Link';
import React, { Fragment } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import OrganisationSettingsAccess from './access';
import OrganisationSettingsDetails from './details';
import OrganisationSettingsOrganisations from './organisations';
import Route from 'components/Route';
import Sidenav from 'components/Sidenav';

const OrganisationSettings = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<Fragment>
			<Helmet title={`${organisation.name} / Settings`} />
			<Header>
				<Section>
					<Breadcrumbs>
						<Link to={`/${orgId}`}>{ organisation.name }</Link>
					</Breadcrumbs>
					<h1>Settings</h1>
				</Section>
			</Header>
			<Container flex>
				<Sidenav>
					<h3>General</h3>
					<NavLink to={`/${orgId}/settings/details`} exact>Organisation details</NavLink>
					<NavLink to={`/${orgId}/settings/access`} exact>User and group access</NavLink>
					{ organisation.isNetwork && <NavLink to={`/${orgId}/settings/organisations`} exact>Manage organisations</NavLink> }
					<h3>Advanced</h3>
					<NavLink to={`/${orgId}/settings/export`} exact>Export data</NavLink>
					<NavLink to={`/${orgId}/settings/delete`} exact>Delete organisation</NavLink>
				</Sidenav>
				<Container style={{ flex: 'auto' }}>
					<Switch>
						<Redirect from={`/${orgId}/settings`} exact to={`/${orgId}/settings/details`} replace />
						<Route path="/:orgId/settings/details" component={OrganisationSettingsDetails} />
						<Route path="/:orgId/settings/access" component={OrganisationSettingsAccess} />
						{ organisation.isNetwork && <Route path="/:orgId/settings/organisations" component={OrganisationSettingsOrganisations} /> }
						<Route path="/:orgId/settings/export" />
						<Route path="/:orgId/settings/delete" />
					</Switch>
				</Container>
			</Container>
		</Fragment>
	);
}));

export default OrganisationSettings;