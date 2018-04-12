import linkState from 'linkstate';
import { debounce, find, get, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import { Button, ButtonGroup } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import Select, { AsyncSelect, SelectOption } from '../../../components/Select';
import { Table, TableCellWrapper } from '../../../components/Table';

const options = [
	{ label: 'Owner', value: 100 },
	{ label: 'Administrator', value: 30 },
	{ label: 'Auditor', value: 20 },
	{ label: 'Viewer', value: 10 }
];

interface State {
	role: number;
	showModal: boolean;
	userId: string;
}

@inject(app('AuthStore', 'OrganisationsStore'))
@observer
export default class OrganisationSettingsPeople extends Component<any> {
	readonly state: State = {
		role: 0,
		showModal: false,
		userId: ''
	};

	render () {
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { role, showModal, userId } = this.state;
		const organisation = OrganisationsStore.getItem(orgId, '_id');
		const users = organisation._users;

		return (
			<React.Fragment>
				<Header
					title="People"
					headTitle={`People - ${organisation.name} / Settings`}
					breadcrumbs={[
						<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
						<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
					]}
				>
					<Button appearance="default" onClick={this.toggleModal}>Add people</Button>
				</Header>
				<Container style={{ display: 'block' }}>
					<Table
						columns={[
							{
								label: 'Name',
								value: ({ _id }) => get(AuthStore.getItem(_id, '_id'), 'name'),
								format: (name, { _id }) => {
									const avatar = get(AuthStore.getItem(_id, '_id'), 'avatar');
									return <TableCellWrapper><img src={avatar} /><Link to={`/dashboard/people/${_id}`}>{name}</Link></TableCellWrapper>;
								}
							},
							{
								label: 'Email',
								value: ({ _id }) => get(AuthStore.getItem(_id, '_id'), 'email')
							},
							{
								key: 'access',
								label: 'Role',
								format: (access) => (
									<Select
										onChange={console.log}
										options={options}
										placeholder="Role"
										value={access}
									/>
								)
							},
							{
								key: '',
								label: 'Actions',
								labelHidden: true,
								format: () => <a>Remove</a>
							}
						]}
						data={users}
						defaultSort="-access"
					/>
				</Container>
				<Modal
					isOpen={showModal}
					onClose={this.toggleModal}
				>
					<form onSubmit={this.onSubmit}>
						<ModalHeader>
							<h1>Add people</h1>
						</ModalHeader>
						<ModalSection>
							<p>
								Please note that searching for a user currently is not supported. Typing in the box below will always yield
								"no results".
							</p>
							<AsyncSelect
								autoFocus
								components={{ DropdownIndicator: () => null }}
								defaultOptions={this.toOptions(state.users, organisation._users)}
								isSearchable
								loadOptions={debounce(console.log, 400)}
								onChange={linkState(this, 'userId', 'value')}
								placeholder="Type a name or email address"
							/>
							<Select
								label="Role"
								onChange={linkState(this, 'role', 'value')}
								options={options}
								placeholder="Choose role"
								value={role}
							/>
						</ModalSection>
						<ModalFooter>
							<ButtonGroup>
								<Button
									appearance="default"
									disabled={role === 0 || userId === ''}
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
	private toOptions = (allUserCol, orgUserCol): SelectOption[] => map(allUserCol, ({ _id, avatar, name }) => ({
		value: _id,
		icon: <img src={avatar} />,
		label: name,
		subLabel: find(orgUserCol, { _id }) ? 'Already added to the organisation' : undefined
	}))
}

const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
