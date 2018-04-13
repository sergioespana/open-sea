import linkState from 'linkstate';
import React, { Component, FormEvent } from 'react';
import Helmet from 'react-helmet';
import slugify from 'slugify';
import Button, { LinkButton } from '../../components/Button';
import Form from '../../components/Form';
import Input, { TextArea } from '../../components/NewInput';

interface State {
	avatar: string;
	description: string;
	isPublic: boolean;
	name: string;
	url: string;
}

export default class CreateOrganisation extends Component<any, State> {
	readonly state: State = {
		avatar: '/assets/images/organisation-avatar-placeholder.png',
		description: '',
		isPublic: false,
		name: '',
		url: ''
	};

	render () {
		const { avatar, description, isPublic, name, url } = this.state;
		const preventSubmit = isBlank(name) || isBlank(url);

		return (
			<React.Fragment>
				<Helmet title="Create an organisation" />
				<Form isStandalone>
					<header>
						<h1>Create an organisation</h1>
					</header>
					<Input
						appearance="default"
						autoFocus
						isCompact
						label="Name"
						onChange={this.onNameChange}
						required
						type="text"
						value={name}
					/>
					<Input
						appearance="default"
						isCompact
						label="URL"
						onBlur={this.onURLBlur}
						onChange={linkState(this, 'url')}
						required
						prefix={`${window.location.hostname}/`}
						type="text"
						value={url}
					/>
					<Input
						appearance="default"
						isCompact
						label="Avatar"
						type="image"
						value={avatar}
					/>
					<TextArea
						appearance="default"
						isCompact
						label="Description"
						onChange={linkState(this, 'description')}
						value={description}
					/>
					<Input
						appearance="default"
						checked={isPublic}
						help="Public organisations and their reports are visible to anyone. Explicitly granted access is still required for certain operations."
						isCompact
						label="Public"
						onChange={linkState(this, 'isPublic')}
						placeholder="This is a public organisation"
						type="checkbox"
					/>
					<footer>
						<Button appearance="default" disabled={preventSubmit} type="submit">Create organisation</Button>
						<LinkButton appearance="link" to="/">Cancel</LinkButton>
					</footer>
				</Form>
			</React.Fragment>
		);
	}

	private onNameChange = ({ currentTarget: { value } }: FormEvent<HTMLInputElement>) => {
		const { name, url } = this.state;
		const slugified = slugify(value, { lower: true });
		return slugify(name, { lower: true }) === url ? this.setState({ name: value, url: slugified }) : this.setState({ name: value });
	}
	private onURLBlur = ({ currentTarget: { value } }: FormEvent<HTMLInputElement>) => this.setState({ url: slugify(isBlank(value) ? this.state.name : value, { lower: true }) });
}

const isBlank = (str: string) => str === '';
