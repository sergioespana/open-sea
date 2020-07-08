import { get, map, pickBy } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MdMoreHoriz, MdRefresh, MdRemove } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { isNullOrUndefined } from 'util';
import Button from '../../../../components/Button';
import Container from '../../../../components/Container';
import EmptyState from '../../../../components/EmptyState';
import Header from '../../../../components/Header';
import { Menu, MenuOption } from '../../../../components/Menu';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../../components/Modal';
import { Input } from '../../../../components/NewInput';
import { Section } from '../../../../components/Section';
import { Organisation, Survey } from '../../../../domain/Organisation';
import collection from '../../../../stores/collection';
import { getResponses } from '../../../../util/responses-handler';



interface State {
	organisation: Organisation;
	survey: Survey;
	showModal: boolean;
}

@inject(app('OrganisationsStore', 'ReportsStore'))
@observer
class ReportSurveyResponse extends Component<any> {
	readonly state: State = {
		organisation: null,
		survey: null,
		showModal: false
	};

	render () {
		let { match: { params: { orgId, repId, sId } }, OrganisationsStore } = this.props;
		const organisation: Organisation = OrganisationsStore.findById(orgId) || {};
		const { showModal } = this.state;
		this.state.organisation = organisation;
		const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${sId}`);
		this.state.survey = survey;
		const report = collection(organisation._reports).findById(`${orgId}/${repId}`);
		const model = get(report, 'model');
		let aresponse = false;

		const PageHead = (
			<Header
				title="Survey Responses"
				headTitle={`${organisation.name} / Survey Overview`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
				]}
			>
				<Button appearance="error" onClick={this.onRemove}><MdRemove height={20} width={20} /></Button>
				<Button appearance="light" onClick={this.onRefresh}><MdRefresh height={20} width={20} /></Button>
				<Menu position="bottom-left" trigger={<Button appearance="light"><MdMoreHoriz height={20} width={20} /></Button>}>
					<MenuOption>Share link</MenuOption>
					<MenuOption>Print</MenuOption>
					<MenuOption>Download</MenuOption>
				</Menu>
			</Header>
		);
		
		// show only topics which have questions
		let topicItems;
		map(survey.questions, ({ topic: topid, responses }) => {
			topicItems = pickBy(model.topics, ({}, tId) => tId === topid);
			if (!isNullOrUndefined(responses)) aresponse = true;
		});

		return(
			<React.Fragment>
				{PageHead}
				{aresponse ?
						(
				<Container style={{ maxWidth: 400 }}>
					<Section>
					<p>A survey is valid if (at least) {this.state.survey.responserate * 100}% of the participants respond. An invalid amount of responses is outlined in red. </p>
						{map(topicItems, ({ name: topName }, topId) => {
							const survItems = pickBy(survey.questions, ({ topic }) => topic === topId);
							return(
							<React.Fragment>
							<h2>{topName}</h2>
							<br/>
							{map(survItems, ({ name: Qname, responses }) => {
								return(
									<React.Fragment>
										<h3>{Qname}</h3>
										<p>{this.renderItem(responses, responses.length)}</p>
										<br/>
									</React.Fragment>
								);
							})}
							</React.Fragment>
							);
						})}
					</Section>
					</Container>
										) :
										<Section>
												<EmptyState>
													<img src="/assets/images/empty-state-no-data.svg" />
													<h1>Please refresh</h1>
													<p>
														There is currently no response to be displayed, please refresh to get the latest responses.
													</p>
													<p>
														<Button appearance="default" onClick={this.onRefresh}>Refresh</Button>
													</p>
												</EmptyState>
										</Section>}
						<Modal
							isOpen={showModal}
						>
								<ModalHeader>
									<h1>No responses</h1>
								</ModalHeader>
								<ModalSection>
									<p>
										Unfortunately there are no responses, please wait and try another time.
									</p>
								</ModalSection>
								<ModalFooter>
										<Button
											appearance="default"
											onClick={this.toggleModal}
											type="button"
										>
											Accept
										</Button>
								</ModalFooter>
						</Modal>
			</React.Fragment>
		);
	}
	private onRemove = () => {
		const { props } = this;
		const { history, match: { params: { orgId, repId } }, OrganisationsStore } = props;
		const organisation = OrganisationsStore.findById(orgId);
		const survey = this.state.survey;
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
	private toggleModal = () => this.setState(toggleModal);

	private renderItem = (data, num) => (
		<React.Fragment>
		<Input
			appearance={num >= this.state.survey.responserate ? "default" : "error" }
			disabled={true}
			isCompact
			name={data}
			//label={num}
			//multiple={rest.type === 'text'}
			value={data}
		/>
		<small> {num} out of {this.state.survey.participants} participants. </small>
		<br/>
		</React.Fragment>
	)

	private onRefresh = async () => {
		let { match: { params: { orgId, repId } } } = this.props;
		const organisation = this.state.organisation;

		const Selectsurvey = this.state.survey;
		console.log(Selectsurvey);

		map(organisation._surveys, async ({ _sId }) => {
			const survey = collection(organisation._surveys).findById(`${orgId}/${repId}/${_sId}`);
			if (survey) {
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
}
const toggleModal = (prevState: State) => ({ showModal: !prevState.showModal });

export default ReportSurveyResponse;
