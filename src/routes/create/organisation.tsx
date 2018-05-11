import linkState from 'linkstate';
import { debounce, find, isUndefined } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
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
	orgUrlTaken: boolean;
	url: string;
}

@inject(app('OrganisationsStore'))
@observer
export default class CreateOrganisation extends Component<any, State> {
	readonly state: State = {
		avatar: '/assets/images/organisation-avatar-placeholder.png',
		description: '',
		isPublic: false,
		name: '',
		orgUrlTaken: null,
		url: ''
	};

	private searchForId = debounce(() => {
		const { OrganisationsStore, state } = this.props;
		const { url } = this.state;

		if (url === '') return this.setState({ orgUrlTaken: null });

		const taken = !isUndefined(find(state.organisations, { _id: url }));
		if (taken) return this.setState({ orgUrlTaken: true });
		else OrganisationsStore.checkAvailability(url).then((res) => {
			this.setState({ orgUrlTaken: res });
		});
	}, 400);

	render () {
		const { state } = this.props;
		const { avatar, description, isPublic, name, orgUrlTaken, url } = this.state;
		const { isBusy } = state;
		const preventSubmit = orgUrlTaken !== false || isBlank(name) || isBlank(url);

		return (
			<React.Fragment>
				<Helmet title="Create an organisation" />
				<Form isStandalone onSubmit={this.onSubmit}>
					<header>
						<h1>Create an organisation</h1>
					</header>
					<Input
						appearance="default"
						autoFocus
						isCompact
						label="Name"
						onChange={this.searchForId}
						onInput={this.onNameChange}
						required
						type="text"
						value={name}
					/>
					<Input
						appearance={(!isBusy && orgUrlTaken) ? 'error' : 'default'}
						isCompact
						help={(!isBusy && orgUrlTaken) && 'An organisation with this ID already exists. Please change it or pick another name.'}
						label="URL"
						onBlur={this.onURLBlur}
						onChange={this.onURLChange}
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
		return slugify(name, { lower: true }) === url ? this.setState({ name: value, url: slugified, orgUrlTaken: null }) : this.setState({ name: value, orgUrlTaken: null });
	}
	private onURLChange = ({ currentTarget: { value } }: FormEvent<HTMLInputElement>) => this.setState({ url: value, orgUrlTaken: null });
	private onURLBlur = ({ currentTarget: { value } }: FormEvent<HTMLInputElement>) => {
		this.setState({ url: slugify(isBlank(value) ? this.state.name : value, { lower: true }) });
		this.searchForId();
	}
	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { props, state } = this;
		const { history, OrganisationsStore } = props;
		const { avatar, description, isPublic, name, url } = state;
		const organisation = { _id: url, avatar, description, isPublic, name };

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${organisation._id}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed:', error);
		};

		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.create(organisation, { onSuccess, onError });
	}
}

const isBlank = (str: string) => str === '';
