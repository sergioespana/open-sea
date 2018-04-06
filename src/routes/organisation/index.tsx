import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../components/Redirect';
import { Route } from '../../components/Route';
import OrganisationOverview from './overview';
import OrganisationReportRoutes from './report';
import OrganisationReports from './reports';
import OrganisationSettingsRoutes from './settings';

const OrganisationRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	if (!organisation) return <Redirect to="/dashboard/organisations" />;

	return (
		<Switch>
			<Route path="/:orgId" exact component={OrganisationOverview} />
			<Route path="/:orgId/overview" exact component={OrganisationOverview} />
			<Route path="/:orgId/reports" exact component={OrganisationReports} />
			<Route path="/:orgId/settings" component={OrganisationSettingsRoutes} />
			<Route path="/:orgId/:repId" component={OrganisationReportRoutes} />
		</Switch>
	);
}));

export default OrganisationRoutes;
