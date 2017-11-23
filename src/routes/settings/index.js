import { Route, Switch } from 'react-router-dom';
import Overview from './overview';
import Profile from './profile';
import React from 'react';

const Settings = () => (
	<Switch>
		<Route path="/settings" exact component={Overview} />
		<Route path="/settings/profile" component={Profile} />
	</Switch>
);

export default Settings;