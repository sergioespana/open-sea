import linkState from 'linkstate';
import { isEqual } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, FormEvent } from 'react';
import { Button } from '../../../components/Button';
import Container from '../../../components/Container';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Input, { TextArea } from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import { Organisation } from '../../../domain/Organisation';

interface State {
	network: Organisation;
}

@inject(app('OrganisationsStore'))
@observer
class NetworkSettingsDetails extends Component<any, State> {
	readonly state: State = {
		network: null
	};

	componentWillMount() {
		this.resetForm();
	}

	render() {
		const { match: { params: { netId } }, OrganisationsStore, state } = this.props;
		const { network } = this.state;
		const originalNet = OrganisationsStore.findById(netId);
		const preventSubmit = state.isBusy || isEqual(network, originalNet);

		return (
			<React.Fragment>
				<Header
					title="Details"
					headTitle={`Details - ${originalNet.name} / Settings`}
					breadcrumbs={[
						<Link key={`/${netId}`} to={`/${netId}`}>{originalNet.name}</Link>,
						<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
					]}
				/>
				<Container>
					<Section>
						<Form onSubmit={this.onSubmit}>
							<Input
								appearance="default"
								isCompact
								label="Name"
								onChange={linkState(this, 'network.name')}
								required
								value={network.name}
							/>
							<Input
								appearance="default"
								isCompact
								label="Avatar"
								onChange={linkState(this, 'network.image')}
								type="image"
								value={network.avatar || '/assets/images/network-avatar-placeholder.png'}
							/>
							<TextArea
								appearance="default"
								isCompact
								label="Description"
								onChange={linkState(this, 'network.description')}
								value={network.description}
							/>
							<Input
								appearance="default"
								checked={network.isPublic}
								help="Public networks and their reports are visible to anyone. Explicitly granted access is still required for certain operations."
								isCompact
								label="Public"
								onChange={linkState(this, 'network.isPublic', 'target.checked')}
								placeholder="This is a public network"
								type="checkbox"
							/>
							<FormActions>
								<Button appearance="default" disabled={preventSubmit} type="submit">Save details</Button>
								<Button appearance="link" onClick={this.resetForm} type="button">Cancel</Button>
							</FormActions>
						</Form>
					</Section>
				</Container>
			</React.Fragment>
		);
	}

	private resetForm = () => {
		const { match: { params: { netId } }, OrganisationsStore } = this.props;
		return this.setState({ network: { ...OrganisationsStore.findById(netId) } });
	}
	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { props, state } = this;
		const { history, match: { params: { netId } }, OrganisationsStore } = props;
		const { network } = state;

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${netId}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
		};

		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.updateOrganisation(network, { onSuccess, onError });
	}
}

// const NetworkSettingsDetails = inject(app('OrganisationsStore'))(observer((props) => {
// 	const { match: { params: { netId } }, OrganisationsStore } = props;
// 	const network = OrganisationsStore.findById(netId);

// 	return (
// 		<React.Fragment>
// 			<Header
// 				title="Details"
// 				headTitle={`Details - ${network.name} / Settings`}
// 				breadcrumbs={[
// 					<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
// 					<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
// 				]}
// 			/>
// 			<Container>
// 				<Form>
// 					<Input
// 						appearance="default"
// 						defaultValue={network.name}
// 						isCompact
// 						label="Name"
// 						required
// 					/>
// 					<Input
// 						appearance="default"
// 						defaultValue={network.description}
// 						isCompact
// 						label="Description"
// 						multiple
// 					/>
// 					<FormActions>
// 						<Button appearance="default" type="submit">Save details</Button>
// 						<Button appearance="link" type="reset">Cancel</Button>
// 					</FormActions>
// 				</Form>
// 			</Container>
// 		</React.Fragment>
// 	);
// }));

export default NetworkSettingsDetails;
