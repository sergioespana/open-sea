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

const OrganisationInfographics = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, state } = props;
	const organisation = OrganisationsStore.findById(orgId) || {};
	const infographics = organisation._infographics;

	const PageHead = (
		<Header
			title="Infographics"
			headTitle={`${organisation.name} / Infographics`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>
			]}
		/>
	);

	if (infographics.length === 0) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-welcome.svg" />
						<h1>Let's create an infographic</h1>
						<p>
							It seems that you have not created an infographic yet. Get started below.
						</p>
						<p>
							<LinkButton appearance="default" to={`/create/infographic?organisation=${orgId}`}>Create an infographic</LinkButton>
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
							label: 'Infographic',
							format: (name, { _infographicId }) => <Link to={`/${orgId}/infographics/${ _infographicId }`}>{name}</Link>
						},
						{
							key: 'report',
							label: 'Report',
							format: (name) => <Link to={`/${name}`}>{name.split('/')[1]}</Link>
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
					data={infographics}
					defaultSort="-last-updated"
					filters={['status', 'createdBy']}
				/>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationInfographics;
