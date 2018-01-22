import Form, { Input } from 'components/Form';
import Button from 'components/Button';
import React from 'react';

const OrganisationSettingsAccess = () => (
	<Form>
		<section>
			<h1>User and group access</h1>
			<Input
				type="email"
				placeholder="Email address"
			/>
			<Input
				type="select"
				placeholder="Role"
				options={[
					{ text: 'Owner', value: 'owner' }
				]}
			/>
			<Button type="submit">Add</Button>
		</section>
	</Form>
);

export default OrganisationSettingsAccess;