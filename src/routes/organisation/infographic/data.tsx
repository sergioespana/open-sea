import { get, isEmpty, isEqual, isNumber, map, pickBy, set, toNumber } from 'lodash';
import { toJS } from 'mobx';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, FormEvent } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Input } from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';

interface State {
	data: object;
}

@inject(app('OrganisationsStore', 'InfographicsStore'))
@observer
class OrganisationInfographicData extends Component<any> {
	readonly state: State = {
		data: {}
	};

	componentWillMount () {
		const { match: { params: { orgId, infographicId } }, OrganisationsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const infographic = collection(organisation._infographics).findById(`${orgId}/${infographicId}`);
		return this.setState({ data: { ...toJS(get(infographic, 'data')) } });
	}

	render () {
		const { match: { params: { orgId, infographicId } }, OrganisationsStore, state } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const infographic = collection(organisation._infographics).findById(`${orgId}/${infographicId}`);

		const report = collection(organisation._reports).findById(infographic.report);
		const { data } = this.state;
		const model = get(infographic, 'model');
		const PageHead = (
			<Header
				title="Data"
				headTitle={`Data - ${organisation.name} / ${infographic.name}`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/infographics`} to={`/${orgId}/infographics`}>Infographics</Link>,
					<Link key={`/${orgId}/infographics/${infographicId}`} to={`/${orgId}/infographic/${infographicId}`}>{infographic.name}</Link>
				]}
			/>
		);

		// if (isEmpty(model)) return <Redirect to={`/${orgId}/infographics/${infographicId}/specification`} />;

		const preventSubmit = state.isBusy || isEqual(data, toJS(get(infographic, 'data') || {}));

		return (
			/*
			<React.Fragment>
				{PageHead}
				<Container>
					<Section>
						<Form onSubmit={this.onSubmit}>
							{model.topics
								? (
									<React.Fragment>
										{map(model.topics, ({ name }, catId) => {
											const items = pickBy(model.directIndicators, ({ category }) => category === catId);
											if (isEmpty(items)) return null;
											return (
												<React.Fragment>
													<h3>{name}</h3>
													{map(items, this.renderItem(data))}
												</React.Fragment>
											);
										})}
										{!isEmpty(pickBy(model.directIndicators, ({ category }) => category === undefined)) && <h3>Uncategorised</h3>}
										{map(pickBy(model.directIndicators, ({ category }) => category === undefined), this.renderItem(data))}
									</React.Fragment>
								)
								: map(model.directIndicators, this.renderItem(data))}
							<FormActions>
								<Button appearance="default" disabled={preventSubmit} type="submit">Save data</Button>
								<LinkButton appearance="link" to={`/${orgId}/infographics/${infographicId}`}>Cancel</LinkButton>
							</FormActions>
						</Form>
					</Section>
				</Container>
			</React.Fragment>
			*/
			<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<p>
						The following report (including its data and its model) is used for creating the infographic:<br /><br />
						{<Link to={`/${orgId}/${ report.name }`}>{report.name}</Link>}
					</p>
				</Section>
			</Container>
		</React.Fragment>
		);
	}

	private renderItem = (data) => ({ name, ...rest }, key) => (
		<Input
			appearance="default"
			isCompact
			label={name}
			multiple={rest.type === 'text'}
			onChange={linkDataInput(this, `data.${key}`)}
			value={get(data, key)}
			{...rest}
		/>
	)
	private onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { props, state } = this;
		const { history, match: { params: { orgId, infographicId } }, InfographicsStore } = props;
		const data = { ...state.data, _orgId: orgId, _infographicId: infographicId };

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${orgId}/${infographicId}`);
		};

		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
		};

		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return InfographicsStore.addData(data, { onSuccess, onError });
	}
}

const linkDataInput = (component: Component, key: string, eventPath = 'target.value') => (event) => {
	const inputValue = get(event, eventPath);
	const value = isNumber(inputValue) ? toNumber(inputValue) : inputValue;
	const componentState = { ...component.state };
	const newState = set(componentState, key, value);
	return component.setState(newState);
};

export default withRouter(OrganisationInfographicData);
