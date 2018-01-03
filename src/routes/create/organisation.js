import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import StandaloneForm, { FormButtonsContainer } from 'components/StandaloneForm';
import { app } from 'mobx-app';
import attempt from 'lodash/attempt';
import Button from 'components/Button';
import Helmet from 'react-helmet';
import Input from 'components/Input';
import isError from 'lodash/isError';
import linkState from 'linkstate';
import Main from 'components/Main';
import slug from 'slug';

@inject(app('AuthStore', 'MVCStore', 'OrganisationsStore'))
@observer
class CreateOrganisation extends Component {
	state = {
		error: '',
		isPublic: false,
		name: 'My Organisation'
	}

	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({ error: '' });

		const { AuthStore, history, MVCStore, OrganisationsStore } = this.props;
		const { isPublic, name } = this.state;
		const currentUser = AuthStore.findById('current');

		MVCStore.setBusy(true);
		// Store new organisation in database.
		const org = await attempt(() => OrganisationsStore.createOrganisation({ isPublic, name }));
		if (isError(org)) {
			MVCStore.setBusy(false);
			return this.handleError(org);
		}
		// Add current user as owner of newly created organisation.
		const add = await attempt(() => OrganisationsStore.addUser(org._id, currentUser._uid, 'owner'));
		MVCStore.setBusy(false);
		if (isError(add)) return this.handleError(org);
		// Redirect to newly created organisation page.
		history.push(`/${org._id}`);
	}

	handleError = ({ code, message }) => {
		// If no code is provided, we are dealing with a custom error so there is
		// no need to create a message manually.
		if (!code) return this.setState({ error: message });

		// Display custom error messages for errors thrown by Firebase.
		switch (code) {
			// TODO: Actually handle the codes.
			default: return this.setState({ error: 'An unknown error occurred' });
		}
	}

	render = () => {
		const { error, name, isPublic } = this.state;
		const { state } = this.props;
		const { busy } = state;
		const id = slug(name, { lower: true });
		const disabled = busy || id === '' || id === 'my-organisation';

		// TODO: Display errors somewhere.
		return (
			<Main>
				<Helmet title="Create an organisation" />
				<StandaloneForm
					title="Create a new organisation"
					onSubmit={this.onSubmit}
				>
					<Input
						label="Organisation name"
						help={<span>Your organisation's ID will be <strong>{ id }</strong>.</span>}
						value={name}
						onChange={linkState(this, 'name')}
						disabled={busy}
						required
					/>
					<Input
						label="Access level"
						help="This is a public organisation"
						type="checkbox"
						value={isPublic}
						onChange={linkState(this, 'isPublic', 'target.checked')}
						disabled={busy}
					/>
					<FormButtonsContainer>
						<Button
							type="submit"
							disabled={disabled}
						>Create organisation</Button>
						<Link to="/">Cancel</Link>
					</FormButtonsContainer>
				</StandaloneForm>
			</Main>
		);
	}
}

export default withRouter(CreateOrganisation);