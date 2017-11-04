import { h, Component } from 'preact';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import Container from '../../components/Container';
import Input from '../../components/Input';

@observer class Data extends Component {
	componentWillMount() {
		let { mobxStores: { OrgStore } } = this.context,
			{ match: { params: { org } } } = this.props;
		
		OrgStore.checkOrgModelPresent(org);
	}
	
	componentWillReceiveProps(nextProps) {
		let { mobxStores: { OrgStore } } = this.context,
			oldOrg = this.props.match.params.org,
			newOrg = nextProps.match.params.org;
		
		if (oldOrg !== newOrg) OrgStore.checkOrgModelPresent(newOrg);
	}

	render = () => {
		let { match: { params: { org } } } = this.props,
			{ mobxStores: { OrgStore } } = this.context;

		if (!OrgStore.checkOrgModelPresent(org, false)) return (
			<Container>
				<h1>No model placeholder</h1>
				<p>TODO: Replace with image</p>
			</Container>
		);

		let organisation = OrgStore.organisations.get(org),
			metrics = organisation.get('model').metrics;

		return (
			<Container slim>
				{ map(metrics, (metric) => (
					<Input
						fullWidth
						label={metric.name}
						help={metric.help}
						type={metric.type}
					/>
				)) }
			</Container>
		);
	}
}

export default Data;