import csv from 'csvtojson';
import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import linkState from 'linkstate';
import { debounce, find, get, inRange, isUndefined, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import { Button, ButtonGroup } from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../components/Modal';
import Select, { AsyncSelect, SelectOption } from '../../components/Select';
import { Table, TableCellWrapper } from '../../components/Table';
import { Stakeholder, StakeholderGroup } from '../../domain/Organisation';
import { getCurrentUserAccess } from '../../stores/helpers';

const options = [
	{ label: 'Owner', value: 100, isDisabled: true },
	{ label: 'Administrator', value: 30 },
	{ label: 'Auditor', value: 20 },
	{ label: 'Viewer', value: 10 },
	{ label: 'Participant', value: 0 }
];

interface State {
	role: number;
	showModal: boolean;
	userId: string;
	sthgr: StakeholderGroup;
}

@inject(app('AuthStore', 'OrganisationsStore', 'UIStore'))
@observer
export default class OrganisationSettingsPeople extends Component<any> {
	input = null;
	readonly state: State = {
		role: 0,
		showModal: false,
		userId: '',
		sthgr: null
	};

	render () {
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { role, showModal, userId } = this.state;
		const organisation = OrganisationsStore.findById(orgId);
		const stakeholders = organisation._stakeholders;
		const users = organisation._users;
		const currentUserAccess = getCurrentUserAccess(state, organisation);
		const csvInput = (
			<input
				accept=".csv"
				onChange={this.onFileChange}
				ref={this.getRef}
				style={{ display: 'none' }}
				type="file"
			/>
		);

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
					{inRange(currentUserAccess, 30, 101) && <Button appearance="default" onClick={this.toggleModal}>Add</Button>}
					{inRange(currentUserAccess, 30, 101) && <Button appearance="light" onClick={this.openInput}>Import</Button>}
					{csvInput}
					{/* File should be a standard CSV (comma delimited) file with optional double quotes around values (default for most spreadsheet tools).
					The first line must contain the field names. The fields can be in any order.
					Mandatory field: email
					Optional fields: firstname, lastname,blacklisted,language
					Separator used: Comma | semi collumn

					participants table --> multiple tables with list of participants
					*/}
					{/*StakeholderInput*/}
				</Header>
				<Container style={{ display: 'block' }}>
				<Table
					columns={[
						{
							key: 'name',
							label: 'Name',
							//format: (name, { _id }) => <Link to={`/${_id}`}>{name}</Link> // When click --> edit
						},
						{
							key: 'email',
							label: 'Email',
							format: (email) => email.toLowerCase()
						},
						{
							key: 'sgId',
							label: 'Group',
							format: (sgId) => sgId.toLowerCase()[0].toUpperCase() + sgId.toLowerCase().slice(1)
						},
						{
							key: '_sId',
							label: 'ID'
							//format: (sId) => sId
						},
						{
							key: 'createdBy',
							label: 'Created by',
							value: ({ createdBy }) => get(find(state.users, { _id: createdBy }), 'name'),
							format: (name, { createdBy }) => <Link to={`/dashboard/people/${createdBy}`}>{name}</Link>
						},
						{
							label: 'Updated',
							value: ({ created, updated }) => updated || created,
							format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
						}
					]}
					data={stakeholders}
					defaultSort="-sgId"
					filters={['name', 'email', 'sgId', 'createdBy']}
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
								Please note that searching for a user is currently only supported through a one's <i>exact</i> name
								or e-mail address.
							</p>
							<AsyncSelect
								components={{ DropdownIndicator: () => null }}
								defaultOptions={this.toOptions(state.users, organisation._users)}
								isSearchable
								loadOptions={debounce(this.loadOptions, 400)}
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
	private getRef = (node) => this.input = node;
	private openInput = () => this.input.click();
	private onFileChange = (event) => {
		const file = event.target.files[0];
		const fr = new FileReader();
		fr.onload = this.onFileLoad;
		fr.readAsText(file);
	}
	private onFileLoad = (ev: ProgressEvent) => {
		const { srcElement }: { srcElement: Partial<FileReader> } = ev;
		const { result } = srcElement;
		//const { state, props } = this;
		//const { role, userId } = state;
		const { match: { params: { orgId } }, OrganisationsStore, UIStore } = this.props;

		if (!result) {
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Could not read the selected file.' });
			return;
		}

		const header = 'firstname,lastname,email';
		if (result.slice(0,header.length) !== header) {
			UIStore.addFlag({ appearance: 'error', title: 'CSV header error', description: 'The file headers and colomns are not in the correct format, please revise' });
			return;
		}

		const shgr = 'Customers';
		const shgrid = this.capitalizeLetters(shgr);

		this.addStakeholderGroup(orgId,shgr,shgrid);
		
		csv().fromString(result.toString()).then((csvResult) => {
			console.log(csvResult);
			csvResult.forEach(csvRow => {
				const sth: Stakeholder[] = csvRow;
				console.log(sth);

				this.addStakeholder(orgId,shgrid,sth);
			});
		});
	}

	private toggleModal = () => this.setState(toggleModal);
	private onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { state, props } = this;
		const { match: { params: { orgId } }, OrganisationsStore } = props;
		const { role, userId } = state;

		const onSuccess = () => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			this.toggleModal();
		};

		const onError = (error) => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
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
	private loadOptions = async (query, callback) => {
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const result = await AuthStore.search(query);
		const options = this.toOptions(result, organisation._users);
		callback(options);
	}
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

	private addStakeholderGroup = (orgid, shgrName, shgrId) => {
		const { props, state } = this;
		const { history, OrganisationsStore } = props;
		const sthg = { ...state.sthgr } ;

		sthg.name = shgrName;
		sthg._orgId = orgid;
		sthg._sgId = shgrId;
		sthg._id = `${orgid}/stakeholdergroups/${sthg._sgId}`;
		console.log(sthg);

		const onSuccess = () => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			console.log('stakeholdergroupadded');
			history.push(`/${sthg._id}`);
		};

		const onError = (error) => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
				// TODO: Show flag
			console.log('failed:', error);
		};
		//props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.addStakeholderGroup(sthg, { onSuccess, onError });
	}
	private addStakeholder = (orgid, sgid, stakeholder) => {

		const { props } = this;
		const { history, OrganisationsStore } = props;
		const sId = stakeholder.lastname + stakeholder.firstname + this.getRandomID();
		stakeholder._firstname = stakeholder.firstname.toLowerCase()[0].toUpperCase() + stakeholder.firstname.toLowerCase().slice(1) ;
		stakeholder._lastlame = stakeholder.lastname.toLowerCase()[0].toUpperCase() + stakeholder.lastname.toLowerCase().slice(1) ;

		stakeholder.name = stakeholder._firstname + ' ' + stakeholder._lastlame;
		stakeholder._orgId = orgid;
		stakeholder.sgId = sgid;
		stakeholder._sId = sId;
		stakeholder._id = `${orgid}/stakeholders/${sId}`;

		console.log(stakeholder);

		const onSuccess = () => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			console.log('added to firebase');
			// else push sId
			history.push(`/${stakeholder._id}`);
		};

		const onError = (error) => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
					// TODO: Show flag
			console.log('failed:', error);
		};

		//props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.addStakeholder(stakeholder, { onSuccess, onError });
	}
	private getRandomID = () => {
		return Math.floor(Math.random() * Math.floor(999));
	}
	private capitalizeLetters = (txt) => {
		return txt.toUpperCase() ;
	}
}
const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
