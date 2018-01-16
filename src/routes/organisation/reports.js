import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import Table from 'components/Table';

const PageHeader = ({ orgId, organisation }) => (
	<Header>
		<Breadcrumbs>
			<Link to={`/${orgId}`}>{ organisation.name }</Link>
		</Breadcrumbs>
		<h1>Reports</h1>
	</Header>
);

const OrganisationReports = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const reports = organisation._reports;

	if (isEmpty(reports)) return (
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

	return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container>
				<Table
					data={organisation._reports}
					defaultSort="-updated"
					columns={[
						{
							key: 'name',
							label: 'Report',
							value: ({ name }) => name,
							format: (value, { _id, name }) => <Link to={`/${orgId}/${_id}`}>{ name }</Link>
						},
						{
							key: 'updated',
							label: 'Last updated',
							value: ({ created, updated }) => updated || created,
							format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow()
						},
						{ key: 'status', label: 'Status' }
					]}
				/>
			</Container>
		</Fragment>
	);
}));

export default OrganisationReports;