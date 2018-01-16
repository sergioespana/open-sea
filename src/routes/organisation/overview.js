import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { Link } from 'react-router-dom';
import Placeholder from 'components/Placeholder';
import sortBy from 'lodash/sortBy';

const PageHeader = ({ orgId, organisation }) => (
	<Header>
		<Breadcrumbs>
			<Link to={`/${orgId}`}>{ organisation.name }</Link>
		</Breadcrumbs>
		<h1>Overview</h1>
	</Header>
);

const OrganisationOverview = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const reports = organisation._reports;

	if (reports.length === 0) return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container>
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>No reports exist for this organisation! To get started, create a report first.</p>
					<p><Button to={`/create/report?organisation=${orgId}`}>Create a report</Button></p>
				</Placeholder>
			</Container>
		</Fragment>
	);

	const mostRecent = find(sortBy(organisation._reports, ['created']), (value) => !isUndefined(value.model)) || {};

	if (isEmpty(mostRecent)) return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container>
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>None of your organisation's reports seem to have a model.</p>
				</Placeholder>
			</Container>
		</Fragment>
	);

	return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container>
				
			</Container>
		</Fragment>
	);
}));

export default OrganisationOverview;