import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from '../../../components/Route/index';
import DashboardPeopleOverview from './people';
import DashboardPeopleProfile from './profile';

const DashboardPeopleRoutes = () => (
	<Switch>
		<Route path="/dashboard/people" exact component={DashboardPeopleOverview} />
		<Route path="/dashboard/people/:userId/:name?" exact component={DashboardPeopleProfile} />
	</Switch>
);

export default DashboardPeopleRoutes;
