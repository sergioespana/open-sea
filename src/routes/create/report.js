import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import StandaloneForm, { FormButtonsContainer } from 'components/StandaloneForm';
import { app } from 'mobx-app';
import attempt from 'lodash/attempt';
import Button from 'components/Button';
import fromPairs from 'lodash/fromPairs';
import Helmet from 'react-helmet';
import Input from 'components/Input';
import isError from 'lodash/isError';
import linkState from 'linkstate';
import Main from 'components/Main';
import map from 'lodash/map';
import slug from 'slug';

@inject(app('MVCStore', 'ReportsStore'))
@observer
class CreateReport extends Component {
	state = {
		error: '',
		name: 'My Report',
		orgId: ''
	}

	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({ error: '' });

		const { history, MVCStore, ReportsStore } = this.props;
		const { name, orgId } = this.state;

		MVCStore.setBusy(true);
		// Add current user as owner of newly created organisation.
		const rep = await attempt(() => ReportsStore.createReport({ name, _orgId: orgId }));
		MVCStore.setBusy(false);
		if (isError(rep)) return this.handleError(orgId);
		// Redirect to newly created report page.
		history.push(`/${orgId}/${rep._id}`);
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
		const { error, name, orgId } = this.state;
		const { state } = this.props;
		const { busy, organisations } = state;
		const id = slug(name, { lower: true });
		const disabled = busy || id === '' || id === 'my-report' || orgId === '';

		return (
			<Main>
				<Helmet title="Create a report" />
				<StandaloneForm
					title="Create a new report"
					onSubmit={this.onSubmit}
				>
					<Input
						label="Report name"
						help={<span>Your report's ID will be <strong>{ id }</strong>.</span>}
						value={name}
						onChange={linkState(this, 'name')}
						disabled={busy}
					/>
					<Input
						type="select"
						label="Organisation"
						help={error}
						value={orgId}
						options={map(organisations, ({ name }, id) => fromPairs([['text', name], ['value', id]]))}
						onChange={linkState(this, 'orgId', 'target.value')}
						disabled={busy}
					/>
					<FormButtonsContainer>
						<Button
							type="submit"
							disabled={disabled}
						>Create report</Button>
						<Link to="/">Cancel</Link>
					</FormButtonsContainer>
				</StandaloneForm>
			</Main>
		);
	}
}

export default withRouter(CreateReport);