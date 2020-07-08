import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../../components/Redirect';
import { Route } from '../../../../components/Route';
import collection from '../../../../stores/collection';
import ReportSurveyResponse from './response';
import ReportSurveySummary from './summary';
import { isNullOrUndefined } from 'util';

const ReportSurveyRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, repId, sId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.findById(orgId);

	if (!organisation) return <Redirect to="/dashboard/organisations" />;

	const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${sId}`);
	if (isNullOrUndefined(survey)) return <Redirect to={`/${orgId}/${repId}/surveys`} />;

	return (
		<Switch>
			<Route path="/:orgId/:repId/:sId" exact component={ReportSurveyResponse} />
			<Route path="/:orgId/:repId/:sId/response" exact component={ReportSurveyResponse} />
			<Route path="/:orgId/:repId/:sId/summary" exact component={ReportSurveySummary} />
		</Switch>
	);
}));

export default ReportSurveyRoutes;
