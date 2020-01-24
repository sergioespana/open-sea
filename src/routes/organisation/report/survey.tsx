import linkState from 'linkstate';
import { get, isEmpty, map, pickBy, trim } from 'lodash';
import { toJS } from 'mobx';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, FormEvent } from 'react';
import { Survey } from '../../../../src/domain/Organisation';
import AuthForm, { AuthFormHeader, AuthFormWrapper } from '../../../components/AuthForm';
//import { error } from 'util';
import { Button, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import { Form, FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Input, { TextArea } from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';
import { requestImplement } from '../../../util/lime-api';
interface State {
	survey: Survey;
}

@inject(app('OrganisationsStore', 'ReportsStore', 'UIStore'))
@observer
export default class OrganisationsReportSurvey extends Component<any> {
	readonly state: State = {
		survey: null
	};

	componentWillMount () {
		const { match: { params: { orgId, repId } },OrganisationsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const report = collection(organisation._reports).findById(`${orgId}/${repId}`);
		return this.setState({ survey: { ...toJS(get(report, 'survey')) } });
	}

	// fixme: QGroups & Qs

	render () {
		//const { state } = this.props;
		const { survey } = this.state;

		const { match: { params: { orgId, repId } }, OrganisationsStore } = this.props;

		const items = this.renderQitems(orgId,repId,OrganisationsStore);
		const organisation = items.organisation;
		const report = items.report;

		const title = repId ? `Survey - ${organisation.name} / ${report.name}` : `Survey - ${organisation.name} / Settings`;
		const breadcrumbs = repId ? [
			<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
			<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>,
			<Link key={`/${orgId}/${repId}`} to={`/${orgId}/${repId}`}>{report.name}</Link>
		] : [
			<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
			<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
		];
		const PageHead = (
			<Header
				title="Survey"
				headTitle={title}
				breadcrumbs={breadcrumbs}
			/>
		);
		if (isEmpty(items.model)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-model.svg" />
						<h1>No surveys specified</h1>
							<p>
								The model for this report contains no model or surveyitems which prevents openSEA from displaying anything here.
							</p>
							<p>
							<LinkButton appearance="default" to={`/${orgId}/${repId}/model`}>Manage model</LinkButton>
							</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);
		const groupItems = items.groupItems;
		const surveyItems = items.surveyItems;
		return (
			<React.Fragment>
				{PageHead}
					<Container>
						<Section>
						<h2>Model specified questiongroups and questions </h2>
							{map(groupItems, ({ name }, topId) => {
								const grItems = pickBy(surveyItems, ({ topic }) => topic === topId);
								return(
									<React.Fragment>
										<h3>{name}</h3>
										<Section>
												{map(grItems, ({ description }) => {
													return(
													<React.Fragment>
														<li>{description}</li>
													</React.Fragment>
													);
												})}
										</Section>
									</React.Fragment>
								);
							}
				)}
						<Form onSubmit={this.onSurveyAdd}>
							<React.Fragment>
							<h1>Survey settings</h1>
							<Input
									appearance="default"
									disabled={false}
									isCompact
									onChange={linkState(this, 'survey.name')}
									label="Enter survey name"
									required
									type="default"
									value={survey.name}
							/>
							<TextArea
								appearance="default"
								//disabled
								isCompact
								label="Survey Description"
								onChange={linkState(this, 'survey.description')}
								value={survey.description}
							/>
							<TextArea
								appearance="default"
								//disabled
								isCompact
								label="Survey welcome text"
								onChange={linkState(this, 'survey.welcometext')}
								value={survey.welcometext}
							/>
							<TextArea
								appearance="default"
								//disabled
								isCompact
								label="Survey closing text"
								onChange={linkState(this, 'survey.closingtext')}
								value={survey.closingtext}
							/>
							</React.Fragment>
							<FormActions>
								<Button appearance="default" disabled={false} type="Create survey">Save data</Button>
								<LinkButton appearance="link" to={`/${orgId}/${repId}`}>Cancel</LinkButton>
							</FormActions>
							</Form>
					</Section>
				</Container>
			</React.Fragment>);
	}
	private onSurveyAdd = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// fixme: if questions in model change => change in limesurvey
		// fixme: possibility for multiple surveys based on question groups
		const { props, state } = this;
		const { history, match: { params: { orgId, repId } }, ReportsStore, OrganisationsStore, UIStore } = props;
		const survey = { ...state.survey, _orgId: orgId, _repId: repId };

		const items = this.renderQitems(orgId,repId,OrganisationsStore);
		const organisation = items.organisation;

		let surveyOldId = '';
		if (items.report.survey !== undefined) surveyOldId = items.report.survey.sId;

		await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'list_surveys',[]).catch(err => console.log(err)).then(async qlist => { 
			if (qlist.status !== 'No surveys found' && surveyOldId !== '' && qlist.filter(e => e.sid === surveyOldId)) {
				// alter exsisting survey
				await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'set_language_properties',[surveyOldId, { 'surveyls_title': survey.name, 'surveyls_description': survey.description, 'surveyls_welcometext': survey.welcometext, 'surveyls_endtext' : survey.closingtext }])
				.catch(err => console.log(err))
				.then(() => {
					console.log('changed in limesurvey')
					this.pushToDatabase(props,orgId,repId,ReportsStore,survey,history);
					UIStore.addFlag({ appearance: 'success', title: 'LimeSurvey: ', description: 'Changes are applied.' });
				});
			} else
				// create new survey
				await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_survey',[surveyOldId, survey.name, 'en', 'G']).catch(err => console.log(err)).then(async survId => {
					surveyOldId = survId;
					await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'set_language_properties',[survId, { 'surveyls_description': survey.description, 'surveyls_welcometext': survey.welcometext, 'surveyls_endtext' : survey.closingtext }]).catch(err => console.log(err)).then(() => {
						map(items.groupItems, async ({ name }) => {
						// add group
							await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_group',[survId, name]).catch(err => console.log(err)).then(async groupId => {
								map(items.surveyItems, async ({ name }, sId) => {
									// import questions
									await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password],'import_question', [survId,groupId, this.surveyFormat(sId, name), 'lsq' ]).catch(err => console.log(err));
								});
							});
						});
					});
				}).then(() => {
					console.log('new survey in Limesurvey');
					this.pushToDatabase(props,orgId,repId,ReportsStore,survey,history,surveyOldId);
					UIStore.addFlag({ appearance: 'success', title: 'LimeSurvey: ', description: 'Survey, questiongroup(s) and question(s) are newly added to limesurvey and database.' });
				});
		});
	}

	private pushToDatabase = (props,orgId,repId, ReportsStore,survey,history,surveyOldId?) => {
		//UIStore.addFlag({ appearance: 'success', title: 'LimeSurvey: ', description: 'Survey, questiongroup(s) and question(s) are added to limesurvey and database.' });
		if (surveyOldId !== undefined && survey.sId !== surveyOldId) survey.sId = surveyOldId;
		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			history.push(`/${orgId}/${repId}`);
			console.log('saved in firebase');
		};
		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
		};
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return ReportsStore.addSurvey(survey, { onSuccess, onError });
	}

	private renderQitems = (orgId, repId, OrganisationsStore) => {
		const organisation = OrganisationsStore.findById(orgId);
		const report = repId ? collection(organisation._reports).findById(`${orgId}/${repId}`) : null;
		const model = get(report, 'model');
		if (model === undefined) { console.log('model is empty'); return { model, report, organisation }; } else {
			const groupItems = pickBy(model.topics, ({ type }) => type === 'questiongroup');
			const surveyItems = pickBy(model.indicators, ({ type }) => type === 'survey');
			const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
			return { groupItems , surveyItems, model , report, organisation, parentNetwork };
		}
	}

	private surveyFormat = (title, question) => {
		return btoa('<document><LimeSurveyDocType>Question</LimeSurveyDocType><DBVersion>359</DBVersion><languages><language>en</language></languages><questions><fields><fieldname>qid</fieldname><fieldname>parent_qid</fieldname><fieldname>sid</fieldname><fieldname>gid</fieldname><fieldname>type</fieldname><fieldname>title</fieldname><fieldname>question</fieldname><fieldname>preg</fieldname><fieldname>help</fieldname><fieldname>other</fieldname><fieldname>mandatory</fieldname><fieldname>question_order</fieldname><fieldname>language</fieldname><fieldname>scale_id</fieldname><fieldname>same_default</fieldname><fieldname>relevance</fieldname><fieldname>modulename</fieldname></fields><rows><row><qid><![CDATA[12]]></qid><parent_qid><![CDATA[0]]></parent_qid><sid><![CDATA[331035]]></sid><gid><![CDATA[20]]></gid><type><![CDATA[T]]></type><title><![CDATA[' + title + ']]></title><question><![CDATA[' + question + ']]></question><preg/><help/><other><![CDATA[N]]></other><mandatory><![CDATA[N]]></mandatory><question_order><![CDATA[1]]></question_order><language><![CDATA[en]]></language><scale_id><![CDATA[0]]></scale_id><same_default><![CDATA[0]]></same_default><relevance><![CDATA[1]]></relevance></row></rows></questions></document>');
	}
}
