import Form, { Alert, Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Helmet from 'react-helmet';
import isString from 'lodash/isString';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import omit from 'lodash/omit';
import slug from 'slugify';
import trim from 'lodash/trim';
import { withRouter } from 'react-router-dom';

const isBlank = (str) => !trim(str);

@inject(app('OrganisationsStore', 'VisualStore'))
@observer
class CreateOrganisation extends Component {
	state = {
		name: '',
		id: '',
		description: '',
		isPublic: false,
		avatar: '',
		error: ''
	}

	slugify = (str) => slug(str, { lower: true, remove: /[=`#%^$*_+~.()'"!\\:@]/g });
	
	onChangeAvatar = ({ target: { files } }) => this.setState({ avatar: files[0] });

	onChangeName = ({ target: { value } }) => {
		const { name, id } = this.state;
		return id === this.slugify(name) ? this.setState({ name: value, id: this.slugify(value) }) : this.setState({ name: value });
	}

	onBlurId = () => {
		const { name, id } = this.state;
		return id === '' ? this.setState({ id: this.slugify(name) }) : this.setState({ id: this.slugify(id) });
	}

	onSubmit = async (event) => {
		const { id } = this.state;
		const organisation = { ...omit(this.state, 'error', 'id'), _id: id };
		const { history, OrganisationsStore, VisualStore } = this.props;

		event.preventDefault();
		this.setState({ error: null });
		VisualStore.setBusy(true);
		
		const { code: code1 } = await OrganisationsStore.create(organisation);
		if (code1) {
			VisualStore.setBusy(false);
			this.handleError(code1);
			return;
		}

		const { code: code2 } = await OrganisationsStore.addUser(id);
		VisualStore.setBusy(false);
		if (code2) this.handleError(code2);
		else history.push(`/${id}`);
	}

	handleError = (code) => {
		switch (code) {
			case 'already-exists': return this.setState({ error: `An organisation or network with ID "${this.state.id}" already exists.` });
			default: return this.setState({ error: 'An unknown error has occurred' });
		}
	}

	render = () => {
		const { state } = this.props;
		const { busy } = state;
		const { name, description, id, isPublic, error } = this.state;
		const avatar = isString(this.state.avatar) ? this.state.avatar : URL.createObjectURL(this.state.avatar);
		const shouldPreventSubmit = isBlank(name) || isBlank(id) || busy;

		return (
			<Fragment>
				<Helmet title="Create an organisation" />
				<Form standalone onSubmit={this.onSubmit}>
					<header>
						<h1>Create an organisation</h1>
					</header>
					<section>
						<Alert message={error} type="error" />
						<Input
							label="Name"
							required
							value={name}
							onChange={this.onChangeName}
							onBlur={this.onBlurName}
							disabled={busy}
						/>
						<Input
							label="URL"
							help="This will be the URL for your organisation. You will not be able to change it later, so choose carefully."
							prefix={`${window.location.hostname}/`}
							required
							value={id}
							onChange={linkState(this, 'id')}
							onBlur={this.onBlurId}
							disabled={busy}
						/>
						<Input
							type="text"
							label="Description"
							long
							value={description}
							onChange={linkState(this, 'description')}
							disabled={busy}
						/>
						<Input
							type="checkbox"
							label="Privacy"
							secondLabel="This is a public organisation"
							help={isPublic ? 'Public organisations can be viewed by anyone, but other rights have to explicitly be assigned.' : 'Private organisations are only visible to you and anyone who has been given direct access to the organisation.'}
							value={isPublic}
							onChange={linkState(this, 'isPublic')}
							disabled={busy}
						/>
						<Input
							type="image"
							label="Avatar"
							value={avatar}
							onChange={this.onChangeAvatar}
							disabled={busy}
						/>
					</section>
					<footer>
						<Button type="submit" disabled={shouldPreventSubmit}>Create organisation</Button>
						<Link to="/">Cancel</Link>
					</footer>
				</Form>
			</Fragment>
		);
	}
}

export default withRouter(CreateOrganisation);