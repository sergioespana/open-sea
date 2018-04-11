import linkState from 'linkstate';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import Input from '../../../components/NewInput';
import { Link } from '../../../components/Link';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import MdClose from 'react-icons/lib/md/close';

interface State {
	name: string;
	showModal: boolean;
}

@inject(app('OrganisationsStore'))
@observer
export default class OrganisationSettingsAdvanced extends Component<any, State> {
	readonly state: State = {
		name: '',
		showModal: false
	};

	render () {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const { name, showModal } = this.state;
		const organisation = OrganisationsStore.getItem(orgId, '_id');

		return (
			<React.Fragment>
				<Header
					title="Advanced"
					headTitle={`Advanced - ${organisation.name} / Settings`}
					breadcrumbs={[
						<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
						<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
					]}
				/>
				<Container>
					<Button appearance="error" onClick={this.toggleModal}>Delete this organisation</Button>
				</Container>
				<Modal
					isOpen={showModal}
					onClose={this.toggleModal}
				>
					<form>
						<ModalHeader>
							<h1>Are you absolutely sure?</h1>
							<Button appearance="subtle" onClick={this.toggleModal}><MdClose /></Button>
						</ModalHeader>
						<ModalSection>
							<p>
								This action <strong>cannot</strong> be undone. This will permanently delete the <strong>{organisation.name} </strong>
								organisation, its reports, and accompanying data.
							</p>
							<p>
								Please type in the name of the organisation to confirm.
							</p>
							<Input
								appearance="default"
								onChange={linkState(this, 'name')}
								value={name}
							/>
						</ModalSection>
						<ModalFooter>
							<Button
								appearance="error"
								disabled={name !== organisation.name}
								style={{ width: '100%' }}
								type="submit"
							>
								Delete this organisation
							</Button>
						</ModalFooter>
					</form>
				</Modal>
			</React.Fragment>
		);
	}

	private toggleModal = () => this.setState(toggleModal);
}

const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
