import linkState from 'linkstate';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MdClose from 'react-icons/lib/md/close';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import Input from '../../../components/NewInput';

interface State {
	name: string;
	showModal: boolean;
}

@inject(app('OrganisationsStore'))
@observer
export default class NetworkSettingsAdvanced extends Component<any, State> {
	readonly state: State = {
		name: '',
		showModal: false
	};

	render() {
		const { match: { params: { netId } }, OrganisationsStore } = this.props;
		const { name, showModal } = this.state;
		const network = OrganisationsStore.getItem(netId, '_id');

		return (
			<React.Fragment>
				<Header
					title="Advanced"
					headTitle={`Advanced - ${network.name} / Settings`}
					breadcrumbs={[
						<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
						<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
					]}
				/>
				<Container>
					<Button appearance="error" onClick={this.toggleModal}>Delete this network</Button>
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
								This action <strong>cannot</strong> be undone. This will permanently delete the <strong>{network.name} </strong>
								network. All aggregated reports will be lost. Organisations part of this network will <strong>not </strong>
								be influenced by this action.
							</p>
							<p>
								Please type in the name of the network to confirm.
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
								disabled={name !== network.name}
								style={{ width: '100%' }}
								type="submit"
							>
								Delete this network
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
