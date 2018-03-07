import { inject, observer } from 'mobx-react';
import { PasswordField, TextField } from 'components/Input';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import AuthForm from 'components/AuthForm';
import Button from 'components/Button';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import trim from 'lodash/trim';

const isBlank = (str) => !trim(str);

@inject(app('AuthStore', 'VisualStore'))
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
		const { AuthStore, VisualStore } = this.props;

		event.preventDefault();
		this.setState({ error: null });
		VisualStore.setBusy(true);
		const { code } = await AuthStore.create(email, password, { avatar, name });
		VisualStore.setBusy(false);
		if (!code) return;

		switch (code) {
			case 'auth/email-already-in-use': return this.setState({ error: <span>The provided email address is already in use. You can log in <Link to="/account/signin">here</Link></span> });
			case 'auth/invalid-email': return this.setState({ error: 'The provided email address is invalid.' });
			case 'auth/weak-password': return this.setState({ error: 'The provided password is not strong enough.' });
			default: return this.setState({ error: 'An unknown error has occurred.' });
		}
	}

	render = () => {
		const { email, name, password } = this.state;
		const { state } = this.props;
		const { busy } = state;
		const shouldPreventSubmit = isBlank(name) || isBlank(email) || isBlank(password) || busy;

		return (
			<AuthForm onSubmit={this.onSubmit}>
				<header>
					<h1>openSEA</h1>
					<h1>Create your account</h1>
				</header>
				<section>
					<div>
						<TextField
							type="email"
							autoComplete="email"
							value={email}
							placeholder="Enter email"
							required
							onChange={linkState(this, 'email')}
							disabled={busy}
						/>
						<TextField
							type="text"
							autoComplete="name"
							value={name}
							placeholder="Enter full name"
							required
							onChange={linkState(this, 'name')}
							disabled={busy}
						/>
						<PasswordField
							type="password"
							autoComplete="current-password"
							value={password}
							placeholder="Create password"
							required
							onChange={linkState(this, 'password')}
							disabled={busy}
						/>
						<p>By signing up, you agree to the <a>Terms of Use</a> and <a>Privacy Policy</a>.</p>
						<Button
							appearance="primary"
							type="submit"
							disabled={shouldPreventSubmit}
							busy={busy}
						>Sign up</Button>
					</div>
				</section>
				<footer>
					<Link to="/account/signin">Already have an openSEA account? Log in</Link>
				</footer>
			</AuthForm>
		);
	}
}

export default AccountSignUp;