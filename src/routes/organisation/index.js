import OrganisationDownloads from './downloads';
import OrganisationOverview from './overview';
import OrganisationReportRoutes from './report';
import OrganisationReports from './reports';
import OrganisationSettings from './settings';
import React from 'react';
import Route from 'components/Route';
import { Switch } from 'react-router-dom';

const OrganisationRoutes = (props) => (
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

export default OrganisationRoutes;