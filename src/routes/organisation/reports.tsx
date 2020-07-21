import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import { find, get } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { LinkButton } from '../../components/Button';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
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
							To get started using openESEA for {organisation.name}, create a report below.
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
							value: ({ created, updated }) => updated || created,
							format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
						},
						{
							key: 'updatedBy',
							label: 'Updated by',
							value: ({ createdBy, updatedBy }) => get(find(state.users, { _id: updatedBy || createdBy }), 'name'),
							format: (name, { createdBy, updatedBy }) => <Link to={`/dashboard/people/${updatedBy || createdBy}`}>{name}</Link>
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
