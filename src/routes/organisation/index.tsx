import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../components/Redirect';
import { Route } from '../../components/Route';
import NetworkOverview from '../network/overview';
import NetworkSettingsRoutes from '../network/settings';
import OrganisationOverview from './overview';
import OrganisationReportRoutes from './report';
import OrganisationReports from './reports';
import OrganisationSettingsRoutes from './settings';

const OrganisationRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	if (!organisation) return <Redirect to="/dashboard/organisations" />;

	if (organisation.isNetwork) return (
		<Switch>
			<Route path="/:netId" exact component={NetworkOverview} />
			<Route path="/:nedId/compare" exact />
			<Route path="/:netId/overview" exact component={NetworkOverview} />
			<Route path="/:netId/settings" component={NetworkSettingsRoutes} />
		</Switch>
	);

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
