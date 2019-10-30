import linkState from 'linkstate';
import { filter, find, get, isUndefined, map, reject } from 'lodash';
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
import { selection } from 'polished';
import { Organisation } from 'src/domain/Organisation';

interface State {
	name: string;
	organisation: string;
	report: string;
	url: string;
}

@inject(app('OrganisationsStore'))
@observer
class CreateInfographic extends Component<any, State> {
	readonly state: State = {
		name: '',
		organisation: '',
		report: '',
		url: ''
	};

	componentWillMount () {
		const { location } = this.props;
		this.setState({ organisation: get(parse(location.search), 'organisation') || '' });
		this.setState({ report: get(parse(location.search), 'report') || '' });
	}

	render () {
		const { location, OrganisationsStore, state } = this.props;
		const { name, organisation, report, url } = this.state;
		const { isBusy } = state;
		const curUser = getCurrentUser(state);
		const organisations = hasAccess(curUser, reject(state.organisations, { isNetwork: true }));
		const OrganisationReports : Organisation = OrganisationsStore.findById(this.state.organisation) || {};
		const paramOrganisation = get(parse(location.search), 'organisation');
		const paramReport = get(parse(location.search), 'report');
		const reportNameTaken = organisation === '' ? false : !isUndefined(find(get(OrganisationsStore.findById(organisation), '_infographics'), { _infographicId: slugify(name, { lower: true }) }));
		const preventSubmit =  reportNameTaken || isBlank(name) || isBlank(organisation) ||  isBlank(report)  ||  isBlank(url) || isBusy;

		return (
			<React.Fragment>
				<Helmet title="Create an infographic" />
				<Form
					isStandalone
					onSubmit={this.onSubmit}
				>
					<header>
						<h1>Create an infographic</h1>
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
					<Select
						autoFocus={!!paramOrganisation}
						isDisabled={!this.state.organisation || !!paramReport || isBusy}
						isCompact
						isSearchable
						label="Report"
						onChange={linkState(this, 'report', 'value')}
						options={map(OrganisationReports._reports, ({ _id, name }) => ({ value: _id, label: name }))}
						required
						value={paramReport || report}
					/>
					<Input
						appearance="default"
						autoFocus={!!paramReport}
						disabled={isBusy}
						isCompact
						label="Name"
						onChange={this.onNameChange}
						required
						type="text"
						value={name}
					/>
					<Input
						appearance={(!isBusy && reportNameTaken) ? 'error' : 'default'}
						disabled
						help={(!isBusy && reportNameTaken) && 'An infographic with this ID already exists. Please change it or pick another name.'}
						isCompact
						label="URL"
						onBlur={this.onURLBlur}
						onChange={linkState(this, 'url')}
						required
						prefix={`${organisation}${organisation !== '' ? '/infographics/' : ''}`}
						type="text"
						value={url}
					/>
					<footer>
						<Button appearance="default" disabled={preventSubmit} type="submit">Create infographic</Button>
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
		const infographic = toInfographic(state);

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${infographic._id}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed:', error);
		};

		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.addInfographic(infographic, { onSuccess, onError });
	}
}

export default withRouter(CreateInfographic);

const isBlank = (str: string) => str === '';
const toOptions = (orgCol) => map(orgCol, ({ _id, avatar, name }) => ({ value: _id, icon: <img src={avatar} />, label: name }));
const toInfographic = ({ name, organisation: _orgId, report, url: _infographicId }: State) => ({ name, _orgId, _infographicId, report, _id: `${_orgId}/infographics/${_infographicId}` });
const hasAccess = (curUser, orgCol) => filter(orgCol, ({ _users }) => get(find(_users, { _id: curUser._id }), 'access') >= 20);
