import { h } from 'preact';
import { Redirect, Route, Switch } from 'react-router-dom';

import Assistant from './assistant';
import Overview from './overview';
import Reports from './reports';
import Sharing from './sharing';
import Archive from './archive';
import Trash from './trash';
import Settings from './settings';

const Organisation = ({ match: { params: { id } } }, { mobxStores: { OrgStore: { organisations } } }) => organisations.has(id) ? (
	<Switch>
		<Route path="/organisation/:id/assistant" component={Assistant} />
		<Route path="/organisation/:id/overview" component={Overview} />
		<Route path="/organisation/:id/reports" component={Reports} />
		<Route path="/organisation/:id/sharing" component={Sharing} />
		
		<Route path="/organisation/:id/archive" component={Archive} />
		<Route path="/organisation/:id/trash" component={Trash} />
		<Route path="/organisation/:id/settings" component={Settings} />
		
		<Redirect to={`/organisation/${id}/overview`} />
	</Switch>
) : (
	<Redirect to="/" />
);

export default Organisation;