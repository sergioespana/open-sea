import Form, { Input } from 'components/Form';
import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import find from 'lodash/find';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import map from 'lodash/map';

const OrganisationReportData = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const report = find(organisation._reports, { _id: repId }) || {};
	const metrics = get(report, 'model.metrics') || {};

	return (
		<Fragment>
			<Header>
				<Breadcrumbs>
					<Link to={`/${orgId}`}>{ organisation.name }</Link>
					<Link to={`/${orgId}/reports`}>Reports</Link>
					<Link to={`/${orgId}/${repId}`}>{ report.name }</Link>
				</Breadcrumbs>
				<h1>Data</h1>
			</Header>
			<Container>
				<Form>
					<section>
						{ map(metrics, ({ help, name, type }, metId) => (
							<Input
								key={metId}
								type={type}
								label={name}
								help={help}
								value={get(report, `data.${metId}`)}
							/>
						)) }
					</section>
					<footer>
						<Button type="submit">Save data</Button>
						<Link to={`/${orgId}/${repId}`}>Cancel</Link>
					</footer>
				</Form>
			</Container>
		</Fragment>
	);
}));

export default OrganisationReportData;