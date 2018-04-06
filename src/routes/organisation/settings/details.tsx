import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button } from '../../../components/Button';
import { Container } from '../../../components/Container';
import { Form, FormActions } from '../../../components/Form';
import { Header } from '../../../components/Header';
import { TextField } from '../../../components/Input';
import { Link } from '../../../components/Link';

const OrganisationSettingsDetails = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<React.Fragment>
			<Header
				title="Details"
				headTitle={`Details - ${organisation.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
				]}
			/>
			<Container>
				<Form>
					<TextField
						compact
						defaultValue={organisation.name}
						label="Name"
						required
					/>
					<TextField
						compact
						defaultValue={organisation.description}
						label="Description"
						multiple
					/>
					<FormActions>
						<Button type="submit">Save details</Button>
						<Button appearance="link" type="reset">Cancel</Button>
					</FormActions>
				</Form>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationSettingsDetails;
