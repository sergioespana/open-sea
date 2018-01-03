import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import Main from 'components/Main';
import moment from 'moment';
import React from 'react';
import Table from 'components/Table';

const Overview = inject(app('OrganisationsStore', 'ReportsStore'))(observer(({ OrganisationsStore, ReportsStore, match: { params: { id } } }) => (
	<Main>
		<Helmet title={`${OrganisationsStore.findById(id).name} / reports`} />
		<Header title="Reports" />
		<Container>
			<Table
				columns={[ 'Report', 'Created', 'Last updated', 'Status' ]}
				data={Object.keys(ReportsStore.findByOrgId(id)).map((key) => {
					const report = ReportsStore.findById(id, key, true),
						created = moment(report.created),
						updated = report.updated ? moment(report.updated) : null;
					return [
						<Link to={`/${id}/${key}`}>{ report.name }</Link>,
						moment().diff(created) > 86400000 ? created.format('DD-MM-YYYY') : created.fromNow(),
						updated ? moment().diff(updated) > 86400000 ? updated.format('DD-MM-YYYY') : updated.fromNow() : 'Never',
						null
					];
				})}
				filters={[ 'Status' ]}
			/>
		</Container>
	</Main>
)));

export default Overview;