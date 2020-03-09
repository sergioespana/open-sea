import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../../components/Redirect';
import { Route } from '../../../../components/Route';
import SurveyParticipants from './participants';
import SurveyResponse from './response';
import SurveySummary from './summary';



@inject(app('OrganisationsStore'))
@observer
class SurveyRoutes extends Component<any> {

	componentWillMount () {
		const { match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { isAuthed } = state;
		if (!isAuthed) OrganisationsStore.startListening(orgId);
	}

	render () {
		const { match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { isAuthed, isLoading } = state;
		const organisation = OrganisationsStore.findById(orgId);

		if (isLoading) return null;

		if (!organisation && isAuthed) return <Redirect to="/dashboard/organisations" />;

		return (
			<Switch>
				<Route path="/:orgId/:repId/:sId/" exact component={SurveySummary} />
				<Route path="/:orgId/:repId/:sId/summary" exact component={SurveySummary} />
				<Route path="/:orgId/:repId/:sId/response" exact component={SurveyResponse} />
				<Route path="/:orgId/:repId/:sId/participants" exact component={SurveyParticipants} />
			</Switch>
		);
	}
}

export default SurveyRoutes;
