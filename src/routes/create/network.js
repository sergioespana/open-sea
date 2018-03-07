import { Checkbox, TextField } from 'components/Input';
import Form, { Alert, Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Helmet from 'react-helmet';
import isString from 'lodash/isString';
import linkState from 'linkstate';
import omit from 'lodash/omit';
import { reaction } from 'mobx';
import slug from 'slugify';
import trim from 'lodash/trim';
import { withRouter } from 'react-router-dom';

const isBlank = (str) => !trim(str);

@inject(app('OrganisationsStore', 'VisualStore'))
@observer
class CreateNetwork extends Component {
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
		const organisation = { ...omit(this.state, 'error', 'id'), _id: id, isNetwork: true };
		const { OrganisationsStore, VisualStore } = this.props;

		event.preventDefault();
		this.setState({ error: null });
		VisualStore.setBusy(true);
		
		try { await OrganisationsStore.create(organisation); }
		catch (error) { this.handleError(error); }
	}

	handleError = (error) => {
		console.log(error);
	}

	onCreated = reaction(
		() => this.props.state.organisations.length,
		() => {
			const { id } = this.state;
			const { history, state, VisualStore } = this.props;
			const { busy } = state;

			if (busy) {
				VisualStore.setBusy(false);
				history.push(`/${id}`);
			}
		}
	);

	render = () => {
		const { state } = this.props;
		const { busy } = state;
		const { name, description, id, isPublic, error } = this.state;
		const avatar = isString(this.state.avatar) ? this.state.avatar : URL.createObjectURL(this.state.avatar);
		const shouldPreventSubmit = isBlank(name) || isBlank(id) || busy;

		return (
			<Fragment>
				<Helmet title="Create a network" />
				<Form standalone onSubmit={this.onSubmit}>
					<header>
						<h1>Create a network</h1>
					</header>
					<section>
						<Alert message={error} type="error" />
						<TextField
							label="Name"
							required
							value={name}
							onChange={this.onChangeName}
							onBlur={this.onBlurName}
							disabled={busy}
							compact
						/>
						<TextField
							label="URL"
							help="This will be the URL for your network. You will not be able to change it later, so choose carefully."
							prefix={`${window.location.hostname}/`}
							required
							value={id}
							onChange={linkState(this, 'id')}
							onBlur={this.onBlurId}
							disabled={busy}
							compact
						/>
						<TextField
							type="text"
							multiLine
							rows={4}
							label="Description"
							value={description}
							onChange={linkState(this, 'description')}
							disabled={busy}
							compact
						/>
						<Checkbox
							label="Privacy"
							secondLabel="This is a public network"
							help={isPublic ? 'Public networks can be viewed by anyone, but other rights have to explicitly be assigned.' : 'Private networks are only visible to you and anyone who has been given direct access to organisations within the network.'}
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
						<Button
							appearance="primary"
							busy={busy}
							disabled={shouldPreventSubmit}
							type="submit"
						>Create network</Button>
						<Button
							appearance="link"
							to="/"
						>Cancel</Button>
					</footer>
				</Form>
			</Fragment>
		);
	}
}

export default withRouter(CreateNetwork);