import Form, { Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import React from 'react';

const AccountProfile = inject(app('AuthStore'))(observer((props) => {
	const { state } = props;
	const { authed: currentUser } = state;
	
	return (
		<Form>
			<section>
				<h1>Account settings</h1>
				<Input
					type="image"
					label="Avatar"
					value={currentUser.avatar}
					disabled
				/>
				<Input
					label="Full name"
					value={currentUser.name}
					disabled
				/>
			</section>
			<footer>
				<Button>Update</Button>
			</footer>
		</Form>
	);
}));

export default AccountProfile;