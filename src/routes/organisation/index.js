import { h, Component } from 'preact';
import { Redirect, Route, Switch } from 'react-router-dom';
import { find } from 'lodash';
import Main from '../../components/Main';

import Dashboard from './dashboard';
import Data from './data';
import Settings from './settings';
import Assistant from './assistant';
import Sharing from './sharing';

class Organisation extends Component {
	componentWillMount() {
		// TODO: Move this check to ./dashboard.js and ./data.js
		let { mobxStores: { store } } = this.context,
			{ match: { params: { org } } } = this.props;
		
		if (!find(store.organisations[org], 'model')) {
			store.showSnackbar(
				'No model exists on the server for this organisation.',
				4000,
				() => console.log('TODO'),
				'upload'
			);
		}
	}

	render = () => (
		<Main>
			<Switch>
				<Route path="/:org/assistant" component={Assistant} />
				<Route path="/:org/data" component={Data} />
				<Route path="/:org/sharing" component={Sharing} />
				<Route path="/:org/settings" component={Settings} />
				<Route path="/:org" component={Dashboard} />
			</Switch>
		</Main>
	)
}

export default Organisation;