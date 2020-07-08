import csv from 'csvtojson';
import linkState from 'linkstate';
import { inRange, isUndefined, map, merge} from 'lodash';
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
import { Table } from '../../components/Table';
import { Stakeholder, Stakeholdergroup } from '../../domain/Organisation';
import { getCurrentUserAccess } from '../../stores/helpers';
import { UIStore, OrganisationsStore } from 'src/stores';
import { isNullOrUndefined } from 'util';
import collection from '../../stores/collection';


interface State {
	sgId: string;
	showModal: boolean;
	showCSVModal: boolean;
	showDeleteModal: boolean;
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
		showDeleteModal: false,
		userId: '',
		stakeholdergroup: null,
		stakeholder: null,
		stakeholdersData: null
	};

	render () {
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		let { sgId, showModal, showCSVModal, showDeleteModal, stakeholdersData, stakeholdergroup } = this.state;
		const organisation = OrganisationsStore.findById(orgId);
		stakeholdersData = {};

		map(organisation._stakeholdergroups, ({ stakeholders }) => merge(stakeholdersData, stakeholders));
		const stakeholdergroups = organisation._stakeholdergroups;
		const users = organisation._users;
		const currentUserAccess = getCurrentUserAccess(state, organisation);

		const sglist = [];

		map(stakeholdergroups,({ name , _sgId }) => sglist.push({ label: name, value: _sgId }));

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
					{inRange(currentUserAccess, 30, 101) && <Button appearance="error" onClick={this.toggleDeleteModal}>Delete</Button>}
				</Header>
				<Container style={{ display: 'block' }}>
				<Table
					columns={[
						{
							key: 'name',
							label: 'Name'
							//format: (name, { _id }) => <Link to={this.toggleModal}>{name}</Link> // When click --> edit
						},
						{
							key: 'email',
							label: 'Email',
							format: (email) => email.toLowerCase()
						},
						{
							key: '_sgId',
							label: 'Group',
							format: (_sgId) => _sgId.toLowerCase()[0].toUpperCase() + _sgId.toLowerCase().slice(1)
						}
					]}
					data={stakeholdersData}
					defaultSort="name"
					//filters={['name', 'email', 'sgId', 'createdBy']}
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
									placeholder="Stakeholdergroup name"
									type="text"
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
									placeholder="First Name"
									type="text"
							/>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'stakeholder.lastname')}
									placeholder="Last Name"
									type="text"
							/>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'stakeholder.email')}
									placeholder="Email adress"
									type="text"
							/>
							<Select
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
									//disabled={/*sgId !== '' || stakeholdergroup.name !== ''  FIXME*/}
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
							<p>
								If no stakeholdergroup can be selected, please add one on the previous page.
							</p>
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
				<Modal
					isOpen={showDeleteModal}
					onClose={this.toggleDeleteModal}
				>
					<form onSubmit={this.onRemove}>
						<ModalHeader>
							<h1>Delete stakeholdergroup</h1>
							<p>
								Please select a stakeholdergroup to be deleted.
							</p>
						</ModalHeader>
							<ModalSection>
							<Select
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
									appearance="error"
									//disabled={/*sgId !== '' || stakeholdergroup.name !== ''  FIXME*/}
									type="submit"
								>
									Delete
								</Button>
								<Button appearance="subtle-link" onClick={this.toggleDeleteModal} type="button">Cancel</Button>
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
		console.log(fr);
		fr.onload = this.onFileLoad;
		fr.readAsText(file);
		this.toggleCSVModal();
	}
	private onFileLoad = (ev: ProgressEvent) => {
		const { srcElement }: { srcElement: Partial<FileReader> } = ev;
		const { result } = srcElement;
		const { UIStore } = this.props;
		const sgId = this.state.sgId ;
		const { history, match: { params: { orgId } } } = this. props;

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
			csvResult.forEach(csvRow => {
				const sth = csvRow;
				sth._sgId = sgId;
				this.addStakeholderGroup(undefined, sth);
			});
		});
		history.push(`/${orgId}/stakeholders`);
	}

	private toggleModal = () => this.setState(toggleModal);
	private toggleCSVModal = () => this.setState(toggleCSVModal);
	private toggleDeleteModal = () => this.setState(toggleDeleteModal);


	private onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { state } = this;
		const { UIStore } = this.props;
		const stakeholdergroup = { ...state.stakeholdergroup } ;
		const stakeholder = { ...state.stakeholder } ;
		const sgId = state.sgId ;
		stakeholder._sgId = sgId;

		console.log(stakeholder);
		if (stakeholdergroup.name !== undefined) return this.addStakeholderGroup(stakeholdergroup);
		else if (stakeholder.firstname !== undefined && stakeholder.lastname !== undefined && stakeholder.email !== undefined) return this.addStakeholderGroup(undefined, stakeholder);
		// fixMe: stakeholdergroup id to be added to add stakeholder
		else UIStore.addFlag({ appearance: 'error', title: 'Stakeholder data', description: 'Please provide firstname, lastname and email adress.' });

	}

	private onRemove = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { state } = this;
		const sgId = state.sgId ;

		const { props } = this;
		const { history, match: { params: { orgId } }, OrganisationsStore } = props;
		const organisation = OrganisationsStore.findById(orgId);
		const stakeholdergroup = collection(organisation._stakeholdergroups).findById(`${orgId}/${sgId}`);


		const onSuccess = () => {
			collection(organisation._stakeholdergroups).remove(stakeholdergroup);
			console.log('stakeholdergroup deleted');
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			//history.push(`/${orgId}/stakeholders`);
			location.reload(true);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
					// TODO: Show flag
			console.log('failed:', error);
		};
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.removeStakeholderGroup(stakeholdergroup, { onSuccess, onError });
	}

	private addStakeholderGroup = (stakeholdergroup?, stakeholder?) => {
		const { props } = this;
		const { history, OrganisationsStore, match: { params: { orgId } } } = props;
		let groupObject: Stakeholdergroup = {
			name: null,
			_orgId: null,
			_sgId: null,
			_id: null
		};


		if (!isNullOrUndefined(stakeholdergroup)) {
			const _sgId = this.capitalizeLetters(stakeholdergroup.name);
			groupObject.name = stakeholdergroup.name[0].toUpperCase() + stakeholdergroup.name.slice(1);
			groupObject._orgId = orgId;
			groupObject._sgId = _sgId;
			groupObject._id = `${orgId}/${stakeholdergroup._sgId}`;
		} else
		if (!isNullOrUndefined(stakeholder)) {
			const organisation = OrganisationsStore.findById(orgId);
			console.log(stakeholder);
			groupObject = collection(organisation._stakeholdergroups).findById(`${orgId}/${stakeholder._sgId}`);
			const sId = stakeholder.lastname + stakeholder.firstname + this.getRandomID();
			if (isUndefined(groupObject.stakeholders)) groupObject.stakeholders = {};
			groupObject.stakeholders[sId] = {
				_sgId: stakeholder._sgId,
				_sId: sId,
				name: stakeholder.firstname + ' ' + stakeholder.lastname,
				firstname: stakeholder.firstname,
				lastname: stakeholder.lastname,
				email: stakeholder.email
			};
		}
		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			console.log('stakeholder data added');
			location.reload(true);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
				// TODO: Show flag
			console.log('failed:', error);
		};
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.addStakeholderGroup(groupObject, { onSuccess, onError });
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
const toggleDeleteModal = (prevState: State) => ({ showDeleteModal: !prevState.showDeleteModal });

