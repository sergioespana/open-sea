import { h } from 'preact';
import { Route, Switch } from 'react-router-dom';

import Data from './data';
import Report from './report';
import Overview from './overview';

const Reports = () => (
	<Switch>
		<Route path="/organisation/:id/reports/:report/data" component={Data} />
		<Route path="/organisation/:id/reports/:report" component={Report} />
		<Route path="/organisation/:id/reports" component={Overview} />
	</Switch>
);

export default Reports;