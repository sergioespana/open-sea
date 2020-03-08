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
import Input from '../../components/NewInput'
import { Table, TableCellWrapper } from '../../components/Table';
import { Stakeholder, Stakeholdergroup } from '../../domain/Organisation';
import { getCurrentUserAccess } from '../../stores/helpers';
import { UIStore, OrganisationsStore } from 'src/stores';
import MdRemoveCircle from 'react-icons/lib/md/remove-circle';
import MdSettings from 'react-icons/lib/md/settings';

interface State {
	sgId: string;
	showModal: boolean;
	showCSVModal: boolean;
	userId: string;
	stakeholdergroup: Stakeholdergroup;
	stakeholder: Stakeholder;
	stakeholdersData: any;

}

@inject(app('AuthStore', 'OrganisationsStore', 'UIStore'))
@observer
export default class OrganisationSettingsPeople extends Component<any> {
	input = null;
	readonly state: State = {
		sgId: '',
		showModal: false,
		showCSVModal: false,
		userId: '',
		stakeholdergroup: null,
		stakeholder: null,
		stakeholdersData: null
	};

	render () {
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		let { sgId, showModal, showCSVModal, stakeholdersData } = this.state;
		const organisation = OrganisationsStore.findById(orgId);
		stakeholdersData = organisation._stakeholders;
		const stakeholdergroups = organisation._stakeholdergroups;
		const users = organisation._users;
		const currentUserAccess = getCurrentUserAccess(state, organisation);

		const sglist = [];

		map(stakeholdergroups,({ name , _sgId }) => sglist.push({ label: name, value: _sgId }));

		console.log(sglist);

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
					{inRange(currentUserAccess, 30, 101) && <Button appearance="light" onClick={this.toggleCSVModal}>Import</Button>}
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
							//format: (name, { _id }) => <Link to={this.toggleModal}>{name}</Link> // When click --> edit
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
							key: 'createdBy',
							label: 'Created by',
							value: ({ createdBy }) => get(find(state.users, { _id: createdBy }), 'name'),
							format: (name, { createdBy }) => <Link to={`/dashboard/people/${createdBy}`}>{name}</Link>
						},
						{
							label: 'Updated',
							value: ({ created, updated }) => updated || created,
							format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
						},
						{
							key: '_sId',
							label: '',
							format: (sId) => {
								return (
										<Button appearance="subtle-link" onClick={this.onRemove(sId)}>{<MdRemoveCircle />}</Button>);
							}
						}
					]}
					data={stakeholdersData}
					defaultSort="-sgId"
					filters={['name', 'email', 'sgId', 'createdBy']}
				/>
				</Container>
				<Modal
					isOpen={showModal}
					onClose={this.toggleModal}
				>
					<form onSubmit={this.onSubmit}>
						<ModalSection>
							<p>
								Please add a stakeholdergroup or stakeholder. Unfortunately, a stakeholdergroup and stakeholder cannot be added simultaneously.
							</p>
						</ModalSection>
						<ModalHeader>
							<h1>Add stakeholdergroup</h1>
						</ModalHeader>
						<ModalSection>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'stakeholdergroup.name')}
									//label="Please enter stakeholdergroup name"
									placeholder="Stakeholdergroup name"
									type="text"
									//value={organisation.ls_account}
							/>
							</ModalSection>
							<ModalHeader>
							<h1>Add stakholder</h1>
							</ModalHeader>
							<ModalSection>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'stakeholder.firstname')}
									//label="Please enter stakeholdergroup name"
									placeholder="First Name"
									type="text"
									//value={organisation.ls_account}
							/>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'stakeholder.lastname')}
									//label="Please enter stakeholdergroup name"
									placeholder="Last Name"
									type="text"
									//value={organisation.ls_account}
							/>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'stakeholder.email')}
									//label="Please enter stakeholdergroup name"
									placeholder="Email adress"
									type="text"
									//value={organisation.ls_account}
							/>
							<Select
								//label="Select group"
								onChange={linkState(this, 'sgId', 'value')}
								isCompact
								options={sglist}
								placeholder="Select group"
								value={sgId}
							/>
						</ModalSection>
						<ModalFooter>
							<ButtonGroup>
								<Button
									appearance="default"
									disabled={sgId === ''}
									type="submit"
								>
									Add
								</Button>
								<Button appearance="subtle-link" onClick={this.toggleModal} type="button">Cancel</Button>
							</ButtonGroup>
						</ModalFooter>
					</form>
				</Modal>
				<Modal
					isOpen={showCSVModal}
				>
					<form onSubmit={this.openInput}>
						<ModalHeader>
							<h1>Add people</h1>
						</ModalHeader>
						<ModalSection>
							<p>
								Please select stakeholdergroup first prior to import. Morover, the file should be a standard CSV (comma delimited) file, with the <b>mandatory</b> headers of firstname, lastname and email.
							</p>
							<Select
								label="Stakeholdergroup"
								onChange={linkState(this, 'sgId', 'value')}
								options={sglist}
								placeholder="Choose stakeholdergroup"
								value={sgId}
							/>
						</ModalSection>
						<ModalFooter>
							<ButtonGroup>
								<Button
									appearance="default"
									disabled={sgId === ''}
									onClick={this.openInput}
									type="button"
								>
									Import
								</Button>
								<Button appearance="subtle-link" onClick={this.toggleCSVModal} type="button">Cancel</Button>
							</ButtonGroup>
							{csvInput}
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
		console.log(fr);
		fr.onload = this.onFileLoad;
		fr.readAsText(file);
		this.toggleCSVModal();
	}
	private onFileLoad = (ev: ProgressEvent) => {
		const { srcElement }: { srcElement: Partial<FileReader> } = ev;
		const { result } = srcElement;
		const { UIStore } = this.props;

		if (!result) {
			UIStore.addFlag({ appearance: 'error', title: 'Error', description: 'Could not read the selected file.' });
			return;
		}

		const header = 'firstname,lastname,email';
		if (result.slice(0,header.length) !== header) {
			UIStore.addFlag({ appearance: 'error', title: 'CSV header error', description: 'The file headers and colomns are not in the correct format, please revise' });
			return;
		}

		csv().fromString(result.toString()).then((csvResult) => {
			console.log(csvResult);
			csvResult.forEach(csvRow => {
				const sth: Stakeholder[] = csvRow;
				console.log(sth);
				this.addStakeholder(sth);
			});
		});
	}

	private toggleModal = () => this.setState(toggleModal);
	private toggleCSVModal = () => this.setState(toggleCSVModal);

	private onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { state } = this;
		const { UIStore } = this.props;
		const stakeholdergroup = { ...state.stakeholdergroup } ;
		const stakeholder = { ...state.stakeholder } ;

		console.log(stakeholder);

		if (stakeholdergroup.name !== undefined) return this.addStakeholderGroup(stakeholdergroup);
		else if (stakeholder.firstname !== undefined && stakeholder.lastname !== undefined && stakeholder.email !== undefined) return this.addStakeholder(stakeholder);
		// fixMe: stakeholdergroup id to be added to add stakeholder
		else UIStore.addFlag({ appearance: 'error', title: 'Stakeholder data', description: 'Please provide firstname, lastname and email adress.' });

	}
	private onRemove = (sId) => () => {
		const { props } = this;
		const { history, match: { params: { orgId } }, OrganisationsStore } = props;
		let { stakeholderData } = props;
		//const stakeholder = { ...state.stakeholder } ;

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			console.log('stakeholder deleted');
			location.reload(true);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
					// TODO: Show flag
			console.log('failed:', error);
		};
		console.log(sId);
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.removeStakeholder(orgId, sId, { onSuccess, onError });
	}

	private addStakeholderGroup = (stakeholdergroup) => {
		const { props } = this;
		const { history, OrganisationsStore, match: { params: { orgId } } } = props;
		stakeholdergroup.name = stakeholdergroup.name[0].toUpperCase() + stakeholdergroup.name.slice(1);

		stakeholdergroup.name = stakeholdergroup.name;
		stakeholdergroup._orgId = orgId;
		stakeholdergroup._sgId = this.capitalizeLetters(stakeholdergroup.name);
		stakeholdergroup._id = `${orgId}/stakeholdergroups/${stakeholdergroup._sgId}`;
		console.log(stakeholdergroup);

		const onSuccess = () => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			console.log('stakeholdergroupadded');
			history.push(`/${orgId}/stakeholders`);
		};

		const onError = (error) => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
				// TODO: Show flag
			console.log('failed:', error);
		};
		//props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.addStakeholderGroup(stakeholdergroup, { onSuccess, onError });
	}
	private addStakeholder = (stakeholder) => {
		const { props } = this;
		const { history, OrganisationsStore, match: { params: { orgId } } } = props;
		const { sgId } = this.state;

		const sId = stakeholder.lastname + stakeholder.firstname + this.getRandomID();
		stakeholder.firstname = stakeholder.firstname.toLowerCase()[0].toUpperCase() + stakeholder.firstname.toLowerCase().slice(1) ;
		stakeholder.lastname = stakeholder.lastname.toLowerCase()[0].toUpperCase() + stakeholder.lastname.toLowerCase().slice(1) ;

		stakeholder.name = stakeholder.firstname + ' ' + stakeholder.lastname;
		stakeholder._orgId = orgId;
		stakeholder.sgId = sgId;
		stakeholder._sId = sId;
		stakeholder._id = `${orgId}/stakeholders/${sId}`;

		console.log(stakeholder);

		const onSuccess = () => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			console.log('added to firebase');
			history.push(`/${orgId}/stakeholders`);
		};

		const onError = (error) => {
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
const toggleCSVModal = (prevState: State) => ({ showCSVModal: !prevState.showCSVModal });
