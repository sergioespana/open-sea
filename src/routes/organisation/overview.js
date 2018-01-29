import Header, { Breadcrumbs, Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Chart from 'components/Chart';
import Container from 'components/Container';
import filter from 'lodash/filter';
import findLast from 'lodash/findLast';
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { Link } from 'components/Link';
import Lozenge from '@atlaskit/lozenge';
import map from 'lodash/map';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import Table from 'components/Table';

const PageHeader = ({ orgId, organisation }) => (
	<Header>
		<Section>
			<Breadcrumbs>
				<Link to={`/${orgId}`}>{ organisation.name }</Link>
			</Breadcrumbs>
			<h1>Overview</h1>
		</Section>
	</Header>
);

const Head = ({ organisation }) => <Helmet title={organisation.name} />;

const OrganisationOverview = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const reports = ReportsStore.getItems({ _orgId: orgId });

	if (reports.length === 0) return (
		<Fragment>
			<Head organisation={organisation} />
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container>
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>No reports exist for this organisation! To get started, create a report first.</p>
					<p><Button cta color="#ffffff" to={`/create/report?organisation=${orgId}`}>Create a report</Button></p>
				</Placeholder>
			</Container>
		</Fragment>
	);

	const reportsWithData = filter(reports, 'data');
	const mostRecent = findLast(reportsWithData, 'model') || {};
	const model = mostRecent.model || {};
	const indicators = model.indicators || {};
	const reportItems = model.reportItems || [];

	return (
		<Fragment>
			<Head organisation={organisation} />
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container flex>
				{ isEmpty(mostRecent) || reportsWithData.length < 2
					? <Placeholder />
					: map(reportItems, (item, i) => {
						const data = {
							labels: map(reportsWithData, ({ name }) => name),
							datasets: map(item.data, (indId) => ({
								title: indicators[indId].name,
								values: map(reportsWithData, ({ _orgId, _repId }) => ReportsStore.compute(_orgId, _repId, indId))
							}))
						};

						return (
							<Chart
								key={i}
								title={item.name}
								type="line"
								data={data}
							/>
						);
					})
				}
				<section style={{ flex: '0 0 375px' }}>
					<h1>Reports</h1>
					<Table
						disableSorting
						defaultSort="-updated"
						data={reports}
						limit={4}
						columns={[
							{
								key: 'name',
								label: 'Report',
								value: ({ name }) => name,
								format: (value, { _id, name }) => <Link to={ `/${_id}` }>{ name }</Link>
							},
							{
								key: 'updated',
								label: 'Last updated',
								value: ({ created, updated }) => updated || created,
								format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow(),
								hidden: true
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
					<p>
						<span>Recently updated</span>&nbsp;·&nbsp;<Link to={`/${orgId}/reports`}>View all reports</Link>
					</p>
				</section>
			</Container>
		</Fragment>
	);
}));

export default OrganisationOverview;