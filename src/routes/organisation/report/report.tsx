import { get, isEmpty, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MdEdit, MdMoreHoriz } from 'react-icons/md';
import { Redirect, withRouter } from 'react-router-dom';
import { Button, LinkButton } from '../../../components/Button';
import Chart from '../../../components/Chart';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Menu, MenuOption } from '../../../components/Menu';
import { ReportGrid, ReportGridItem } from '../../../components/ReportGrid';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';

interface State {
	showModal: boolean;
}

@inject(app('OrganisationsStore', 'ReportsStore', 'UIStore'))
@observer
class OrganisationReportOverview extends Component<any, State> {
	state: State = {
		showModal: false
	};

	render () {
		const { match: { params: { orgId, repId } }, OrganisationsStore, ReportsStore } = this.props;
		const organisation = OrganisationsStore.findById(orgId);
		const report = collection(organisation._reports).findById(`${orgId}/${repId}`);
		const model = get(report, 'model');
		const data = get(report, 'data');

		const PageHead = (
			<Header
				title={report.name}
				headTitle={`${organisation.name} / ${report.name}`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>
				]}
			>
				{!isEmpty(data) && <LinkButton appearance="light" to={`/${orgId}/${repId}/data`}><MdEdit height={20} width={20} /></LinkButton>}
				{!isEmpty(data) && <Menu position="bottom-left" trigger={<Button appearance="light"><MdMoreHoriz height={20} width={20} /></Button>}>
					<MenuOption>Share link</MenuOption>
					<MenuOption>Print</MenuOption>
					<MenuOption>Download</MenuOption>
				</Menu>}
			</Header>
		);

		if (isEmpty(model)) return <Redirect to={`/${orgId}/${repId}/model`} />;

		if (isEmpty(data)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-data.svg" />
						<h1>Add some data</h1>
						<p>
							To generate a report, some data is required.
						</p>
						<p>
							<LinkButton appearance="default" to={`/${orgId}/${repId}/data`}>Add data</LinkButton>
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		const items = get(model, 'reportItems');

		if (isEmpty(items)) return (
			<React.Fragment>
				{PageHead}
				<Container>
					<EmptyState>
						<img src="/assets/images/empty-state-no-data.svg" />
						<h1>No report items</h1>
						<p>
							The model for this report contains no report items which prevents openSEA from displaying anything here.
						</p>
						<p>
							<LinkButton appearance="default" to={`/${orgId}/${repId}/model`}>Manage model</LinkButton>
							<LinkButton appearance="link" to="#">Learn more</LinkButton>
						</p>
					</EmptyState>
				</Container>
			</React.Fragment>
		);

		return (
			<React.Fragment>
				{PageHead}
				<Container>
					<Section maxWidth={700}>
						<ReportGrid>
							{map(items, (item) => {
								// Show chart if the chart object is set. Prefer chart
								// over 'value' key.
								if (item.chart) {
									// We overwrite the user's chart type setting because pie charts
									// are currently broken.
									const chart = {
										type: item.chart.type === 'pie' ? 'percentage' : item.chart.type,
										data: {
											labels: map(item.chart.data, (indId) => model.indirectIndicators[indId].name),
											datasets: [{
												values: map(item.chart.data, (indId) => ReportsStore.compute(model.indirectIndicators[indId].value, data))
											}]
										}
									};

									return (
										<ReportGridItem>
											<h2>{item.name}</h2>
											<Chart {...chart} />
										</ReportGridItem>
									);
								}
								// Only show a single value.
								if (item.value) return (
									<ReportGridItem>
										<h3>{item.name}</h3>
										<p>
											{ReportsStore.compute(model.indirectIndicators[item.value].value, data)}
											{model.indirectIndicators[item.value].type === 'percentage' && '%'}
										</p>
									</ReportGridItem>
								);
								// No value or chart specified, don't show the item.
								return null;
							})}
						</ReportGrid>
					</Section>
				</Container>
			</React.Fragment>
		);
	}
}

export default withRouter(OrganisationReportOverview);
