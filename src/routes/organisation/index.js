import { h } from 'preact';
import { Route, Switch } from 'react-router-dom';
import Main from '../../components/Main';
import Drawer from '../../components/Drawer';

import Dashboard from './dashboard';
import Data from './data';
import Settings from './settings';
import Assistant from './assistant';
import Sharing from './sharing';

const Organisation = () => (
	<Main hasDrawer>
		<Route path="/:org" component={Drawer} />
		<Switch>
			<Route path="/:org/assistant" component={Assistant} />
			<Route path="/:org/data" component={Data} />
			<Route path="/:org/sharing" component={Sharing} />
			<Route path="/:org/settings" component={Settings} />
			<Route path="/:org" component={Dashboard} />
		</Switch>
	</Main>
);

export default Organisation;