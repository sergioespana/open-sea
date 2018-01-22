import OrganisationReport from './report';
import OrganisationReportData from './data';
import React from 'react';
import Route from 'components/Route';
import { Switch } from 'react-router-dom';

const OrganisationReportRoutes = () => (
	<Switch>
		<Route path="/:orgId/:repId" exact component={OrganisationReport} />
		<Route path="/:orgId/:repId/data" exact component={OrganisationReportData} />
		<Route path="/:orgId/:repId/export" exact />
	</Switch>
);

export default OrganisationReportRoutes;