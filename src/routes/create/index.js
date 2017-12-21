import { Redirect, Route, Switch } from 'react-router-dom';
import Organisation from './organisation';
import React from 'react';
import Report from './report';

const Create = () => (
	<Switch>
		<Redirect from="/create" exact to="/" />
		<Route path="/create/organisation" component={Organisation} />
		<Route path="/create/network" />
		<Route path="/create/report" component={Report} />
	</Switch>
);

export default Create;