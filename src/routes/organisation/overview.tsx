import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import { filter, find, flatten, get, isUndefined, last, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { LinkButton } from '../../components/Button';
import Chart from '../../components/Chart';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
import Progress from '../../components/Progress';
import { ReportGrid, ReportGridItem } from '../../components/ReportGrid';
import { Section } from '../../components/Section';
import { Table } from '../../components/Table';

const OrganisationOverview = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const organisation = OrganisationsStore.findById(orgId) || {};
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
		<React.Fragment>
			<h1>Reports</h1>
			<Table
				columns={[
					{
						key: 'name',
						label: 'Report',
						format: (name, { _id }) => <Link to={`/${_id}`}>{name}</Link>
					},
					{
						key: 'actions',
						label: 'Edit',
						labelHidden: true,
						format: (_, { _id }) => <Link to={`/${_id}/data`}>Edit data</Link>
					},
					{
						label: 'Last updated',
						hidden: true,
						value: ({ created, updated }) => created || updated,
						format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
					}
				]}
				data={reports}
				defaultSort="-last-updated"
				limit={5}
				sortingDisabled
			/>
			<p>Recently updated · <Link to={`/${orgId}/reports`}>View all reports</Link></p>
		</React.Fragment>
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
				<Section width={375}>
					{RecentReports}
				</Section>
			</Container>
		</React.Fragment>
	);

	const report = last(withData);
	const model = get(report, 'model');
	const items = get(model, 'reportItems');
	let CertificationProgress = null;
	const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
	const certModel = parentNetwork ? get(parentNetwork, 'model') : model;

	// To display certifications, prefer the model from parent network. If there's no
	// parent network, use the report's model. If neither have certifications defined,
	// don't do anything.
	if (certModel && certModel.certifications) {
		const assessed = ReportsStore.assess(certModel.certifications, certModel.indicators, report);
		const { next: nextIndex } = ReportsStore.getCertificationIndex(assessed);
		const next = assessed[nextIndex];

		if (next) {
			const met = filter(next.requirements, { _pass: true });
			CertificationProgress = (
				<React.Fragment>
					<h1 style={{ margin: '36px 0 12px 0' }}>Certification</h1>
					<Progress value={met.length} max={next.requirements.length} />
					<p>Progress based on latest report · <Link to={`/${orgId}/certification`}>More details</Link></p>
				</React.Fragment>
			);
		}
	}

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section maxWidth={700}>
					<ReportGrid>
						{map(items, (item) => {
							const itemIndicators = item.chart ? [...item.chart.values] : [item.value];
							const yMarkers = model.certifications
								? filter(flatten(map(itemIndicators, (indId) => map(model.certifications, (certification) => {
									const toPlot: any = find(certification.requirements, { indicator: indId });
									return !isUndefined(toPlot)
										? {
											label: certification.name,
											value: toPlot.value
										}
										: undefined;
								}))), (value) => !isUndefined(value))
								: [];

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
										}] : [],
									yMarkers: yMarkers.length > 0 && yMarkers
								}
							};

							const dataTypes = flatten(map(chart.data.datasets, (set) => map(set.values, (value) => typeof value)));
							// Don't render a graph when there's string data in the datasets.
							if (dataTypes.includes('string')) return null;

							return (
								<ReportGridItem key={item.name}>
									<h2>{item.name}</h2>
									<Chart {...chart} />
								</ReportGridItem>
							);
						})}
					</ReportGrid>
				</Section>
				<Section width={375}>
					{RecentReports}
					{CertificationProgress}
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationOverview;
