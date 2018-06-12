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

interface State {
	organisation: Organisation;
}

@inject(app('OrganisationsStore'))
@observer
class OrganisationSettingsDetails extends Component<any, State> {
	readonly state: State = {
		organisation: null
	};

	componentWillMount () {
		this.resetForm();
	}

	render () {
		const { match: { params: { orgId } }, OrganisationsStore, state } = this.props;
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
								isCompact
								label="Name"
								onChange={linkState(this, 'organisation.name')}
								required
								value={organisation.name}
							/>
							<Input
								appearance="default"
								isCompact
								label="Avatar"
								onChange={linkState(this, 'organisation.image')}
								type="image"
								value={organisation.avatar || '/assets/images/organisation-avatar-placeholder.png'}
							/>
							<TextArea
								appearance="default"
								isCompact
								label="Description"
								onChange={linkState(this, 'organisation.description')}
								value={organisation.description}
							/>
							<Input
								appearance="default"
								checked={organisation.isPublic}
								help={`Public ${organisation.isNetwork ? 'network' : 'organisation'}s and their ${organisation.isNetwork ? 'organisation' : 'report'}s are visible to anyone. Explicitly granted access is still required for certain operations.`}
								isCompact
								label="Public"
								onChange={linkState(this, 'organisation.isPublic', 'target.checked')}
								placeholder={`This is a public ${organisation.isNetwork ? 'network' : 'organisation'}`}
								type="checkbox"
							/>
							<FormActions>
								<Button appearance="default" disabled={preventSubmit} type="submit">Save details</Button>
								<Button appearance="link" onClick={this.resetForm} type="button">Cancel</Button>
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
	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { props, state } = this;
		const { history, match: { params: { orgId } }, OrganisationsStore } = props;
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

		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.updateOrganisation(organisation, { onSuccess, onError });
	}
}

export default withRouter(OrganisationSettingsDetails);
