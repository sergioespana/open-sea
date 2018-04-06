import { filter, isUndefined } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { EmptyState } from '../../components/EmptyState';
import { Header } from '../../components/Header';
import { Link } from '../../components/Link';
import { Lozenge } from '../../components/Lozenge';
import { Menu, MenuOption } from '../../components/Menu';
import { Section } from '../../components/Section';
import { Table } from '../../components/Table';

const OrganisationOverview = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
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
							<Button to={`/create/report?organisation=${orgId}`}>Create a report</Button>
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
								? <Button to={`/${orgId}/reports`}>Manage existing reports</Button>
								: <Button to={`/create/report?organisation=${orgId}`}>Add {reports.length > 0 ? 'an additional' : 'a'} report</Button>
							}
						</p>
					</EmptyState>
				</Section>
				{RecentReports}
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section />
				{RecentReports}
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationOverview;
