import linkState from 'linkstate';
import { filter, find, get, isUndefined, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import { parse } from 'query-string';
import React, { Component, FormEvent } from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import slugify from 'slugify';
import Button, { LinkButton } from '../../components/Button';
import Form from '../../components/Form';
import Input from '../../components/NewInput';
import Select from '../../components/Select';
import { getCurrentUser } from '../../stores/helpers';

interface State {
	name: string;
	organisation: string;
	url: string;
}

@inject(app('OrganisationsStore'))
@observer
class CreateReport extends Component<any, State> {
	readonly state: State = {
		name: '',
		organisation: '',
		url: ''
	};

	render () {
		const { location, OrganisationsStore, state } = this.props;
		const { name, organisation, url } = this.state;
		const { isBusy } = state;
		const curUser = getCurrentUser(state);
		const organisations = hasAccess(curUser, state.organisations);
		const paramOrganisation = get(parse(location.search), 'organisation');
		const reportUrlTaken = organisation === '' ? false : !isUndefined(find(get(OrganisationsStore.findById(organisation || paramOrganisation), '_reports'), { _repId: url }));
		const preventSubmit = reportUrlTaken || isBlank(name) || isBlank(organisation) || isBlank(url) || isBusy;

		return (
			<React.Fragment>
				<Helmet title="Create a report" />
				<Form
					isStandalone
					onSubmit={this.onSubmit}
				>
					<header>
						<h1>Create a report</h1>
					</header>
					<Select
						autoFocus={!paramOrganisation}
						isDisabled={!!paramOrganisation || isBusy}
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
						disabled={isBusy}
						isCompact
						label="Name"
						onChange={this.onNameChange}
						required
						type="text"
						value={name}
					/>
					<Input
						appearance={(!isBusy && reportUrlTaken) ? 'error' : 'default'}
						disabled={isBusy}
						help={(!isBusy && reportUrlTaken) && 'A report with this ID already exists. Please change it or pick another report name.'}
						isCompact
						label="URL"
						onBlur={this.onURLBlur}
						onChange={linkState(this, 'url')}
						required
						prefix={`${organisation}${organisation !== '' ? '/' : ''}`}
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
	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { props, state } = this;
		const { history, OrganisationsStore } = props;
		const report = toReport(state);

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${report._id}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed:', error);
		};

		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.addReport(report, { onSuccess, onError });
	}
}

export default withRouter(CreateReport);

const isBlank = (str: string) => str === '';
const toOptions = (orgCol) => map(orgCol, ({ _id, avatar, name }) => ({ value: _id, icon: <img src={avatar} />, label: name }));
const toReport = ({ name, organisation: _orgId, url: _repId }: State) => ({ name, _orgId, _repId, _id: `${_orgId}/${_repId}` });
const hasAccess = (curUser, orgCol) => filter(orgCol, ({ _users }) => get(find(_users, { _id: curUser._id }), 'access') >= 20);
