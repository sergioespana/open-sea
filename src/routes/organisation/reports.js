import Header, { Breadcrumbs, Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { Link } from 'components/Link';
import Lozenge from '@atlaskit/lozenge';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import Table from 'components/Table';

const PageHeader = ({ orgId, organisation }) => (
	<Header>
		<Section>
			<Breadcrumbs>
				<Link to={`/${orgId}`}>{ organisation.name }</Link>
			</Breadcrumbs>
			<h1>Reports</h1>
		</Section>
	</Header>
);

const Head = ({ organisation }) => <Helmet title={`${organisation.name} / Reports`} />;

const OrganisationReports = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const reports = ReportsStore.getItems({ _orgId: orgId });

	if (isEmpty(reports)) return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Head organisation={organisation} />
			<Container>
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>No reports exist for this organisation! To get started, create a report first.</p>
					<p><Button appearance="primary" to={`/create/report?organisation=${orgId}`}>Create a report</Button></p>
				</Placeholder>
			</Container>
		</Fragment>
	);

	return (
		<Fragment>
			<PageHeader orgId={orgId} organisation={organisation} />
			<Head organisation={organisation} />
			<Container>
				<Table
					data={reports}
					defaultSort="-updated"
					columns={[
						{
							key: 'name',
							label: 'Report',
							value: ({ name }) => name,
							format: (value, { _id, name }) => <Link to={`/${_id}`}>{ name }</Link>
						},
						{
							key: 'updated',
							label: 'Last updated',
							value: ({ created, updated }) => updated || created,
							format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow()
						},
						{
							key: 'status',
							label: 'Status',
							value: ({ data, model }) => {
								if (isUndefined(model) && isUndefined(data)) return { label: 'New', value: 'new' };
								return { label: 'In Progress', value: 'inprogress' };
							},
							format: (value) => <Lozenge appearance={value.value}>{ value.label }</Lozenge>
						}
					]}
				/>
			</Container>
		</Fragment>
	);
}));

export default OrganisationReports;