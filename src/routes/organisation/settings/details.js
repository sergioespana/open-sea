import Form, { Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import React from 'react';

const OrganisationSettingsDetails = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<Form>
			<section>
				<h1>Organisation details</h1>
				<Input
					type="image"
					label="Avatar"
					value={organisation.avatar}
				/>
				<Input
					label="Name"
					help="Changes the organisation's name will not be reflected in its ID."
					value={organisation.name}
				/>
			</section>
			<footer>
				<Button>Save changes</Button>
			</footer>
		</Form>
	);
}));

export default OrganisationSettingsDetails;