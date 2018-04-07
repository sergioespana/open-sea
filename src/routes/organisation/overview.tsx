import { filter, get, isUndefined, last, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { LinkButton } from '../../components/Button';
import Chart from '../../components/Chart';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
import { Lozenge } from '../../components/Lozenge';
import { ReportGrid, ReportGridItem } from '../../components/ReportGrid';
import { Section } from '../../components/Section';
import { Table } from '../../components/Table';

const OrganisationOverview = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id') || {};
	const reports = organisation._reports;
	const withData = filter(organisation._reports, 'data');

	const PageHead = (
		<Header
			title="Overview"
			headTitle={organisation.name}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
			]}
		/>
	);
	const RecentReports = (
		<Section width={375}>
			<h1>Reports</h1>
			<Table
				columns={[
					{
						key: 'name',
						label: 'Report',
						format: (name, { _id }) => <Link to={`/${_id}`}>{name}</Link>
					},
					{
						key: 'status',
						label: 'Status',
						value: ({ data, model }) => (isUndefined(model) && isUndefined(data)) ? 'New' : 'In Progress',
						format: (value) => <Lozenge appearance={value.split(' ').join('').toLowerCase()}>{value}</Lozenge>
					},
					{
						label: 'Last updated',
						hidden: true,
						value: ({ created, updated }) => created || updated,
						format: (updated) => moment().diff(updated) > 86400000 ? moment(updated).format('DD-MM-YYYY') : moment(updated).fromNow()
					}
				]}
				data={reports}
				defaultSort="-last-updated"
				limit={5}
				sortingDisabled
			/>
			<p>Recently updated · <Link to={`/${orgId}/reports`}>View all reports</Link></p>
		</Section>
	);

	if (reports.length === 0) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-welcome.svg" />
						<h1>Let's begin</h1>
						<p>
							To get started using openSEA for {organisation.name}, create a report below.
						</p>
						<p>
							<LinkButton appearance="default" to={`/create/report?organisation=${orgId}`}>Create a report</LinkButton>
						</p>
					</EmptyState>
				</Section>
			</Container>
		</React.Fragment>
	);

	if (withData.length < 2) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-no-data.svg" />
						<h1>Insufficient data</h1>
						<p>
							At least two reports with data are required to create an aggregated
							overview of this organisation.
						</p>
						<p>
							{reports.length > 2
								? <LinkButton appearance="default" to={`/${orgId}/reports`}>Manage existing reports</LinkButton>
								: <LinkButton appearance="default" to={`/create/report?organisation=${orgId}`}>Add {reports.length > 0 ? 'an additional' : 'a'} report</LinkButton>
							}
						</p>
					</EmptyState>
				</Section>
				{RecentReports}
			</Container>
		</React.Fragment>
	);

	const model = get(last(withData), 'model');
	const items = get(last(withData), 'model.reportItems');

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<ReportGrid>
						{map(items, (item) => {
							const chart = {
								type: 'line',
								data: {
									labels: map(withData, ({ name }) => name),
									datasets: item.chart
										? map(item.chart.data, (indId) => ({
											title: model.indicators[indId].name,
											values: map(withData, ({ data }) => ReportsStore.compute(model.indicators[indId].value, data))
										}))
										: item.value ? [{
											title: model.indicators[item.value].name,
											values: map(withData, ({ data }) => ReportsStore.compute(model.indicators[item.value].value, data))
										}] : []
								}
							};

							return (
								<ReportGridItem>
									<h2>{item.name}</h2>
									<Chart {...chart} />
								</ReportGridItem>
							);
						})}
					</ReportGrid>
				</Section>
				{RecentReports}
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationOverview;
