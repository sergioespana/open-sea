import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Overview from './overview';
import Profile from './profile';
import React from 'react';

const Settings = () => (
	<BrowserRouter basename="/settings">
		<Switch>
			<Redirect from="/" exact to="/overview" />
			<Route path="/overview" component={Overview} />
			<Route path="/profile" component={Profile} />
		</Switch>
	</BrowserRouter>
);

export default Settings;