import { Redirect, Route, Switch } from 'react-router-dom';
import Networks from './networks';
import Organisations from './organisations';
import Overview from './overview';
import React from 'react';

const Dashboard = () => (
	<Switch>
		<Redirect from="/dashboard" exact to="/dashboard/overview" replace />
		<Route path="/dashboard/overview" component={Overview} />
		<Route path="/dashboard/organisations" component={Organisations} />
		<Route path="/dashboard/networks" component={Networks} />
	</Switch>
);

export default Dashboard;