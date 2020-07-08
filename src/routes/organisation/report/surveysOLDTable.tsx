import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import linkState from 'linkstate';
import { debounce, find, get, inRange, isUndefined, map, pickBy, pick, set, flatten, uniq, filter } from 'lodash';
import { app } from 'mobx-app';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { Component, SyntheticEvent } from 'react';
import { Button, ButtonGroup } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Redirect } from 'react-router-dom';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import Select, { AsyncSelect, SelectOption } from '../../../components/Select';
import Input from '../../../components/NewInput';
import { Table, TableCellWrapper } from '../../../components/Table';
import { Stakeholder, Stakeholdergroup, Report } from '../../../domain/Organisation';
import { getCurrentUserAccess } from '../../../stores/helpers';
import { UIStore, OrganisationsStore, ReportsStore } from 'src/stores';
import collection from '../../../stores/collection';
import { requestImplement } from '../../../util/lime-api';
import { isNullOrUndefined } from 'util';
import { unique } from 'mobx/lib/utils/utils';
import { matchPath } from 'react-router';
import ListInput from 'src/components/NewInput/ListInput';
import { ObservableArray } from 'mobx/lib/types/observablearray';
import firebase from 'firebase';
import { stringify } from 'querystring';
import { textShort } from '../../../assets/Qtypes/Text_short';
import { textLong } from '../../../assets/Qtypes/Text_long';
import { textHuge } from '../../../assets/Qtypes/Text_huge';
import { textDisplay } from '../../../assets/Qtypes/Text-Display';
import { numberInput } from '../../../assets/Qtypes/Number';
import { questionFormat } from '../../../util/LS-question';





interface State {
	sId: string;
	sgId: string;
	showModal: boolean;
	report: Report;
	userId: string;
	stakeholdergroup: Stakeholdergroup;
	stakeholder: Stakeholder;
	surveydata: any;
}

@inject(app('AuthStore', 'OrganisationsStore', 'UIStore', 'ReportsStore'))
@observer
export default class OrganisationReportSurvey extends Component<any> {
	input = null;
	readonly state: State = {
		sId: '',
		report: null,
		sgId: '',
		showModal: false,
		userId: '',
		stakeholdergroup: null,
		stakeholder: null,
		surveydata: null
	};

	render () {
		const { match: { params: { orgId, repId } }, state } = this.props;
		let { sId, sgId, showModal, surveydata } = this.state;
		const items = this.renderItem();
		const report = items.report;
		const model = items.model;
		const organisation = items.organisation;

		surveydata = organisation._surveys;
		const currentUserAccess = getCurrentUserAccess(state, organisation);

		const surveylist = [];
		if (!isNullOrUndefined(model)) {
			map(model.surveys,({ name }, sId) => {
				surveylist.push({ label: `${sId}: ${name}`, value: sId });
			});
		}

		const stakeholdergrouplist = [];
		map(organisation._stakeholdergroups,({ name, _sgId }) => stakeholdergrouplist.push({ label: name, value: _sgId }));



		/* to remove:
								{
							key: '_sId',
							label: '',
							format: (sId) => {
								return (
										<Button appearance="subtle-link" onClick={this.onRemove(sId)}>{<MdRemoveCircle />}</Button>);
							}
						} */

		return (
			<React.Fragment>
				<Header
					title="Surveys"
					headTitle={`Surveys - ${organisation.name} / ${report.name}`}
					breadcrumbs={[
						<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
						<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>,
						<Link key={`/${orgId}/${repId}`} to={`/${orgId}/${repId}`}>{report.name}</Link>
					]}
				>
					{inRange(currentUserAccess, 30, 101) && <Button appearance="default" onClick={this.toggleModal}>Add</Button>}
				</Header>
				<Container style={{ display: 'block' }}>
				<Table
					columns={[
						{
							key: '_sId',
							label: 'Id',
							format: (name, { _id }) => <Link to={`/${_id}`}>{name}</Link>
						},
						{
							key: 'name',
							label: 'Name'
							//format: (name, { _sId }) => <Link to={this.toggleModal}>{name}</Link> // When click --> edit
						},
						{
							key: 'participants',
							label: 'Participants'
						},
						{
							key: 'population',
							label: 'Stakeholdergroup'
						},
						{
							key: 'repId',
							label: 'Report'
						},
						{
							key: 'createdBy',
							label: 'Created by',
							value: ({ createdBy }) => get(find(state.users, { _id: createdBy }), 'name'),
							format: (name, { createdBy }) => <Link to={`/dashboard/people/${createdBy}`}>{name}</Link>
						},
						{
							label: 'Updated',
							value: ({ created, updated }) => updated || created,
							format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
						}
					]}
					data={surveydata}
					defaultSort="repId"
					filters={['name', 'repId', '_sId', 'createdBy']}
				/>
				</Container>
				<Modal
					isOpen={showModal}
					onClose={this.toggleModal}
				>
					<form onSubmit={this.onSubmit}>
					{organisation.ls_host && organisation.ls_password && organisation.ls_account
					? (<React.Fragment>
						<ModalHeader>
							<h1>Initialise survey</h1>
						</ModalHeader>
						<ModalSection>
							<p>
								Please select a survey and suiting target population to be initialised. If no surveys are shown, please specify one in the model. If no stakeholdergroups are present, please add one. 
							</p>
							<Select
								//label="Select group"
								onChange={linkState(this, 'sId', 'value')}
								isCompact
								options={surveylist}
								placeholder="Select survey to initialise"
								value={sId}
							/>
							<Select
								//label="Select group"
								onChange={linkState(this, 'sgId', 'value')}
								isCompact
								options={stakeholdergrouplist}
								placeholder="Select survey to initialise"
								value={sgId}
							/>
						</ModalSection>
						<ModalFooter>
							<ButtonGroup>
								<Button
									appearance="default"
									disabled={sId === '' || sgId === ''}
									type="submit"
								>
									Add
								</Button>
								<Button appearance="subtle-link" onClick={this.toggleModal} type="button">Cancel</Button>
							</ButtonGroup>
						</ModalFooter>
						</React.Fragment>
					) :
					<Redirect to={`/${orgId}/Settings/Details`} />}
					</form>
				</Modal>
			</React.Fragment>
		);
	}

	private getRef = (node) => this.input = node;
	private toggleModal = () => this.setState(toggleModal);

	private onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { sId, sgId } = this.state;
		const { history ,match: { params: { orgId, repId } }, UIStore } = this.props;
		const items = this.renderItem();
		const model = items.model;
		const organisation = items.organisation;
		const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${sId}`); // stored and activated surveys
		let surveyOldId = ''; 


		const selectedParticipants = items.stakeholdergroups.stakeholders;


		const selectedSurvey = pick(model.surveys, sId); // selected survey by user + add meta-data for traceability
		selectedSurvey[sId]._orgId = orgId;
		selectedSurvey[sId]._sId = `${sId}-${repId}`;
		selectedSurvey[sId]._id = `${orgId}/${sId}/${sId}`;
		selectedSurvey[sId].population = sgId;
		selectedSurvey[sId].repId = repId;


		// find exsisting surveyID else create one which will be used in Limesurvey and therefore is unique
		if (isNullOrUndefined(survey) || isNullOrUndefined(survey.lsId)) selectedSurvey[sId].lsId = this.getRandomID();
		else surveyOldId = survey.lsId;

		//create list of survey sections
		const topicsList = {};
		map(selectedSurvey[sId].questions, ({ topic }) => {
			console.log(model.topics[topic].name);
			topicsList[topic] = { name: model.topics[topic].name };
		});



		// fixme grouping based on topic, search for ref(direct indicator) then, direct indicator link with topic. print topic (NOT SURE?)

	/*	map(Qs, ({ topic }) => {
			topicsList[topic] = { name: model.topics[topic].name };
		}); */

		await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'list_surveys',[]).catch(err => { console.log(err); history.push(`${orgId}/settings/details`); }).then(async qlist => {
			if (qlist.status !== 'No surveys found' && surveyOldId !== '' && qlist.filter(e => e.sid === surveyOldId)) {
				UIStore.addFlag({ appearance: 'error', title: 'LimeSurvey: ', description: 'This survey was already present, please upload a new survey specification if you want to alter.' });
			} else
		// create new survey
		await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_survey',[selectedSurvey[sId].lsId, selectedSurvey[sId].name, 'en', 'G']).catch(err => console.log(err)).then(async survId => {
			surveyOldId = survId;
			selectedSurvey[sId].lsId = surveyOldId;
			//create Qgroup
			await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'set_language_properties',[survId, { 'surveyls_description': selectedSurvey[sId].description, 'surveyls_welcometext': selectedSurvey[sId].welcometext, 'surveyls_endtext' : selectedSurvey[sId].closingtext }]).catch(err => console.log(err)).then(() => {
				// map topics, and each topic search for questions which are the same and add those
				map(topicsList, async ({ name }, tId) => {
					const groupId = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_group',[surveyOldId, name]);
					try {
						//Format Quetion object with meta-data
						map(selectedSurvey[sId].questions, async ({ name: qName, topic, description, ismandatory, answertype, indicator, options, aggregatedqs, other }, qId) => {
							console.log('here:');
							console.log(aggregatedqs);
							indicator ? indicator = indicator : indicator = null;
							options ? options = options : options = null;
							aggregatedqs ? aggregatedqs = aggregatedqs : aggregatedqs = null;
							selectedSurvey[sId].questions[qId] = {
								name: qName,
								description: description,
								isMandatory: ismandatory,
								answerType: answertype,
								indicator: indicator,
								options: options,
								aggregatedQs: aggregatedqs,
								other: other
							};
							// if topic is the same in Qobject then add to the group
							if (topic === tId) {
								const resp = await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password],'import_question', [surveyOldId,groupId, questionFormat(qId, qName, answertype, ismandatory, other, description, options, aggregatedqs), 'lsq', ismandatory ]);
								try {
									// succes log the success
									console.log(resp);
								} catch (err) {
									console.log(err);
								}
							}
						});
					} catch (err) {
						console.log(err);
					}
				});
			});
		})
		.then(async () => {
			await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'activate_tokens',[surveyOldId]).catch(err => console.log(err)).then(async res => {
				console.log('Participants table activated:' + res.status);
				// add stakeholders to participants table
				map(selectedParticipants, async ({ firstname, lastname, email }) => {
					const sth = [];
					sth.push({ email: email, lastname: lastname, firstname: firstname });
					await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'add_participants',[surveyOldId, sth]).catch(err => console.log(err)).then(async res => {
					// res[0].token === token & email === email
						selectedSurvey[sId].participants = sth.length;
					});
				});
			});
		}). then(async () => {
			await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'activate_survey',[surveyOldId]).catch(err => console.log(err)).then(async res => {
				console.log('new survey in Limesurvey');
				this.surveyToDatabase(selectedSurvey[sId]);
				console.log('added to Limesurvey');
				UIStore.addFlag({ appearance: 'success', title: 'LimeSurvey: ', description: 'Survey, questiongroup(s) and question(s) are newly added to limesurvey and database.' })
				history.push(`/${orgId}/${repId}`);
			});
		});
		});
	}

	private renderItem = () => {
		const { props } = this;
		const { OrganisationsStore, match: { params: { orgId, repId } } } = props;
		const { sId, sgId } = this.state;

		const organisation = OrganisationsStore.findById(orgId);
		const report = repId ? collection(organisation._reports).findById(`${orgId}/${repId}`) : null;
		const survey = get(organisation, 'survey');

		const model = get(report, 'model');
		const stakeholdergroups = sgId ? collection(organisation._stakeholdergroups).findById(`${orgId}/${sgId}`) : null;
		return { organisation, report, model, stakeholdergroups, survey };
	}

	private surveyToDatabase = (survey) => {
		const { props } = this;

		const { history, OrganisationsStore, match: { params: { orgId } } } = props;

		const onSuccess = () => {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
			//history.push(`/${orgId}/${repId}`);
			console.log('saved in firebase');
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
	private capitalizeLetters = (txt) => {
		return txt.toUpperCase() ;
	}
	private surveyFormat = (title, question) => {
		return btoa('<document><LimeSurveyDocType>Question</LimeSurveyDocType><DBVersion>359</DBVersion><languages><language>en</language></languages><questions><fields><fieldname>qid</fieldname><fieldname>parent_qid</fieldname><fieldname>sid</fieldname><fieldname>gid</fieldname><fieldname>type</fieldname><fieldname>title</fieldname><fieldname>question</fieldname><fieldname>preg</fieldname><fieldname>help</fieldname><fieldname>other</fieldname><fieldname>mandatory</fieldname><fieldname>question_order</fieldname><fieldname>language</fieldname><fieldname>scale_id</fieldname><fieldname>same_default</fieldname><fieldname>relevance</fieldname><fieldname>modulename</fieldname></fields><rows><row><qid><![CDATA[12]]></qid><parent_qid><![CDATA[0]]></parent_qid><sid><![CDATA[331035]]></sid><gid><![CDATA[20]]></gid><type><![CDATA[T]]></type><title><![CDATA[' + title + ']]></title><question><![CDATA[' + question + ']]></question><preg/><help/><other><![CDATA[N]]></other><mandatory><![CDATA[N]]></mandatory><question_order><![CDATA[1]]></question_order><language><![CDATA[en]]></language><scale_id><![CDATA[0]]></scale_id><same_default><![CDATA[0]]></same_default><relevance><![CDATA[1]]></relevance></row></rows></questions></document>');
	}

	private onRemove = (sId) => {
		const { props } = this;
		const { history, match: { params: { orgId, repId } }, OrganisationsStore } = props;
		const organisation = OrganisationsStore.findById(orgId);
		const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${sId}`);
		console.log('hier');

		const onSuccess = () => {
			history.push(`/${orgId}/${repId}`);
			collection(organisation._surveys).remove(survey);
			console.log('survey deleted');
			location.reload(true);
		};

		const onError = (error) => {
			//props.state.isBusy = false; // FIXME: Use setAppState for this when it works
					// TODO: Show flag
			console.log('failed:', error);
		};
		//props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		return OrganisationsStore.removeSurvey(survey, { onSuccess, onError });
	}
}
const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });
