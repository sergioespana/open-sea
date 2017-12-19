import React, { PureComponent } from 'react';
import StandaloneForm, { FormButtonsContainer } from 'components/StandaloneForm';
import Button from 'components/Button';
import Helmet from 'react-helmet';
import { inject } from 'mobx-react';
import Input from 'components/Input';
import { Link } from 'react-router-dom';
import linkState from 'linkstate';
import Main from 'components/Main';
import slug from 'slug';

@inject('OrganisationsStore') class New extends PureComponent {
	state = {
		isPublic: false,
		name: 'My Organisation'
	}

	onSubmit = (event) => {
		event.preventDefault();
		let { OrganisationsStore } = this.props,
			{ isPublic, name } = this.state;

		// TODO: Handle these settings (second arg) in create method
		return OrganisationsStore.create(name, { isPublic });
	}

	render = () => {
		let { name, isPublic } = this.state,
			sluggedName = slug(name).toLowerCase(),
			disableButton = sluggedName === '' || sluggedName === 'my-organisation';

		return (
			<Main>
				<Helmet title="Create an organisation" />
				<StandaloneForm
					title="Create a new organisation"
					onSubmit={this.onSubmit}
				>
					<Input
						label="Organisation name"
						help={<span>Your organisation's ID will be <strong>{ sluggedName }</strong></span>}
						value={name}
						onChange={linkState(this, 'name')}
					/>
					<Input
						label="Access level"
						help="This is a public organisation"
						type="checkbox"
						value={isPublic}
						onChange={linkState(this, 'isPublic', 'target.checked')}
					/>
					<FormButtonsContainer>
						<Button type="submit" disabled={disableButton}>Create organisation</Button>
						<Link to="/">Cancel</Link>
					</FormButtonsContainer>
				</StandaloneForm>
			</Main>
		);
	}
}

export default New;