import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import { Link } from 'react-router-dom';
import React from 'react';

const Details = inject(app('OrganisationsStore'))(observer(({ OrganisationsStore, match: { params: { id } } }) => {
	const organisation = OrganisationsStore.findById(id);	
	return (
		<Container>
			<h1>Organisation details</h1>
			<Input
				label="Avatar"
				type="image"
				src={organisation.avatar || 'https://via.placeholder.com/96x96/00695C'}
			/>
			<Input
				label="Organisation name"
				help={<span>Changes to the organisation name will not be reflected in its ID. If you need the ID to change, <Link to="/create/organisation">create a new organisation</Link> instead.</span>}
				value={organisation.name}
			/>
			<Button style={{ marginTop: 20 }}>Update</Button>
		</Container>
	);
}));

export default Details;