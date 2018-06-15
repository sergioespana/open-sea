import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import collection from '../../../stores/collection';
import OrganisationReportData from './data';
import OrganisationReportModel from './model';
import OrganisationReportOverview from './report';
import OrganisationReportSettings from './settings';

const OrganisationReportRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.findById(orgId);

	if (!organisation) return <Redirect to="/dashboard/organisations" />;

	const report = collection(organisation._reports).findById(`${orgId}/${repId}`);

	if (!report) return <Redirect to={`/${orgId}/reports`} />;

	return (
		<Switch>
			<Route path="/:orgId/:repId" exact component={OrganisationReportOverview} />
			<Route path="/:orgId/:repId/data" exact component={OrganisationReportData} />
			<Route path="/:orgId/:repId/model" exact component={OrganisationReportModel} />
			<Route path="/:orgId/:repId/settings" exact component={OrganisationReportSettings} />
		</Switch>
	);
}));

export default OrganisationReportRoutes;
