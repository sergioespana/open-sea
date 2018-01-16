import { Redirect, Switch } from 'react-router-dom';
import DashboardNetworks from './networks';
import DashboardOrganisations from './organisations';
import DashboardOverview from './overview';
import React from 'react';
import Route from 'components/Route';

const DashboardRoutes = () => (
	<main>
		<Switch>
			<Route path="/dashboard/overview" exact component={DashboardOverview} />
			<Route path="/dashboard/organisations" exact component={DashboardOrganisations} />
			<Route path="/dashboard/networks" exact component={DashboardNetworks} />
			<Redirect from="*" to="/dashboard/overview" />
		</Switch>
	</main>
);

export default DashboardRoutes;