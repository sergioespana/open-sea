import { inject, observer } from 'mobx-react';
import Button from 'components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import React from 'react';

const Profile = inject('AuthStore')(observer(({ AuthStore }) => (
	<Container>
		<h1>Account settings</h1>
		<Input
			label="Avatar"
			type="image"
			src={AuthStore.findById('current', true).avatar}
		/>
		<Input
			label="Full name"
			value={AuthStore.findById('current', true).name}
		/>
		<Button style={{ marginTop: 20 }}>Update</Button>
	</Container>
)));

export default Profile;