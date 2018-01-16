import React from 'react';
import Route from 'components/Route';
import { Switch } from 'react-router-dom';

const OrganisationReportRoutes = () => (
	<Switch>
		<Route path="/:orgId/:repId" exact />
		<Route path="/:orgId/:repId/data" exact />
		<Route path="/:orgId/:repId/export" exact />
	</Switch>
);

export default OrganisationReportRoutes;