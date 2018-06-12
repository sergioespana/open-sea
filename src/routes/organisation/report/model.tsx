import { get } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect } from 'react-router';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';

const OrganisationReportModel = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.findById(orgId);
	const parentNetwork = OrganisationsStore.findParentNetworkById(orgId);
	const report = collection(organisation._reports).findById(`${orgId}/${repId}`);

	if (parentNetwork) return <Redirect to={`/${parentNetwork._id}/settings/model`} />;

	const model = get(parentNetwork ? parentNetwork : report, 'model');
	const PageHead = (
		<Header
			title="Model"
			headTitle={`${organisation.name} / ${report.name} / Model`}
			breadcrumbs={[
				<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
				<Link key={`/${orgId}/reports`} to={`/${orgId}/reports`}>Reports</Link>,
				<Link key={`/${orgId}/${repId}`} to={`/${orgId}/${repId}`}>{report.name}</Link>
			]}
		/>
	);

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<p style={{ marginTop: 0 }}>
						This report already has a model. In a later version, you will be able to<br />
						visualise and change the model right here on this page.
					</p>
					<p>
						<Button appearance="default">Get YAML file</Button>
					</p>
					<h3>Current model</h3>
					<pre>{JSON.stringify(model, null, 2)}</pre>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationReportModel;
