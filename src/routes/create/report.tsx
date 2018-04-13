import linkState from 'linkstate';
import { get, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import { parse } from 'query-string';
import React, { Component, FormEvent } from 'react';
import Helmet from 'react-helmet';
import slugify from 'slugify';
import Button, { LinkButton } from '../../components/Button';
import Form from '../../components/Form';
import Input from '../../components/NewInput';
import Select from '../../components/Select';

// TODO: Handle name / URL input
// TODO: Handle preselecting an organisation through URL in componentWillMount (or render a redirect?)

interface State {
	name: string;
	organisation: string;
	url: string;
}

@inject(app('state'))
@observer
export default class CreateReport extends Component<any, State> {
	readonly state: State = {
		name: '',
		organisation: '',
		url: ''
	};

	render () {
		const { location, state } = this.props;
		const { name, organisation, url } = this.state;
		const { organisations } = state;
		const preventSubmit = isBlank(name) || isBlank(organisation) || isBlank(url);
		const paramOrganisation = get(parse(location.search), 'organisation');

		return (
			<React.Fragment>
				<Helmet title="Create a report" />
				<Form isStandalone>
					<header>
						<h1>Create a report</h1>
					</header>
					<Select
						autoFocus={!paramOrganisation}
						isDisabled={!!paramOrganisation}
						isCompact
						isSearchable
						label="Organisation"
						onChange={linkState(this, 'organisation', 'value')}
						options={toOptions(organisations)}
						required
						value={paramOrganisation || organisation}
					/>
					<Input
						appearance="default"
						autoFocus={!!paramOrganisation}
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
						prefix={`${window.location.hostname}/${organisation}${organisation !== '' ? '/' : ''}`}
						type="text"
						value={url}
					/>
					<footer>
						<Button appearance="default" disabled={preventSubmit} type="submit">Create report</Button>
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
const toOptions = (orgCol) => map(orgCol, ({ _id, avatar, name }) => ({ value: _id, icon: <img src={avatar} />, label: name }));
