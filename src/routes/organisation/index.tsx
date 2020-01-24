import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../components/Redirect';
import { Route } from '../../components/Route';
import NetworkOverview from '../network/overview';
import NetworkSettingsRoutes from '../network/settings';
import OrganisationCertification from './certification';
import OrganisationOverview from './overview';
import OrganisationReportRoutes from './report';
import OrganisationStakeholders from './stakeholders';
import OrganisationSurveys from './surveys';
import OrganisationInfographicRoutes from './infographic';
import OrganisationReports from './reports';
import OrganisationSettingsRoutes from './settings';
import OrganisationInfographics from './infographics';
//import OrganisationSurveys from './surveys';

@inject(app('OrganisationsStore'))
@observer
class OrganisationRoutes extends Component<any> {

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
				<Route path="/:orgId/certification" exact component={OrganisationCertification} />
				<Route path="/:orgId/infographics" exact component={OrganisationInfographics} />
				<Route path="/:orgId/stakeholders" exact component={OrganisationStakeholders} />
				<Route path="/:orgId/surveys" exact component={OrganisationSurveys} />
				<Route path="/:orgId/settings" component={OrganisationSettingsRoutes} />
				<Route path="/:orgId/infographics/:infographicId" component={OrganisationInfographicRoutes} />
				<Route path="/:orgId/:repId" component={OrganisationReportRoutes} />
			</Switch>
		);
	}
}

export default OrganisationRoutes;
