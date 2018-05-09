import { find, get, isUndefined } from 'lodash';
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
import Table from '../../components/Table';

const OrganisationReports = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, state } = props;
	const organisation = OrganisationsStore.findById(orgId) || {};
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
							key: 'createdBy',
							label: 'Created by',
							value: ({ createdBy }) => get(find(state.users, { _id: createdBy }), 'name'),
							format: (name, { createdBy }) => <Link to={`/dashboard/people/${createdBy}`}>{name}</Link>
						},
						{
							label: 'Last updated',
							value: ({ created, updated }) => created || updated,
							format: (updated) => moment().diff(updated) > 86400000 ? moment(updated).format('DD-MM-YYYY') : moment(updated).fromNow()
						},
						{
							key: 'updatedBy',
							label: 'Updated by',
							value: ({ updatedBy }) => get(find(state.users, { _id: updatedBy }), 'name'),
							format: (name, { updatedBy }) => <Link to={`/dashboard/people/${updatedBy}`}>{name}</Link>
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
					filters={['status', 'createdBy']}
				/>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationReports;
