import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import React from 'react';

const Profile = inject(app('AuthStore'))(observer(({ AuthStore }) => {
	const currentUser = AuthStore.findById('current');
	return (
		<Container>
			<h1>Account settings</h1>
			<Input
				label="Avatar"
				type="image"
				src={currentUser.avatar}
			/>
			<Input
				label="Full name"
				value={currentUser.name}
				help="Your name and avatar are visible to other users with access to the same organisations as you."
			/>
			<Button
				style={{ marginTop: 20 }}
				disabled={currentUser.withProvider}
			>Update</Button>
		</Container>
	);
}));

export default Profile;