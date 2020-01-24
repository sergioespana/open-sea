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

interface State {
	organisation: Organisation;
}

@inject(app('OrganisationsStore', 'UIStore'))
@observer
class OrganisationSettingsDetails extends Component<any, State> {
	readonly state: State = {
		organisation: null
	};

	componentWillMount () {
		this.resetForm();
	}

	render () {
		const { match: { params: { orgId } }, OrganisationsStore, UIStore, state } = this.props;
		const { organisation } = this.state;
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
						<h2>Limesurvey Credentials</h2>
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
			</React.Fragment>
		);
	}

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
				} else UIStore.addFlag({ appearance: 'error', title: 'LimeSurvey: ', description: res.data.result.status.toString() });})
				.catch(err => {
					UIStore.addFlag({ appearance: 'error', title: 'LimeSurvey: ', description:  'The host name is incorrect or cors is not disabled as explained in ..' });
				});
		}
		return OrganisationsStore.updateOrganisation(organisation, { onSuccess, onError });
	}
}

export default withRouter(OrganisationSettingsDetails);
