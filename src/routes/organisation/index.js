import { h } from 'preact';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Main from '../../components/Main';
import Drawer from '../../components/Drawer';

import Overview from './overview';
import Settings from './settings';
import Assistant from './assistant';

const Organisation = ({ match: { params: { id } } }, { mobxStores: { OrgStore } }) => OrgStore.organisations.has(id) ? (
	<Router basename="/organisation">
		<Main hasDrawer>
			<Route path="/:id" component={Drawer} />
			<Switch>
				<Redirect from="/:id" exact to={`/${id}/overview`} />
				<Route path="/:id/assistant" component={Assistant} />
				<Route path="/:id/overview" component={Overview} />
				<Route path="/:id/settings" component={Settings} />
			</Switch>
		</Main>
	</Router>
) : (
	<Redirect to="/" />
);

export default observer(Organisation);