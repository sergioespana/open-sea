import { get,  isEmpty , map, pickBy } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MdMoreHoriz, MdRefresh } from 'react-icons/md';
import { Redirect, withRouter } from 'react-router-dom';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Menu, MenuOption } from '../../../components/Menu';
import { Input, TextArea } from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';
import { getResponses, getValue } from '../../../util/responses-handler';
import { requestImplement } from '../../../util/lime-api';
import EmptyState from '../../../components/EmptyState';



interface State {
	data: object;
}
// refresh button (get responses) + only refresh in responses.
@inject(app('OrganisationsStore', 'UIStore', 'ReportsStore'))
@observer
class OrganisationReportOverview extends Component<any> {
	readonly state: State = {
		data: {}
	};

	async componentWillMount () {
		//calculate indicator values based on responses.
		let { match: { params: { orgId, repId } } } = this.props;
		const items = this.renderItem();
		const organisation = items.organisation;
		const { data } = this.state;

		const report = repId ? collection(organisation._reports).findById(`${orgId}/${repId}`) : null;
		const model = get(report, 'model');

		if(model) {
			const indirectIndicators = pickBy(model.indicators, ({ type }) => type === 'indirectindicator');
			let iilist = {};
			map(indirectIndicators, ({ formulameta }) => {
				map(formulameta, ({ statistic, name }, di) => {
					iilist[di] = {
						statistic: statistic,
						name: name
					};
				});
			});
			map(organisation._surveys, async ({ _sId }) => {
				const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${_sId}`);
				//get survey object with responses
				if (survey) {
					// calculate value
					map(survey.questions, async ({ indicator }, qId) => {
						if (indicator) {
							const indi = pickBy(iilist, ({}, indi) => indi === indicator);
							map(indi, ({ statistic }, iId) => {
								const value = getValue(pickBy(survey.questions, ({}, sId) => sId === qId), statistic);
								if (value) data[iId] = value;
							});
						}
					});
				}
			});
		}
	}

	render () {
		const { data } = this.state;
		const items = this.renderItem();
		const model = items.model;
		const organisation = items.organisation;
		const report = items.report;
		const { match: { params: { orgId, repId } }, ReportsStore } = this.props;


		const PageHead = (
			<Header
				title={report.name}
				headTitle={`${organisation.name} / ${report.name}`}
				breadcrumbs={[
					<Link key={`/${items.orgId}`} to={`/${items.orgId}`}>{organisation.name}</Link>,
					<Link key={`/${items.orgId}/reports`} to={`/${items.orgId}/reports`}>Reports</Link>
				]}
			>
				<Button appearance="light" onClick={this.onRefresh}><MdRefresh height={20} width={20} /></Button>
				<Menu position="bottom-left" trigger={<Button appearance="light"><MdMoreHoriz height={20} width={20} /></Button>}>
					<MenuOption>Share link</MenuOption>
					<MenuOption>Print</MenuOption>
					<MenuOption>Download</MenuOption>
				</Menu>
			</Header>
		);

		if (isEmpty(model)) return <Redirect to={`/${orgId}/${repId}/model`} />;

		if (isEmpty(data)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-data.svg" />
						<h1>Gather some data</h1>
						<p>
							To generate a report, data is required. Please send out a single or multiple person survey and <b>wait or refresh</b> for responses to obtain data.
						</p>
						<p>
							<LinkButton appearance="default" to={`/${orgId}/${repId}/surveys`}>Surveys</LinkButton>
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		return(
			<React.Fragment>
				{PageHead}
				<Container style={{ maxWidth: 400 }}>
					<Section>
					{map(model.topics, ({ name: topName, description: topDesc }, topId) => {
						const indirectItems = pickBy(model.indicators, ({ topic, type }) => topic === topId && type === 'indirectindicator');
						const directItems = pickBy(model.indicators, ({ topic, type }) => topic === topId && type === 'directindicator');
						return(
							<React.Fragment>
								<h2>{topName}</h2>
								<p>{topDesc}</p>
								{map(indirectItems, ({ name: indiName, formula, description: indiDesc, unit }, iId) => {
									return(
										<React.Fragment>
											<p><b>{indiName}</b></p>
											<p>{indiDesc}</p>
											{unit === 'text' ?
												<TextArea
													appearance="default"
													disabled
													value={ReportsStore.compute(formula, data, unit)}
												/>
											 : this.renderData(ReportsStore.compute(formula, data, unit))}
											 <p/>
										</React.Fragment>
									);
								})}
							</React.Fragment>
						);
					})}
					</Section>
				</Container>
			</React.Fragment>
		);
	}

	private renderItem = () => {
		const { props } = this;
		const { OrganisationsStore, match: { params: { orgId, repId } } } = props;

		const organisation = OrganisationsStore.findById(orgId);
		const report = repId ? collection(organisation._reports).findById(`${orgId}/${repId}`) : null;
		const survey = organisation._surveys;

		const model = get(report, 'model');
		//const stakeholdergroups = sgId ? collection(organisation._stakeholdergroups).findById(`${orgId}/${sgId}`) : null;
		return { organisation, report, model, survey, repId, orgId };
	}

	private onRefresh = async () => {
		let { match: { params: { orgId, repId } }, UIStore } = this.props;
		UIStore.addFlag({ appearance: 'success', title: 'Refreshing: ', description: 'Survey responses are being gathered, please wait.' });

		const items = this.renderItem();
		const organisation = items.organisation;

		map(organisation._surveys, async ({ _sId }) => {
			console.log(_sId);
			//get survey object with responses
			const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${_sId}`);

			if (survey) {
				const resp = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'get_summary',[survey.lsId, 'all']);
				try {
					survey.respObtained = resp.completed_responses ;
					survey.validResp = resp.full_responses;
					survey.incompleteResp = resp.incomplete_responses;
				} catch (err) {
					console.log(err);
				}
				const surveyResponses = await getResponses(organisation, survey);
				try {
					if (surveyResponses) this.responsesToDatabase(surveyResponses);
				} catch (err) {
					console.log(err);
				}
			}
		});
	}
	private responsesToDatabase = (survey) => {
		const { props } = this;

		const { OrganisationsStore } = props;

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			location.reload(true);
			console.log('Responses saved in firebase');
		};
		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
		};
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.addSurvey(survey, { onSuccess, onError });
	}

	private renderData = (data) => (
		<React.Fragment>
		<Input
			appearance="default"
			//appearance={num >= this.state.survey.responserate ? "default" : "error" }
			disabled={true}
			isCompact
			name={data}
			//label={num}
			//multiple={rest.type === 'text'}
			value={data}
		/>
		{//<small> {num} out of {this.state.survey.participants} participants. </small>}<br/>
}</React.Fragment>
	)
	private valueToDatabase = (model) => {
		let { ReportsStore } = this.props;

		const onSuccess = () => {
			console.log('value stored in database');
			this.setState(this.state);
		};
		const onError = (error) => {
			console.log('failed', error);

		};
		return ReportsStore.addModel(model, { onSuccess, onError });
	}
}
export default withRouter(OrganisationReportOverview);
