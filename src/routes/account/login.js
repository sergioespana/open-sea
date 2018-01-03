import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import StandaloneForm, { FormButtonsContainer } from 'components/StandaloneForm';
import { app } from 'mobx-app';
import Button from 'components/Button';
import get from 'lodash/get';
import Input from 'components/Input';
import linkState from 'linkstate';
import Main from 'components/Main';

@inject(app('AuthStore', 'MVCStore'))
@observer
class Login extends Component {
	state = {
		email: '',
		error: '',
		password: ''
	}

	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({ error: '' });
		
		const { AuthStore, MVCStore } = this.props;
		const { email, password } = this.state;
		MVCStore.setBusy(true);
		const { code } = await AuthStore.signIn(email, password);
		MVCStore.setBusy(false);

		if (!code) return;
		switch (code) {
			case 'auth/invalid-email': return this.setState({ error: 'The provided email address is invalid.' });
			case 'auth/user-disabled': return this.setState({ error: <span>Your account is currently disabled. Please <Link to="/contact">contact support</Link>.</span> });
			case 'auth/user-not-found': return this.setState({ error: <span>No account exists for this email address. You may sign up for an account <Link to="/account/signup">here</Link>.</span> });
			case 'auth/wrong-password': return this.setState({ error: <span>The provided password is incorrect for this account. <Link to="/account/reset-password">Forgot your password?</Link></span> });
			default: return this.setState({ error: 'An unknown error has occurred.' });
		}
	}

	render() {
		const { email, error, password } = this.state;
		const { location, state } = this.props;
		const { authed, busy } = state;
		const from = get(location, 'state.from');
		const disabled = busy || email === '' || password === '';

		return authed ? (
			<Redirect to={from || '/'} />
		) : (
			<Main>
				<StandaloneForm
					title="Welcome back to openSEA"
					onSubmit={this.onSubmit}
				>
					<Input
						type="email"
						label="Email"
						value={email}
						onChange={linkState(this, 'email')}
						disabled={busy}
						required
					/>
					<Input
						type="password"
						label="Password"
						help={error}
						value={password}
						onChange={linkState(this, 'password')}
						disabled={busy}
						required
					/>
					<FormButtonsContainer>
						<Button
							type="submit"
							disabled={disabled}
						>Log in</Button>
						<Link to="/account/signup">Need an account?</Link>
					</FormButtonsContainer>
				</StandaloneForm>
			</Main>
		);
	}
}

export default Login;