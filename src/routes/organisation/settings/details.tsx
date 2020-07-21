import linkState from 'linkstate';
import { isEqual } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, FormEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '../../../components/Button';
import Container from '../../../components/Container';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Input, { TextArea } from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import { Organisation } from '../../../domain/Organisation';
import { requestValidate } from '../../../util/lime-api';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';


interface State {
	organisation: Organisation;
	showModal: boolean;
}

@inject(app('OrganisationsStore', 'UIStore'))
@observer
class OrganisationSettingsDetails extends Component<any, State> {
	readonly state: State = {
		organisation: null,
		showModal: false
	};

	componentWillMount () {
		this.resetForm();
	}

	render () {
		const { match: { params: { orgId } }, OrganisationsStore, UIStore, state } = this.props;
		const { organisation, showModal } = this.state;
		const originalOrg = OrganisationsStore.findById(orgId);
		const preventSubmit = true/*state.isBusy || isEqual(organisation, originalOrg)*/;

		return (
			<React.Fragment>
				<Header
					title="Details"
					headTitle={`Details - ${originalOrg.name} / Settings`}
					breadcrumbs={[
						<Link key={`/${orgId}`} to={`/${orgId}`}>{originalOrg.name}</Link>,
						<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
					]}
				/>
				<Container>
					<Section>
						<Form onSubmit={this.onSubmit}>
							<Input
								appearance="default"
								disabled
								isCompact
								label="Name"
								onChange={linkState(this, 'organisation.name')}
								required
								value={organisation.name}
							/>
							<Input
								appearance="default"
								disabled
								isCompact
								label="Avatar"
								onChange={linkState(this, 'organisation.image')}
								type="image"
								value={organisation.avatar || '/assets/images/organisation-avatar-placeholder.png'}
							/>
							<TextArea
								appearance="default"
								disabled
								isCompact
								label="Description"
								onChange={linkState(this, 'organisation.description')}
								value={organisation.description}
							/>
							<Input
								appearance="default"
								checked={organisation.isPublic}
								disabled
								help={`Public ${organisation.isNetwork ? 'network' : 'organisation'}s and their ${organisation.isNetwork ? 'organisation' : 'report'}s are visible to anyone. Explicitly granted access is still required for certain operations.`}
								isCompact
								label="Public"
								onChange={linkState(this, 'organisation.isPublic', 'target.checked')}
								placeholder={`This is a public ${organisation.isNetwork ? 'network' : 'organisation'}`}
								type="checkbox"
							/>
						<h2>LimeSurvey Credentials</h2>
						<Button appearance="light" onClick={this.toggleModal} type="button"> Instructions</Button>
								<Input
									appearance="default"
									disabled={false}
									isCompact
									label="Enter limesurvey host"
									onChange={linkState(this, 'organisation.ls_host')}
									//placeholder="Enter limesurvey host"
									//required
									help="e.g. mysurvey.limequery.org"
									type="text"
									value={organisation.ls_host}
							/>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'organisation.ls_account')}
									label="Enter limesurvey account"
									//required
									type="text"
									value={organisation.ls_account}
							/>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'organisation.ls_password')}
									label="Enter limesurvey password"
									//required
									type="password"
									value={organisation.ls_password}
							/>
							<FormActions>
								<Button appearance="default" disabled={false} type="submit">Save details</Button>
								{/* <Button appearance="link" onClick={this.resetForm} type="button">Cancel</Button> */}
							</FormActions>
						</Form>
					</Section>
				</Container>
				<Modal
					isOpen={showModal}
					onClose={this.toggleModal}
					width={10000}
				>
					<form onSubmit={this.onSubmit}>
						<ModalHeader>
							<h1>Limesurvey instructions</h1>
						</ModalHeader>
						<ModalSection>
								<h2>Create LimeSurvey account and instance</h2>
								<ol>
									<li>Create a LimeSurvey account at <a href="https://www.limesurvey.org/en/">limesurvey.org</a></li>
									<li>Activate the account via the activation link obtained in email.</li>
									<li>Create a LimeSurvey instance at <a href="https://account.limesurvey.org/your-account/your-limesurvey-profile">account.limesurvey.org</a> </li>
									<li>Provide the details for the LimeSurvey instance:</li>
									<ol>
									<li>Own defined unqiue <i>domain name</i></li>
									<li>Server <i>location</i></li>
									<li>Domain host <i>limequery.org</i></li>
									</ol></ol>
										<p/>
								<h2>Configure LimeSurvey instance</h2>
								<ol>
									<li>Go to https://<i>[domain name]</i>.limequery.org/index.php/admin</li>
									<ul><small>Replace <i>[domain name]</i> with the domain name credentials as defined in 4.3</small></ul>
									<li>Go to <i>Configuration / Global settings / Interfaces</i></li>
									<li>Activate remote RPC with the following options</li>
									<ol>
										<li>RPC interface enabled: <i>JSON-RPC</i></li>
										<li>Publish API on /admin/remotecontrol: <i>On</i></li>
										<li>Set Access-Control-Allow-Origin header: <i>Off</i></li>
									</ol>
									<li>Save changes</li>
									</ol>
									<p/>
									<h2>Activate CORS changer</h2>
									<ol>
										<li>Download a <i>CORS CHANGER</i> browser plugin</li>
										<ul><small>In our example we use Google Chrome with the plugin Moesif origin and CORS CHANGER.</small></ul>
										<li>In Access Control Allow Headers at the following; <i>path,host,user-agent,connection,Accept,Content-Type</i></li>
										<li>In domain list provide domain name credentials as defined in 4.3</li>
										<ul><small>For example; http://openesea.limequery.org</small></ul>
									</ol>
									<p><b>Please be aware to turn the plugin off after use </b></p>
									<Button appearance="default" onClick={this.toggleModal} type="button">Ok</Button>
						</ModalSection>
					</form>
				</Modal>
			</React.Fragment>
		);
	}
	private toggleModal = () => this.setState(toggleModal);

	private resetForm = () => {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		return this.setState({ organisation: { ...OrganisationsStore.findById(orgId) } });
	}
	private onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { props, state } = this;
		const { history, match: { params: { orgId } }, OrganisationsStore, UIStore } = props;
		const { organisation } = state;

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${orgId}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
		};

		if (organisation.ls_host !== undefined || '' && organisation.ls_account !== undefined || '' && organisation.ls_password !== undefined || '') {
			await requestValidate(organisation.ls_host,[organisation.ls_account, organisation.ls_password]).then(res => {
				if (res.data.result.status === undefined) {
					UIStore.addFlag({ appearance: 'success', title: 'LimeSurvey: ', description: 'Credentials are valid' });
					props.state.isBusy = true; // FIXME: Use setAppState for this when it works
					return OrganisationsStore.updateOrganisation(organisation, { onSuccess, onError });
				} else UIStore.addFlag({ appearance: 'error', title: 'LimeSurvey: ', description: res.data.result.status.toString() });})
				.catch(err => {
					console.log(err);
					UIStore.addFlag({ appearance: 'error', title: 'LimeSurvey: ', description: 'Cannot connect to Limesurvey, please check the instructions above' });
				});
		} 
	}
}
const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
export default withRouter(OrganisationSettingsDetails);
