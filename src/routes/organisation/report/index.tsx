import { app, collection } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import OrganisationReportData from './data';
import OrganisationReportOverview from './report';

const OrganisationReportRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	if (!organisation) return <Redirect to="/dashboard/organisations" />;

	const report = collection(organisation._reports).getItem(`${orgId}/${repId}`, '_id');

	if (!report) return <Redirect to={`/${orgId}/reports`} />;

	return (
		<Switch>
			<Route path="/:orgId/:repId" exact component={OrganisationReportOverview} />
			<Route path="/:orgId/:repId/data" exact component={OrganisationReportData} />
		</Switch>
	);
}));

export default OrganisationReportRoutes;
