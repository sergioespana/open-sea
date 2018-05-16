import { get, isEmpty, isEqual, isNumber, map, set, toNumber } from 'lodash';
import { toJS } from 'mobx';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, FormEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Input } from '../../../components/NewInput';
import { Redirect } from '../../../components/Redirect';
import collection from '../../../stores/collection';

interface State {
	data: object;
}

@inject(app('OrganisationsStore', 'ReportsStore'))
@observer
class OrganisationReportData extends Component<any> {
	readonly state: State = {
		data: {}
	};

	componentWillMount () {
		const { match: { params: { orgId, repId } }, OrganisationsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const report = collection(organisation._reports).findById(`${orgId}/${repId}`);
		return this.setState({ data: { ...get(report, 'data') } });
	}

	render () {
		const { match: { params: { orgId, repId } }, OrganisationsStore, state } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
		const report = collection(organisation._reports).findById(`${orgId}/${repId}`);

		if (!report) return <Redirect to={`/${orgId}/reports`} />;

		const { data } = this.state;
		const model = get(parentNetwork ? parentNetwork : report, 'model');
		const PageHead = (
			<Header
				title="Data"
				headTitle={`${organisation.name} / ${report.name} / Data`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>,
					<Link key={`/${orgId}/${repId}`} to={`/${orgId}/${repId}`}>{report.name}</Link>
				]}
			/>
		);

		if (isEmpty(model)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-model.svg" />
						<h1>Let's get started</h1>
						<p>
							To begin, add a model to this report. Drop one on the screen or
							<a>click here</a>.
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		const preventSubmit = state.isBusy || isEqual(data, toJS(get(report, 'data') || {}));

		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Form onSubmit={this.onSubmit}>
						{map(model.metrics, ({ name, ...rest }, key) => (
							<Input
								isCompact
								label={name}
								multiple={rest.type === 'text'}
								onChange={linkDataInput(this, `data.${key}`)}
								value={get(data, key)}
								{...rest}
							/>
						))}
						<FormActions>
							<Button appearance="default" disabled={preventSubmit} type="submit">Save data</Button>
							<LinkButton appearance="link" to={`/${orgId}/${repId}`}>Cancel</LinkButton>
						</FormActions>
					</Form>
				</Container>
			</React.Fragment>
		);
	}

	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { props, state } = this;
		const { history, match: { params: { orgId, repId } }, ReportsStore } = props;
		const data = { ...state.data, _orgId: orgId, _repId: repId };

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${orgId}/${repId}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
		};

		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return ReportsStore.addData(data, { onSuccess, onError });
	}
}

const linkDataInput = (component: Component, key: string, eventPath = 'target.value') => (event) => {
	const inputValue = get(event, eventPath);
	const value = isNumber(inputValue) ? toNumber(inputValue) : inputValue;
	const componentState = { ...component.state };
	const newState = set(componentState, key, value);
	return component.setState(newState);
};

export default withRouter(OrganisationReportData);
