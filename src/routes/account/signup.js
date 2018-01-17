import Form, { Alert, Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import { Link } from 'react-router-dom';
import linkState from 'linkstate';

@inject(app('AuthStore'))
@observer
class AccountSignUp extends Component {
	state = {
		avatar: '',
		email: '',
		error: '',
		name: '',
		password: ''
	}

	onChangeAvatar = ({ target: { files } }) => this.setState({ avatar: files[0] });

	onSubmit = async (event) => {
		const { avatar, email, name, password } = this.state;
		const { AuthStore } = this.props;

		event.preventDefault();
		this.setState({ error: null });
		const { code } = await AuthStore.create(email, password, { avatar, name });
		if (!code) return;

		switch (code) {
			case 'auth/email-already-in-use': return this.setState({ error: <span>The provided email address is already in use. You can log in <Link to="/account/signin">here</Link></span> });
			case 'auth/invalid-email': return this.setState({ error: 'The provided email address is invalid.' });
			case 'auth/weak-password': return this.setState({ error: 'The provided password is not strong enough.' });
			default: return this.setState({ error: 'An unknown error has occurred.' });
		}
	}

	render = () => {
		const { avatar, email, error, name, password } = this.state;

		return (
			<Form standalone onSubmit={this.onSubmit}>
				<header>
					<h1>Welcome to openSEA</h1>
				</header>
				<section>
					<Alert message={error} type="error" />
					<Input
						value={name}
						label="Full name"
						required
						onChange={linkState(this, 'name')}
					/>
					<Input
						type="email"
						value={email}
						label="Email"
						required
						onChange={linkState(this, 'email')}
					/>
					<Input
						type="password"
						value={password}
						label="Password"
						required
						onChange={linkState(this, 'password')}
					/>
					<Input
						type="image"
						value={avatar}
						label="Avatar"
						onChange={this.onChangeAvatar}
					/>
				</section>
				<footer>
					<Button type="submit">Sign up</Button>
					<Link to="/account/signin">Already have an account?</Link>
				</footer>
			</Form>
		);
	}
}

export default AccountSignUp;