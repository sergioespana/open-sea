import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from '../../components/Route/index';
import CreateNetwork from './network';
import CreateOrganisation from './organisation';
import CreateReport from './report';

const CreateRoutes = () => (
	<Switch>
		<Route path="/create/network" exact component={CreateNetwork} />
		<Route path="/create/organisation" exact component={CreateOrganisation} />
		<Route path="/create/report" exact component={CreateReport} />
	</Switch>
);

export default CreateRoutes;
