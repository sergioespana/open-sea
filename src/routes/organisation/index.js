import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import Assistant from './assistant';
import BottomNavigation from 'components/BottomNavigation';
import CenterProgress from 'components/CenterProgress';
import New from './new';
import Overview from './overview';
import React from 'react';
import Report from './report';
import Reports from './reports';
import Settings from './settings';
import Sharing from './sharing';

const Organisation = inject('OrganisationsStore', 'ReportsStore')(observer(({ OrganisationsStore, ReportsStore, match: { params: { id } } }) => OrganisationsStore.loading || ReportsStore.loading ? (
	<CenterProgress />
) : [
	<Switch key={0}>
		<Route path="/:id/assistant" component={Assistant} />
		<Route path="/:id" exact component={Overview} />
		<Route path="/:id/reports" component={Reports} />
		<Route path="/:id/sharing" component={Sharing} />

		<Route path="/:id/archive" />
		<Route path="/:id/trash" />
		<Route path="/:id/settings" component={Settings} />

		<Route path="/:id/new" component={New} />
		<Route path="/:id/:rep" component={Report} />
	</Switch>,
	<BottomNavigation key={1} id={id} />
]));

export default Organisation;