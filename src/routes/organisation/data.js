import { h, Component } from 'preact';
import { map } from 'lodash';
import Container from '../../components/Container';
import InputField from '../../components/InputField';

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

	render = ({ match: { params: { org } } }) => {
		let { mobxStores: { store } } = this.context;

		if (!store.checkOrgModelPresent(org, false)) return (
			<Container>
				<h1>No model placeholder</h1>
				<p>TODO: Replace with image</p>
			</Container>
		)

		let organisation = store.organisations[org],
			metrics = organisation.model.metrics;

		return (
			<Container slim>
				{ Object.keys(metrics).map((id) => {
					let metric = metrics[id];
					return (
						<InputField
							fullWidth
							label={metric.name}
							help={metric.help}
							type={metric.type}
						/>
					);
				}) }
			</Container>
		);
	}
}

export default Data;