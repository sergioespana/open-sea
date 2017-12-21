import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import Overview from './overview';
import React from 'react';
import Report from './report';
import Reports from './reports';
import Settings from './settings';

const Organisation = inject('OrganisationsStore', 'ReportsStore')(observer(({ OrganisationsStore, ReportsStore, match: { params: { org } } }) => (
	<Switch>
		<Route path="/:id" exact component={Overview} />
		<Route path="/:id/overview" component={Overview} />
		<Route path="/:id/reports" component={Reports} />
		<Route path="/:id/settings" component={Settings} />
		<Route path="/:id/:rep" component={Report} />
	</Switch>
)));

export default Organisation;