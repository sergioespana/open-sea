import DashboardPeople from './people';
import DashboardPeopleProfile from './profile';
import React from 'react';
import Route from 'components/Route';
import { Switch } from 'react-router-dom';

const DashboardPeopleRoutes = () => (
	<Switch>
		<Route path="/dashboard/people" exact component={DashboardPeople} />
		<Route path="/dashboard/people/:uid/:name?" exact component={DashboardPeopleProfile} />
	</Switch>
);

export default DashboardPeopleRoutes;