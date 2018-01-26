import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import NetworkOrganisations from './network/organisations';
import NetworkOverview from './network/overview';
import OrganisationDownloads from './downloads';
import OrganisationOverview from './overview';
import OrganisationReportRoutes from './report';
import OrganisationReports from './reports';
import OrganisationSettings from './settings';
import React from 'react';
import Route from 'components/Route';
import { Switch } from 'react-router-dom';

const OrganisationRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const { isNetwork } = OrganisationsStore.getItem(orgId, '_id');

	if (isNetwork) return (
		<main>
			<Switch>
				<Route path="/:orgId" exact component={NetworkOverview} />
				<Route path="/:orgId/overview" exact component={NetworkOverview} />
				<Route path="/:orgId/organisations" exact component={NetworkOrganisations} />
				<Route path="/:orgId/compare" exact />
				<Route path="/:orgId/compare/:orgs+" />
				<Route path="/:orgId/settings" />
			</Switch>
		</main>
	);

	return (
		<main>
			<Switch>
				<Route path="/:orgId" exact component={OrganisationOverview} />
				<Route path="/:orgId/overview" exact component={OrganisationOverview} />
				<Route path="/:orgId/reports" exact component={OrganisationReports} />
				<Route path="/:orgId/downloads" exact component={OrganisationDownloads} />
				<Route path="/:orgId/settings" component={OrganisationSettings} />
				<Route path="/:orgId/:repId" component={OrganisationReportRoutes} />
			</Switch>
		</main>
	);
}));

export default OrganisationRoutes;