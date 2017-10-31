import { h, Component } from 'preact';
import Container from '../../components/Container';

class Data extends Component {
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

	render = () => {
		<Container>
			<h1>Overview</h1>
		</Container>
	}
}

export default Data;