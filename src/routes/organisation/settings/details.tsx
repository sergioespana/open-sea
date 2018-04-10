import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button } from '../../../components/Button';
import Container from '../../../components/Container';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import Input, { TextArea } from '../../../components/NewInput';
import { Section } from '../../../components/Section';

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
				<Section>
					<Form>
						<Input
							appearance="default"
							defaultValue={organisation.name}
							help="Updating an organisation's name has no effect on the organisation's ID."
							isCompact
							label="Name"
							required
						/>
						<TextArea
							appearance="default"
							defaultValue={organisation.description}
							isCompact
							label="Description"
						/>
						<Input
							appearance="default"
							defaultChecked={organisation.isPublic}
							help="Public organisations and their reports are visible to anyone. Explicitly granted access is still required for certain operations."
							isCompact
							label="Public"
							placeholder="This is a public organisation"
							type="checkbox"
						/>
						<FormActions>
							<Button appearance="default" type="submit">Save details</Button>
							<Button appearance="link" type="reset">Cancel</Button>
						</FormActions>
					</Form>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default OrganisationSettingsDetails;
