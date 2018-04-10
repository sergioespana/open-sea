import linkState from 'linkstate';
import { map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Button from '../../components/Button';
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
		const { state } = this.props;
		const { name, organisation, url } = this.state;
		const { organisations } = state;

		return (
			<React.Fragment>
				<Helmet title="Create a report" />
				<Form>
					<header>
						<h1>Create a report</h1>
					</header>
					<Select
						isCompact
						isSearchable
						label="Organisation"
						onChange={linkState(this, 'organisation', 'value')}
						options={toOptions(organisations)}
						required
						value={organisation}
					/>
					<Input
						appearance="default"
						isCompact
						label="Name"
						onChange={linkState(this, 'name')}
						required
						type="text"
						value={name}
					/>
					<Input
						appearance="default"
						isCompact
						label="URL"
						onChange={linkState(this, 'url')}
						required
						prefix={`${window.location.hostname}/${organisation}${organisation !== '' && '/'}`}
						type="text"
						value={url}
					/>
					<footer>
						<Button appearance="default" type="submit">Create report</Button>
						<Button appearance="link" type="reset">Cancel</Button>
					</footer>
				</Form>
			</React.Fragment>
		);
	}
}

const toOptions = (orgCol) => map(orgCol, ({ _id, avatar, name }) => ({ value: _id, icon: <img src={avatar} />, label: name }));
