import Form, { Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import React from 'react';
import { TextField } from 'components/Input';

const OrganisationSettingsDetails = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<section>
			<Form>
				<h1>Organisation details</h1>
				<section>
					<Input
						type="image"
						label="Avatar"
						value={organisation.avatar}
					/>
					<TextField
						label="Name"
						help="Changes the organisation's name will not be reflected in its ID."
						defaultValue={organisation.name}
						compact
					/>
				</section>
				<footer>
					<Button appearance="primary" type="submit">Save changes</Button>
				</footer>
			</Form>
		</section>
	);
}));

export default OrganisationSettingsDetails;