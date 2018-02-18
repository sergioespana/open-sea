import Button from 'components/Button';
import React from 'react';
import Table from 'components/Table';
import { TextField } from 'components/Input';

const OrganisationSettingsAccess = () => (
	<section>
		<h1>User and group access</h1>
		<Table
			columns={[
				{
					key: 'name',
					label: 'Name',
					value: () => null
				},
				{
					key: 'added',
					label: 'Added',
					value: () => null
				},
				{
					key: 'role',
					label: 'Role',
					value: () => null
				},
				{
					key: 'hidden',
					hidden: true
				}
			]}
			data={[]}
			footer={[
				<TextField placeholder="Find a user" fullWidth colSpan={2} />,
				<TextField placeholder="Role" fullWidth />,
				<Button>Add</Button>
			]}
		/>
	</section>
);

export default OrganisationSettingsAccess;