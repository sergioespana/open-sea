import { h } from 'preact';
import { observer } from 'mobx-react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Main from '../../components/Main';
import Drawer from '../../components/Drawer';
import Dropzone from '../../components/Dropzone';

import Dashboard from './dashboard';
import Settings from './settings';
import Assistant from './assistant';

const Organisation = ({ match: { params: { org } } }, { mobxStores: { OrgStore } }) => OrgStore.organisations.has(org) ? (
	<Main hasDrawer>
		<Dropzone>
			<Route path="/:org" component={Drawer} />
			<Switch>
				<Route path="/:org/assistant" component={Assistant} />
				<Route path="/:org/settings" component={Settings} />
				<Route path="/:org" component={Dashboard} />
			</Switch>
		</Dropzone>
	</Main>
) : (
	<Redirect to="/" />
);

export default observer(Organisation);