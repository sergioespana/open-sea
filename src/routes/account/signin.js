import Form, { Alert, Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import { Link } from 'components/Link';
import linkState from 'linkstate';

@inject(app('AuthStore'))
@observer
class AccountSignIn extends Component {
	state = {
		email: '',
		error: null,
		password: ''
	}

	onSubmit = async (event) => {
		const { email, password } = this.state;
		const { AuthStore } = this.props;

		event.preventDefault();
		this.setState({ error: null });
		const { code } = await AuthStore.signIn(email, password);
		if (!code) return;

		switch (code) {
			case 'auth/invalid-email': return this.setState({ error: 'The provided email address is invalid.' });
			case 'auth/user-disabled': return this.setState({ error: <span>Your account is currently disabled. Please <Link to="/contact">contact support</Link>.</span> });
			case 'auth/user-not-found': return this.setState({ error: <span>No account exists for this email address. You may sign up for an account <Link to="/account/signup">here</Link>.</span> });
			case 'auth/wrong-password': return this.setState({ error: <span>The provided password is incorrect for this account. <Link to="/account/reset-password">Forgot your password?</Link></span> });
			default: return this.setState({ error: 'An unknown error has occurred.' });
		}
	}

	render = () => {
		const { email, error, password } = this.state;

		return (
			<Form standalone onSubmit={this.onSubmit}>
				<header>
					<h1>Welcome back to openSEA</h1>
				</header>
				<section>
					<Alert message={error} type="error" />
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
				</section>
				<footer>
					<Button type="submit">Log in</Button>
					<Link to="/account/signup">Need an account?</Link>
				</footer>
			</Form>
		);
	}
}

export default AccountSignIn;