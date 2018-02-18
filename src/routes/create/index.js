import { Redirect, Switch } from 'react-router-dom';
import CreateNetwork from './network';
import CreateOrganisation from './organisation';
import CreateReport from './report';
import React from 'react';
import Route from 'components/Route';

const CreateRoutes = () => (
	<main>
		<Switch>
			<Route path="/create/report" exact component={CreateReport} />
			<Route path="/create/organisation" exact component={CreateOrganisation} />
			<Route path="/create/network" exact component={CreateNetwork} />
			<Redirect from="*" to="/dashboard/overview" />
		</Switch>
	</main>
);

export default CreateRoutes;