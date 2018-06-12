import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Input from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import collection from '../../../stores/collection';

const OrganisationReportSettings = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.findById(orgId);
	const report = collection(organisation._reports).findById(`${orgId}/${repId}`);

	const PageHead = (
		<Header
			title="Settings"
			headTitle={`${organisation.name} / ${report.name} / Settings`}
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
					<h3>Details</h3>
					<p>
						<Form onSubmit={onSubmit}>
							<Input
								appearance="default"
								defaultValue={report.name}
								disabled
								label="Name"
								isCompact
								type="text"
							/>
							<Input
								appearance="default"
								disabled
								label="Public"
								help="This setting is inherited from the organisation's settings. In the future, you will be able to make a report publicly available separately from its organisation."
								isCompact
								placeholder="This is a public report"
								type="checkbox"
								value={organisation.isPublic}
							/>
							<FormActions>
								<Button appearance="default" disabled type="submit">Save changes</Button>
								{/* <Button appearance="link" type="reset">Cancel</Button> */}
							</FormActions>
						</Form>
					</p>
					<h3>Advanced</h3>
					<p>
						<Button appearance="error">Delete this report</Button>
					</p>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

const onSubmit = (event) => event.preventDefault();

export default OrganisationReportSettings;
