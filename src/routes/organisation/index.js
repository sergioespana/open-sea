import { h } from 'preact';
import { Redirect, BrowserRouter as Router, Route } from 'react-router-dom';

import Overview from './overview';
import Settings from './settings';
import Sharing from './sharing';

const Organisation = ({ match: { params: { org } } }) => (
	<Router basename={org}>
		<div id="main">
			<Route path="/" exact render={() => <Redirect to="/overview" />} />
			<Route path="/settings" />
			<Route path="/sharing" />
		</div>
	</Router>
);

export default Organisation;