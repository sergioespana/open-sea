/mport csv from 'csvtojson';
import parse from 'html-react-parser';
import { get, isEmpty, isEqual, isNumber, List, map, pickBy, set, toNumber } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { Section } from '../../components/Section';
import { Organisation, Survey } from '../../domain/Organisation';
import collection from '../../stores/collection';
import { requestImplement } from '../../util/lime-api';

interface State {
	survIdList: Array<Survey>;
}

@inject(app('OrganisationsStore', 'ReportsStore'))
@observer
class OrganisationSurveys extends Component<any, State> {
	readonly state: State = {
		survIdList: []
	};
	componentWillMount () {
		let { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const organisation: Organisation = OrganisationsStore.findById(orgId) || {};
		const reports = organisation._reports;
		map(reports, async ({ _repId }) => {
			const report = collection(organisation._reports).findById(`${orgId}/${_repId}`);
			const survey = get(report, 'survey');
			set(survey, '_orgId', orgId);
			set(survey, '_repId', _repId);
			if (isEmpty(survey)) return null;
			this.state.survIdList.push(survey);
		});

	}

	render () {
		let { match: { params: { orgId } }, OrganisationsStore } = this.props;
		const organisation: Organisation = OrganisationsStore.findById(orgId) || {};
		const reports = organisation._reports;

		const PageHead = (
			<Header
				title="Survey Responses"
				headTitle={`${organisation.name} / Survey Overview`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
				]}
			>
			<Button appearance="light" onClick={this.onRefresh}>Refresh</Button>
			</Header>
		);

		const SummarySection = (
				map(this.state.survIdList, ({ summary, name, completed, fullresponse, incomplete }) => {
					if (isEmpty(summary))return null;
					return(
							<Section>
								<h1><b>Title: {name}</b></h1>
									<p>
									<h2>Response overview:</h2>
									<li>Complete: {completed}</li>
									<li>Incomplete: {incomplete}</li>
									<li>Full: {fullresponse}</li>
								</p>
								{parse(atob(summary))}
							</Section>
					);
				})
		);

		return (
			<React.Fragment>
				{PageHead}
				<Container>
						{SummarySection}
				</Container>
			</React.Fragment>
		);
	}
	private onRefresh = async (event) => {
		event.preventDefault();
		const { props } = this;
		const { history, match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
		const organisation = OrganisationsStore.findById(orgId);
		let itemsMap = 0;
		let itemsProcessed = 0;

		this.state.survIdList.forEach(async survey => {
			await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'export_statistics',[survey.sId, 'html']).catch(err => console.log(err))
					.then(async res => {
						survey.summary = res;
						itemsMap += 1;

						const onSuccess = () => {
							props.state.isBusy = false; // FIXME: Use setAppState for this when it works
							console.log('added summary');
							//location.reload(true);
						};
						const onError = (error) => {
							props.state.isBusy = false; // FIXME: Use setAppState for this when it works
									// TODO: Show flag
							console.log('failed:', error);
						};
						console.log(survey);
						props.state.isBusy = true;
					 ReportsStore.addSurvey(survey, { onSuccess, onError });
						// ad statistics base64 to repId;
					})
					.then(async () => {
						await requestImplement(organisation.ls_host,[organisation.ls_account, organisation.ls_password], 'get_summary',[survey.sId, 'all']).catch(err => console.log(err))
								.then(async res => {
									survey.completed = res.completed_responses;
									survey.fullresponse = res.full_responses;
									survey.incomplete = res.incomplete_responses;

									const onSuccess = () => {
										props.state.isBusy = false; // FIXME: Use setAppState for this when it works
										itemsProcessed += 1;
										console.log('added response statistics');
										if (itemsProcessed === itemsMap) location.reload(true);
									};
									const onError = (error) => {
										props.state.isBusy = false; // FIXME: Use setAppState for this when it works
												// TODO: Show flag
										console.log('failed:', error);
									};
									console.log(survey);
									props.state.isBusy = true;
									ReportsStore.addSurvey(survey, { onSuccess, onError });
								});
					});
		});
	}
}
export default OrganisationSurveys;
