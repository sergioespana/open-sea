import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import linkState from 'linkstate';
import { find, findLastIndex, get, inRange, isNumber, isUndefined, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import { Button, ButtonGroup } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Lozenge } from '../../../components/Lozenge';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import Select, { SelectOption } from '../../../components/Select';
import { Table, TableCellWrapper } from '../../../components/Table';
import { getCurrentUser } from '../../../stores/helpers';

interface State {
	organisation: string;
	showModal: boolean;
}

@inject(app('AuthStore', 'OrganisationsStore', 'ReportsStore'))
@observer
export default class NetworkSettingsOrganisations extends Component<any> {
	readonly state: State = {
		organisation: '',
		showModal: false
	};

	render () {
		const { match: { params: { netId } }, OrganisationsStore, ReportsStore, state } = this.props;
		const { organisation, showModal } = this.state;
		const network = OrganisationsStore.findById(netId);
		const organisations = network._organisations;
		const users = network._users;
		const currentUserAccess = get(find(users, { _id: get(getCurrentUser(state), '_id') }), 'access') || 0;

		return (
			<React.Fragment>
				<Header
					title="Organisations"
					headTitle={`Organisations - ${network.name} / Settings`}
					breadcrumbs={[
						<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
						<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
					]}
				>
					{inRange(currentUserAccess, 30, 101) && <Button appearance="default" onClick={this.toggleModal}>Add organisation</Button>}
				</Header>
				<Container style={{ display: 'block' }}>
					<Table
						columns={[
							{
								label: 'Network',
								value: ({ _id }) => get(OrganisationsStore.findById(_id), 'name'),
								format: (name, { _id }) => {
									const avatar = get(OrganisationsStore.findById(_id), 'avatar');
									return <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>;
								}
							},
							{
								key: 'added',
								label: 'Added',
								format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
							},
							{
								key: 'certification',
								label: 'Certification',
								value: ({ _id }) => {
									const assessed = ReportsStore.assess(network, OrganisationsStore.findById(_id));
									return isNumber(assessed) ? assessed : findLastIndex(assessed, { pass: true });
								},
								format: (value) => {
									if (value < 0) return 'None';
									const certification = get(network, `model.certifications[${value}]`);
									return certification && <Lozenge appearance="default" bg={certification.colour}>{certification.name}</Lozenge>;
								}
							},
							{
								key: '',
								label: 'Actions',
								labelHidden: true,
								hidden: organisations.length <= 1 || !inRange(currentUserAccess, 30, 101),
								format: (_, { _id }) => <a onClick={this.onRemove(_id)}>Remove</a>
							}
						]}
						data={organisations}
					/>
				</Container>
				<Modal
					isOpen={showModal}
					onClose={this.toggleModal}
				>
					<form onSubmit={this.onSubmit}>
						<ModalHeader>
							<h1>Add organisation</h1>
						</ModalHeader>
						<ModalSection>
							<p>
								Please note that searching for an organisation currently is not supported. Typing in the box below will always yield
								"no results". You are able to choose from any organisation you already have access to.
							</p>
							<Select
								autoFocus
								isSearchable
								onChange={linkState(this, 'organisation', 'value')}
								options={this.toOptions(state.organisations, network._organisations)}
								placeholder="Choose organisation"
								value={organisation}
							/>
						</ModalSection>
						<ModalFooter>
							<ButtonGroup>
								<Button
									appearance="default"
									disabled={organisation === ''}
									type="submit"
								>
									Add
								</Button>
								<Button appearance="subtle-link" onClick={this.toggleModal} type="button">Cancel</Button>
							</ButtonGroup>
						</ModalFooter>
					</form>
				</Modal>
			</React.Fragment>
		);
	}

	private toggleModal = () => this.setState(toggleModal);
	private onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { state, props } = this;
		const { match: { params: { netId } }, OrganisationsStore } = props;
		const { organisation: orgId } = state;

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			this.toggleModal();
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
			this.toggleModal();
		};

		return OrganisationsStore.addOrganisation(netId, orgId, { onSuccess, onError });
	}
	private toOptions = (allOrgCol, netOrgCol): SelectOption[] => map(allOrgCol, ({ _id, avatar, name }) => {
		const alreadyInNetwork = !isUndefined(find(netOrgCol, { _id }));
		return {
			value: _id,
			icon: <img src={avatar} />,
			isDisabled: alreadyInNetwork,
			label: name,
			subLabel: alreadyInNetwork ? 'Already part of the network' : undefined
		};
	})
	private onRemove = (orgId: string) => () => {
		const { props } = this;
		const { match: { params: { netId } }, OrganisationsStore } = props;

		return OrganisationsStore.removeOrganisation(netId, orgId);
	}
}

const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
