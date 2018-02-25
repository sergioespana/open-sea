import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import { Link } from 'components/Link';
import NetworkOrganisations from './network/organisations';
import NetworkOverview from './network/overview';
import OrganisationOverview from './overview';
import OrganisationReportRoutes from './report';
import OrganisationReports from './reports';
import OrganisationSettings from './settings';
import Placeholder from 'components/Placeholder';
import Route from 'components/Route';
import { Switch } from 'react-router-dom';

@inject(app('OrganisationsStore'))
@observer
class OrganisationRoutes extends Component {

	componentWillMount = () => {
		const { match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { authed, listening, loading } = state;

		if (!authed && listening && loading) {
			OrganisationsStore.findById(orgId);
		}
	}

	render = () => {
		const { match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { authed, loading } = state;
		
		if (loading) return null;
		
		const organisation = OrganisationsStore.getItem(orgId, '_id');
		const { isNetwork, isPublic } = organisation || {};

		if (!organisation || (!authed && !isPublic)) return (
			<main>
				<Placeholder>
					<img src="/assets/images/empty-state-destination.svg" />
					<h1>Destination unknown</h1>
					<p>The page you're trying to visit does not exist.<br /> Return to the <a>previous page</a> or go back to your <Link to="/dashboard">dashboard</Link>.</p>
				</Placeholder>
			</main>
		);
		
		if (isNetwork) return (
			<main>
				<Switch>
					<Route path="/:orgId" exact component={NetworkOverview} />
					<Route path="/:orgId/overview" exact component={NetworkOverview} />
					<Route path="/:orgId/organisations" exact component={NetworkOrganisations} />
					<Route path="/:orgId/compare" exact />
					<Route path="/:orgId/compare/:orgs+" />
					<Route path="/:orgId/settings" component={OrganisationSettings} authedOnly />
				</Switch>
			</main>
		);
		
		return (
			<main>
				<Switch>
					<Route path="/:orgId" exact component={OrganisationOverview} />
					<Route path="/:orgId/overview" exact component={OrganisationOverview} />
					<Route path="/:orgId/reports" exact component={OrganisationReports} />
					<Route path="/:orgId/settings" component={OrganisationSettings} authedOnly />
					<Route path="/:orgId/:repId" component={OrganisationReportRoutes} />
				</Switch>
			</main>
		);
	}
}

export default OrganisationRoutes;