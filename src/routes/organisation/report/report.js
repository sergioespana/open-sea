import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Chart from 'components/Chart';
import Container from 'components/Container';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import Placeholder from 'components/Placeholder';

const OrganisationReport = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore, ReportsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const report = ReportsStore.getItem(`${orgId}/${repId}`, '_id');
	const data = report._data;
	const model = report.model || {};
	const indicators = model.indicators || {};
	const reportItems = model.reportItems || [];

	return (
		<Fragment>
			<Header secondary={(!isEmpty(model) && !isEmpty(data)) && <Button to={`/${orgId}/${repId}/data`}>Edit data</Button>}>
				<Breadcrumbs>
					<Link to={`/${orgId}`}>{ organisation.name }</Link>
					<Link to={`/${orgId}/reports`}>Reports</Link>
				</Breadcrumbs>
				<h1>{ report.name }</h1>
			</Header>
			<Container>
				{ isEmpty(model) ? (
					<Placeholder>
						<h1>Whoa there!</h1>
						<p>No model exists for this report. Drop one on the screen to get started.</p>
					</Placeholder>
				) : isEmpty(data) ? (
					<Placeholder>
						<h1>Whoa there!</h1>
						<p>No data exists for this report. Add some data to get started.</p>
						<p><Button to={`/${orgId}/${repId}/data`}>Add data</Button></p>
					</Placeholder>
				) : map(reportItems, (item, i) => {
					const data = {
						labels: map(item.data, (indId) => indicators[indId].name),
						datasets: [{
							values: map(item.data, (indId) => ReportsStore.compute(orgId, repId, indId))
						}]
					};

					return (
						<Chart
							key={i}
							title={item.name}
							type={item.chart === 'pie' ? 'percentage' : item.chart}
							data={data}
							colors={item.colors || []}
						/>
					);
				}) }
			</Container>
		</Fragment>
	);
}));

export default OrganisationReport;