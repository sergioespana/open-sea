import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import linkState from 'linkstate';
import { debounce, find, get, inRange, isUndefined, map } from 'lodash';
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
import { getCurrentUserAccess } from '../../../stores/helpers';

const options = [
	{ label: 'Owner', value: 100, isDisabled: true },
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
		const organisation = OrganisationsStore.findById(orgId);
		const users = organisation._users;
		const currentUserAccess = getCurrentUserAccess(state, organisation);

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
					{inRange(currentUserAccess, 30, 101) && <Button appearance="default" onClick={this.toggleModal}>Add people</Button>}
				</Header>
				<Container style={{ display: 'block' }}>
					<Table
						columns={[
							{
								label: 'Name',
								value: ({ _id }) => get(AuthStore.findById(_id), 'name'),
								format: (name, { _id }) => {
									const avatar = get(AuthStore.findById(_id), 'avatar');
									return <TableCellWrapper><img src={avatar} /><Link to={`/dashboard/people/${_id}`}>{name}</Link></TableCellWrapper>;
								}
							},
							{
								label: 'Email',
								value: ({ _id }) => get(AuthStore.findById(_id), 'email')
							},
							{
								key: 'added',
								label: 'Added',
								format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : `${distanceInWordsToNow(updated)} ago`
							},
							{
								key: 'access',
								label: 'Role',
								format: (access, { _id }) => inRange(currentUserAccess, 30, 101)
									? (
										<Select
											isDisabled={access === 100}
											onChange={this.onSelect(_id)}
											options={options}
											placeholder="Role"
											value={access}
										/>
									)
									: <span>{get(find(options, { value: access }), 'label')}</span>
							},
							{
								key: 'access',
								label: 'Actions',
								labelHidden: true,
								hidden: !inRange(currentUserAccess, 30, 101),
								format: (access, { _id }) => access < 100 && <a onClick={this.onRemove(_id)}>Remove</a>
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
								Please note that searching for a user currently is not supported. Typing in the box below will result in
								indefinite loading and no results.
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
	private onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { state, props } = this;
		const { match: { params: { orgId } }, OrganisationsStore } = props;
		const { role, userId } = state;

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

		return OrganisationsStore.updateOrAddAccess(orgId, userId, role, { onSuccess, onError });
	}
	private toOptions = (allUserCol, orgUserCol): SelectOption[] => map(allUserCol, ({ _id, avatar, name }) => {
		const alreadyInOrganisation = !isUndefined(find(orgUserCol, { _id }));

		return {
			value: _id,
			icon: <img src={avatar} />,
			isDisabled: alreadyInOrganisation,
			label: name,
			subLabel: alreadyInOrganisation ? 'Already added to the organisation' : undefined
		};
	})
	private onSelect = (userId: string) => ({ value }) => {
		const { props } = this;
		const { match: { params: { orgId } }, OrganisationsStore } = props;

		return OrganisationsStore.updateOrAddAccess(orgId, userId, value);
	}
	private onRemove = (userId: string) => () => {
		const { props } = this;
		const { match: { params: { orgId } }, OrganisationsStore } = props;

		return OrganisationsStore.removeAccess(orgId, userId);
	}
}

const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
