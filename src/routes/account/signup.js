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
class Signup extends Component {
	state = {
		email: '',
		error: '',
		name: '',
		password: ''
	}

	onSubmit = async (event) => {
		event.preventDefault();
		const { AuthStore, MVCStore } = this.props;
		const { name, email, password } = this.state;
		MVCStore.setBusy(true);
		const { code, message } = await AuthStore.createUser(email, password, { name });
		MVCStore.setBusy(false);
		
		if (!message) return;
		switch (code) {
			case 'auth/email-already-in-use': return this.setState({ error: <span>The provided email address is already in use by another account. If this is your email address, <Link to="/account/signin">sign in</Link> instead.</span> });
			case 'auth/invalid-email': return this.setState({ error: 'The provided email address is invalid.' });
			case 'auth/weak-password': return this.setState({ error: 'The provided password is insufficiently strong.' });
			default: return this.setState({ error: 'An unknown error has occurred.' });
		}
	}

	render() {
		const { email, error, name, password } = this.state;
		const { location, state } = this.props;
		const { authed, busy } = state;
		const from = get(location, 'state.from');
		const disabled = busy || email === '' || name === '' || password === '';

		return authed ? (
			<Redirect to={from || '/'} />
		) : (
			<Main>
				<StandaloneForm
					title="Welcome to openSEA"
					onSubmit={this.onSubmit}
				>
					<Input
						label="Full name"
						value={name}
						onChange={linkState(this, 'name')}
						disabled={busy}
						required
					/>
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
						>Sign up</Button>
						<Link to="/account/signin">Already have an account?</Link>
					</FormButtonsContainer>
				</StandaloneForm>
			</Main>
		);
	}
}

export default Signup;