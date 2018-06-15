import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from '../../../components/Route/index';
// import DashboardModelsModel from './model';
import DashboardModelsOverview from './models';

const DashboardModelsRoutes = () => (
	<Switch>
		<Route path="/dashboard/models" exact component={DashboardModelsOverview} />
		{/* <Route path="/dashboard/models/:modelId" exact component={DashboardModelsModel} /> */}
	</Switch>
);

export default DashboardModelsRoutes;
