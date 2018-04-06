import { isUndefined } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { LinkButton } from '../../components/Button';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
import { Lozenge } from '../../components/Lozenge';
import { Section } from '../../components/Section';
import { Table } from '../../components/Table';

const OrganisationReports = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id') || {};
	const reports = organisation._reports;

	const PageHead = (
		<Header
			title="Reports"
			headTitle={`${organisation.name} / Reports`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
			]}
		/>
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

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Table
					columns={[
						{
							key: 'name',
							label: 'Report',
							format: (name, { _id }) => <Link to={`/${_id}`}>{name}</Link>
						},
						{
							key: 'creator',
							label: 'Created by'
						},
						{
							label: 'Last updated',
							value: ({ created, updated }) => created || updated,
							format: (updated) => moment().diff(updated) > 86400000 ? moment(updated).format('DD-MM-YYYY') : moment(updated).fromNow()
						},
						{
							key: 'updater',
							label: 'Updated by'
						},
						{
							key: 'status',
							label: 'Status',
							value: ({ data, model }) => (isUndefined(model) && isUndefined(data)) ? 'New' : 'In Progress',
							format: (value) => <Lozenge appearance={value.split(' ').join('').toLowerCase()}>{value}</Lozenge>
						}
					]}
					data={reports}
					defaultSort="-last-updated"
					filters={['status', 'creator']}
				/>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationReports;
