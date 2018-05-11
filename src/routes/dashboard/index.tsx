import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from '../../components/Route/index';
import DashboardNetworks from './networks';
import DashboardOrganisations from './organisations';
import DashboardOverview from './overview';
import DashboardPeopleRoutes from './people';

const DashboardRoutes = () => (
	<Switch>
		<Route path="/dashboard" exact component={DashboardOverview} />
		<Route path="/dashboard/overview" exact component={DashboardOverview} />
		<Route path="/dashboard/organisations" exact component={DashboardOrganisations} />
		<Route path="/dashboard/networks" exact component={DashboardNetworks} />
		<Route path="/dashboard/people" component={DashboardPeopleRoutes} />
	</Switch>
);

export default DashboardRoutes;
