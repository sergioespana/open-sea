import linkState from 'linkstate';
import { find, get, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import { Button, ButtonGroup } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import Select, { SelectOption } from '../../../components/Select';
import { Table, TableCellWrapper } from '../../../components/Table';

interface State {
	organisation: string;
	showModal: boolean;
}

@inject(app('AuthStore', 'OrganisationsStore'))
@observer
export default class NetworkSettingsOrganisations extends Component<any> {
	readonly state: State = {
		organisation: '',
		showModal: false
	};

	render () {
		const { match: { params: { netId } }, OrganisationsStore, state } = this.props;
		const { organisation, showModal } = this.state;
		const network = OrganisationsStore.getItem(netId, '_id');
		const organisations = network._organisations;

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
					<Button appearance="default" onClick={this.toggleModal}>Add organisation</Button>
				</Header>
				<Container style={{ display: 'block' }}>
					<Table
						columns={[
							{
								label: 'Network',
								value: ({ _id }) => get(OrganisationsStore.getItem(_id, '_id'), 'name'),
								format: (name, { _id }) => {
									const avatar = get(OrganisationsStore.getItem(_id, '_id'), 'avatar');
									return <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>;
								}
							},
							{
								key: '',
								label: 'Actions',
								labelHidden: true,
								format: () => <a>Remove</a>
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
	private onSubmit = (event: SyntheticEvent<HTMLFormElement>) => event.preventDefault();
	private toOptions = (allOrgCol, netOrgCol): SelectOption[] => map(allOrgCol, ({ _id, avatar, name }) => ({
		value: _id,
		icon: <img src={avatar} />,
		label: name,
		subLabel: find(netOrgCol, { _id }) ? 'Already part of the network' : undefined
	}))
}

const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
