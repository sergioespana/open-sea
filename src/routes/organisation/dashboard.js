import { h, Component } from 'preact';
import Container from '../../components/Container';

class Overview extends Component {
	componentWillMount() {
		let { mobxStores: { store } } = this.context,
			{ match: { params: { org } } } = this.props;
		
		store.checkOrgModelPresent(org);
	}
	
	componentWillReceiveProps(nextProps) {
		let { mobxStores: { store } } = this.context,
			oldOrg = this.props.match.params.org,
			newOrg = nextProps.match.params.org;
		
		if (oldOrg !== newOrg) store.checkOrgModelPresent(newOrg);
	}

	render = ({ match: { params: { org } } }) => {
		let { mobxStores: { store } } = this.context;

		if (!store.checkOrgModelPresent(org, false)) return (
			<Container>
				<h1>No model placeholder</h1>
				<p>TODO: Replace with image</p>
			</Container>
		)

		let organisation = store.organisations[org],
			indicators = organisation.model.indicators;

		return (
			<Container>
				<h1>Overview</h1>
			</Container>
		);
	}
}

export default Overview;