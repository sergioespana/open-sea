import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button } from '../../../components/Button';
import Container from '../../../components/Container';
import Form, { FormActions } from '../../../components/Form';
import Header from '../../../components/Header';
import { TextField } from '../../../components/Input';
import { Link } from '../../../components/Link';

const NetworkSettingsDetails = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { netId } }, OrganisationsStore } = props;
	const network = OrganisationsStore.getItem(netId, '_id');

	return (
		<React.Fragment>
			<Header
				title="Details"
				headTitle={`Details - ${network.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
					<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
				]}
			/>
			<Container>
				<Form>
					<TextField
						compact
						defaultValue={network.name}
						label="Name"
						required
					/>
					<TextField
						compact
						defaultValue={network.description}
						label="Description"
						multiple
					/>
					<FormActions>
						<Button appearance="default" type="submit">Save details</Button>
						<Button appearance="link" type="reset">Cancel</Button>
					</FormActions>
				</Form>
			</Container>
		</React.Fragment>
	);
}));

export default NetworkSettingsDetails;
