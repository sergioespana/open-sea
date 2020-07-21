import linkState from 'linkstate';
import { get, isEmpty, map, pick } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import { MdMoreHoriz, MdRefresh } from 'react-icons/md';
import { Redirect } from 'react-router-dom';
import { isNullOrUndefined } from 'util';
import { Button, ButtonGroup, LinkButton } from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import Input from '../../../components/NewInput';
import FieldLabel from '../../../components/NewInput/FieldLabel';
import { Section } from '../../../components/Section';
import Select from '../../../components/Select';
import { Report, Stakeholder, Stakeholdergroup } from '../../../domain/Organisation';
import collection from '../../../stores/collection';
import { requestImplement } from '../../../util/lime-api';
import { questionFormat } from '../../../util/LS-question';
import { getResponses } from '../../../util/responses-handler';

interface State {
	sId: string;
	sgId: any;
	activeQ: string;
	activeSurv: string;
	showModal: boolean;
	report: Report;
	userId: string;
	stakeholdergroup: Stakeholdergroup;
	stakeholder: Stakeholder;
	surveydata: any;
	survDelete: string;
}

@inject(app('AuthStore', 'OrganisationsStore', 'UIStore', 'ReportsStore'))
@observer
export default class OrganisationReportSurvey extends Component<any> {
	input = null;
	readonly state: State = {
		sId: '',
		report: null,
		activeQ: '',
		activeSurv: '',
		sgId: null,
		showModal: false,
		userId: '',
		stakeholdergroup: null,
		stakeholder: null,
		surveydata: null,
		survDelete: null
	};

	 render () {
		const { match: { params: { orgId, repId } } } = this.props;
		let { sgId, showModal } = this.state;
		const items = this.renderItem();
		const report = items.report;
		const model = items.model;
		const organisation = items.organisation;

		if (isEmpty(model)) return <Redirect to={`/${orgId}/${repId}/model`} />;

		const surveylist = [];
		if (!isNullOrUndefined(model)) {
			map(model.surveys,({ name }, sId) => {
				surveylist.push({ label: `${sId}: ${name}`, value: sId });
			});
		}

		const deployedSurveys = [];
		map(model.surveys, ({}, survId) => {
			const deplsurvey = collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${survId}`);
			if (deplsurvey) deployedSurveys.push({ label: `${survId}`, value: survId });
		});

		const stakeholdergrouplist = [];
		map(organisation._stakeholdergroups,({ name, _sgId }) => stakeholdergrouplist.push({ label: name, value: _sgId }));

		const PageHead = (
			<Header
				title="Surveys"
				headTitle={`Surveys - ${organisation.name} / ${report.name}`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>,
					<Link key={`/${orgId}/${repId}`} to={`/${orgId}/${repId}`}>{report.name}</Link>
				]}
			/>
		);

	
		if (isEmpty(organisation.ls_host) || isEmpty(organisation.ls_account) || isEmpty(organisation.ls_password)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-checklist.svg" />
						<h1>Incomplete survey credentials</h1>
						<p>
							The survey credentials are incomplete. Please follow the instructions to add the survey credentials.
						</p>
						<p>
							<LinkButton appearance="default" to={`/${orgId}/settings/details`}>Add credentials </LinkButton>
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		if (isEmpty(stakeholdergrouplist)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-development.svg" />
						<h1>Add stakeholdergroup</h1>
						<p>
							To deploy a survey, at least one stakeholdergroup is required. Please add stakeholders to a group prior to survey deployment.
						</p>
						<p>
							<LinkButton appearance="default" to={`/${orgId}/stakeholders`}>Create stakeholdergroup</LinkButton>
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		return(
			<React.Fragment>
				{PageHead}
					<Section>
					<Container style={{ maxWidth: 400 }}>
					<p> This page shows (to be) implemented surveys based on the uploaded model. When a survey is deployed and active, survey statistics are shown. Please refresh to get the latest statistics. </p>
						</Container>
						{map(model.surveys, ({ name, description, questions }, survId) => {
							// sort the questions based on the order
							let sortedQs = {};
							Object
									.keys(questions).sort(function (a, b) {
										return questions[a].order - questions[b].order;
									})
									.forEach(function (key) {
										sortedQs[key] = questions[key];
									});
							const exsistingSurvey = collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${survId}`);
							if (isNullOrUndefined(exsistingSurvey))
								return(
									<React.Fragment>
										<Container style={{ maxWidth: 400 }}>
										<form onSubmit={this.onSubmit}>
											<Section>
												<h3>In-active</h3>
												<h2>{survId + ' : ' + name}</h2>
												<FieldLabel>{description}</FieldLabel>
												<p/>
												<p><b>Questions</b></p>
												{map(sortedQs, ({ name, answertype }, qId) => {
													if (answertype === 'instruction') return(null);
													return(
														<React.Fragment>
															<Button appearance="subtle-link" style={{ textAlign: 'left' }} onClick={this.onRefresh(survId)}>{`${qId}: ${name}`}</Button>
															<p/>
														</React.Fragment>
													);
												})}
											<p/>
												<Select
													label="Stakeholder group"
													onChange={linkState(this, `sgId.${survId}`, 'value')}
													isCompact
													options={stakeholdergrouplist}
													placeholder="Select stakeholdergroup"
													value={sgId}
												/>
												<p/>
												<FieldLabel>Please select <b>stakeholdergroup</b> above prior to survey implementation below</FieldLabel>
												<ButtonGroup>
													<Button
															appearance="default"
															label="Install"
															disabled={isNullOrUndefined(sgId) || isNullOrUndefined(sgId[survId])}
															type="sub"
													>Activate
													</Button>
												</ButtonGroup>
											</Section>
											</form>
											</Container>
											</React.Fragment>
								);
							else
							return(
								<React.Fragment>
									<Container style={{ maxWidth: 400 }}>
										<Section>
											<h3>Active</h3>
											<h2>{survId + ' : ' + name}</h2>
											<FieldLabel>{description}</FieldLabel>
											<p/>
											<Button appearance="light" label="Refresh" onClick={this.onRefresh(survId)}><MdRefresh height={20} width={20} /></Button>
											<p/>
											<h4>Questions and responses</h4>
											<p/>
											{map(sortedQs, ({ name, answertype }, qId) => {
												if (answertype === 'instruction') return(null);
												return(
													<React.Fragment>
														<Button appearance="subtle-link" style={{ textAlign: 'left' }} onClick={this.toggleModal(survId, qId)}>{`${qId}: ${name}`}</Button>
														<p/>
													</React.Fragment>
												);
											})}
											<p/>
											<Input
													appearance="default"
													disabled
													isCompact
													label="Stakeholder group"
													value={exsistingSurvey.population}
													type="text"
											/>
											<p/>
											<p><b>Survey statistics</b></p>
											{exsistingSurvey.respObtained ? (
												<React.Fragment>
													<p> {(exsistingSurvey.validResp / exsistingSurvey.participants * 100).toFixed()}% of the responses obtained, {exsistingSurvey.responserate * 100}% is required</p>
													<li>{exsistingSurvey.participants} invites send</li>
													<li>{exsistingSurvey.validResp} survey(s) opened</li>
													<li>{exsistingSurvey.respObtained} valid response(s) obtained</li>
													<li>{exsistingSurvey.incompleteResp} incomplete response(s) </li>
													<p/>
												</React.Fragment>
											) : (
												<React.Fragment>
													<p>No responses known, please refresh and/or wait for responses to get in.</p>
												</React.Fragment>)
											}
											<p/>
											<ButtonGroup>
												<Button appearance="default" disabled>Send Reminders</Button>
												<Button appearance="warning" disabled>Expire Survey</Button>
												<Button appearance="error" disabled>Delete</Button>
											</ButtonGroup>
										</Section>
										</Container>
										</React.Fragment>
							);
						})}
					</Section>
					<Modal
						isOpen={showModal}
						onClose={this.toggleModal()}
					>
						<form onSubmit={this.onSubmit}>
						<React.Fragment>
							<ModalHeader>
								<h1>Responses</h1>
							</ModalHeader>
							<ModalSection>
							{
								this.state.activeQ && (collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${this.state.activeSurv}`)).questions[this.state.activeQ].responses ?
									<h3>{(collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${this.state.activeSurv}`)).questions[this.state.activeQ].name}</h3>
								: <h3>Nothing present</h3>}
							<p/>
							{
								this.state.activeSurv && (collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${this.state.activeSurv}`)).questions[this.state.activeQ].responses ?
									(collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${this.state.activeSurv}`)).questions[this.state.activeQ].responses.map(resp => <li key={resp}> {resp} </li>)
									: <p>Unfortunatly there are no survey responses to display here.</p>}
							</ModalSection>
							<ModalFooter>
								<ButtonGroup>
									<Button appearance="default" onClick={this.toggleModal()} type="button">Return</Button>
								</ButtonGroup>
							</ModalFooter>
							</React.Fragment>
						</form>
					</Modal>
		</React.Fragment>
		);

	}

	private toggleModal = (survId?, qId?) => () => {
		this.setState(toggleModal);
		survId ? this.setState({ activeSurv: survId }) : this.setState({ activeSurv: '' });
		qId ? this.setState({ activeQ: qId }) : this.setState({ activeQ: '' });
	}

	private onRefresh = (surv) => async () => {
		let { match: { params: { orgId, repId } }, UIStore } = this.props;
		UIStore.addFlag({ appearance: 'success', title: 'Refreshing: ', description: 'Survey responses are being gathered, please wait.' });

		const items = this.renderItem();
		const organisation = items.organisation;

		const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${surv}`);

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

	private onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {

		event.preventDefault();
		const { history ,match: { params: { orgId, repId } }, UIStore } = this.props;
		const items = this.renderItem();
		const model = items.model;
		const organisation = items.organisation;

		//destruct element containing sthgroup and surveyId
		let surveyId;
		let sthgroupId;
		let counter = 0;
		const { sgId } = this.state;

		Object.entries(sgId).map(([ key,value ]) => {
			surveyId = key;
			sthgroupId = value;
			counter ++;
		});

		if (counter > 1) window.location.reload(); // MODAL?

		const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${repId}-${surveyId}`); // stored and activated surveys
		let surveyOldId = '';

		const stakeholdergroups = sthgroupId ? collection(organisation._stakeholdergroups).findById(`${orgId}/${sthgroupId}`) : null;
		const selectedParticipants = stakeholdergroups.stakeholders;

		if (isNullOrUndefined(selectedParticipants)) {
			UIStore.addFlag({ appearance: 'error', title: 'Group stakeholders: ', description: `There are no stakeholders present in the group, please add.` });
		} else {
			UIStore.addFlag({ appearance: 'success', title: 'Implementing: ', description: 'Survey is beeing implemented, please wait.' });
			const selectedSurvey = pick(model.surveys, surveyId); // selected survey by user + add meta-data for traceability
			selectedSurvey[surveyId]._orgId = orgId;
			selectedSurvey[surveyId]._repId = repId;
			selectedSurvey[surveyId]._sId = `${repId}-${surveyId}`;
			selectedSurvey[surveyId]._id = `${orgId}/${repId}/${surveyId}`;
			selectedSurvey[surveyId].population = sthgroupId;
			selectedSurvey[surveyId].repId = repId;
			selectedSurvey[surveyId].name = repId + ' - ' + selectedSurvey[surveyId].name;

			// sort the questions based on the order
			let sortedQs = {};
			Object
					.keys(selectedSurvey[surveyId].questions).sort(function (a, b) {
						return selectedSurvey[surveyId].questions[a].order - selectedSurvey[surveyId].questions[b].order;
					})
					.forEach(function (key) {
						sortedQs[key] = selectedSurvey[surveyId].questions[key];
					});

			// find exsisting surveyID else create one which will be used in Limesurvey and therefore is unique
			if (isNullOrUndefined(survey) || isNullOrUndefined(survey.lsId)) selectedSurvey[surveyId].lsId = this.getRandomID();
			else surveyOldId = survey.lsId;

			//create list of survey sections
			const topicsList = {};
			map(selectedSurvey[surveyId].questions, ({ topic }) => {
				topicsList[topic] = { name: model.topics[topic].name };
			});

			// use of for loops over maps, due to conflicting await/async -> maps are also async functions, influencing the question order
			const qlist = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'list_surveys',[]);
			try {
				if (qlist.status !== 'No surveys found' && surveyOldId !== '' && qlist.filter(e => e.sid === surveyOldId)) {
					UIStore.addFlag({ appearance: 'error', title: 'LimeSurvey: ', description: 'This survey was already present, please upload a new survey specification if you want to alter.' });
				} else {
				// create new survey
					const survId	= await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_survey',[selectedSurvey[surveyId].lsId, selectedSurvey[surveyId].name, 'en', 'G']);
					try {
						surveyOldId = survId;
						selectedSurvey[surveyId].lsId = surveyOldId;
						// set survey attributes
						const grId = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'set_language_properties',[survId, { 'surveyls_description': selectedSurvey[surveyId].description, 'surveyls_welcometext': selectedSurvey[surveyId].welcometext, 'surveyls_endtext' : selectedSurvey[surveyId].closingtext }]);
						try {
							if (grId) console.log('Survey attributes added');
							// map topics, and each topic search for questions which are the same and add those
							for (let tId in topicsList) {
								const groupId = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_group',[surveyOldId, name]);
								try {
									for (let key in sortedQs) {
										if (sortedQs.hasOwnProperty(key)) {
											let obj = sortedQs[key];
											obj.indicator ? obj.indicator = obj.indicator : obj.indicator = null;
											obj.options ? obj.options = obj.options : obj.options = null;
											obj.description ? obj.description = obj.description : obj.description = null;
											obj.aggregatedqs ? obj.aggregatedqs = obj.aggregatedqs : obj.aggregatedqs = null;
											obj.others ? obj.others = obj.others : obj.others = null;
											selectedSurvey[surveyId].questions[key] = {
												name: obj.name,
												description: obj.description,
												isMandatory: obj.ismandatory,
												answerType: obj.answertype,
												indicator: obj.indicator,
												options: obj.options,
												aggregatedQs: obj.aggregatedqs,
												others: obj.others,
												order: obj.order };
											if (obj.topic === tId) {
												console.log('send: ' + key);
												const resp = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password],'import_question', [surveyOldId,groupId, questionFormat(key, obj.name, obj.answertype, obj.ismandatory, obj.order, obj.others, obj.description, obj.options, obj.aggregatedqs), 'lsq', obj.ismandatory ]);
												try {
													// succes log the success
													console.log('received: ' + key);
													console.log(resp);
												} catch (err) {
													console.log(err);
												}
											}
										}
									}
								} catch (err) {
									console.log(err);
								}
							}
						} catch (err) {
							console.log(err);
						}
					} catch (err) {
						console.log(err);
					}
				}
			} catch (err) {
				console.log(err);
				history.push(`${orgId}/settings/details`);
			}

			const res = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'activate_tokens',[surveyOldId]);
			try {
				console.log('Participants table activated:' + res.status);
				// add stakeholders to participants table
				let participantscounter = 0;
				map(selectedParticipants, async ({ firstname, lastname, email }) => {
					participantscounter ++;
					const sth = [];
					sth.push({ email: email, lastname: lastname, firstname: firstname });
					const partId = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_participants',[surveyOldId, sth]);
					try {
						console.log(partId[0].firstname + ' ' + partId[0].firstname + ' added');
					} catch (err) {
						console.log(err);
					}
				});
				selectedSurvey[surveyId].participants = participantscounter;
				const inviteresp = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'mail_registered_participants',[surveyOldId]);
				try {
					console.log(inviteresp);
				} catch (err) {
					console.log(err);
				}
			} catch (err) {
				console.log(err);
			}

			const survresp = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'activate_survey',[surveyOldId]);
			try {
				console.log(survresp);
				console.log('new survey in Limesurvey');
				this.surveyToDatabase(selectedSurvey[surveyId]);
				console.log('added to Limesurvey');
				UIStore.addFlag({ appearance: 'success', title: 'LimeSurvey: ', description: 'Survey, questiongroup(s) and question(s) are newly added to limesurvey and database.' });
				history.push(`/${orgId}/${repId}/surveys`);
			} catch (err) {
				console.log(err);
			}
		}
	}

	private renderItem = () => {
		const { props } = this;
		const { OrganisationsStore, match: { params: { orgId, repId } } } = props;
		const organisation = OrganisationsStore.findById(orgId);
		const report = repId ? collection(organisation._reports).findById(`${orgId}/${repId}`) : null;
		const survey = get(organisation, 'survey');
		const model = get(report, 'model');
		return { organisation, report, model, survey };
	}

	private surveyToDatabase = (survey) => {
		const { props } = this;

		const { OrganisationsStore } = props;

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			//history.push(`/${orgId}/${repId}/surveys`);
			console.log('saved in firebase');
			location.reload(true);
		};
		const onError = (error) => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			// TODO: Show flag
			console.log('failed', error);
		};
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works

		return OrganisationsStore.addSurvey(survey, { onSuccess, onError });
	}

	private getRandomID = () => {
		return Math.floor(Math.random() * Math.floor(999999));
	}

}
const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
