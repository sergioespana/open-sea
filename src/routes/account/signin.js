import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import AuthForm from 'components/AuthForm';
import Button from 'components/Button';
import Error from '@atlaskit/icon/glyph/error';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import { TextField } from 'components/Input';
import trim from 'lodash/trim';
import upperFirst from 'lodash/upperFirst';

const isBlank = (str) => !trim(str);

@inject(app('AuthStore', 'VisualStore'))
@observer
class AccountSignIn extends Component {
	state = {
		email: '',
		alert: {},
		password: ''
	}

	onSubmit = async (event) => {
		const { email, password } = this.state;
		const { AuthStore, VisualStore } = this.props;

		event.preventDefault();
		this.setState({ alert: {} });
		VisualStore.setBusy(true);
		const { code } = await AuthStore.signIn(email, password);
		VisualStore.setBusy(false);
		
		if (!code) return;
		return this.handleError(code);
	}

	handleError = (code) => this.props.VisualStore.showFlag({
		title: upperFirst(code.split('/')[1].split('-').join(' ')),
		description: this.getMessage(code),
		appearance: 'error',
		icon: <Error />,
		actions: [
			{ content: 'Understood', onClick: () => {} } // TODO: Hide flag from this handler.
		]
	});

	getMessage = (code) => {
		switch (code) {
			case 'auth/invalid-email': return 'The provided email address is invalid.';
			case 'auth/user-disabled': return 'Your account is currently disabled.';
			case 'auth/user-not-found': return 'No account exists for this email address.';
			case 'auth/wrong-password': return 'The provided password is incorrect for this account.';
			default: return 'An unknown error has occurred.';
		}
	}

	render = () => {
		const { email, password } = this.state;
		const { state } = this.props;
		const { busy } = state;
		const shouldPreventSubmit = isBlank(email) || isBlank(password) || busy;

		return (
			<AuthForm onSubmit={this.onSubmit}>
				<header>
					<h1>openSEA</h1>
					<h1>Log in to your account</h1>
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
							fullWidth
						/>
						<TextField
							type="password"
							autoComplete="current-password"
							value={password}
							placeholder="Enter password"
							required
							onChange={linkState(this, 'password')}
							disabled={busy}
							fullWidth
						/>
						<Button
							appearance="primary"
							type="submit"
							disabled={shouldPreventSubmit}
							busy={busy}
						>Log in</Button>
					</div>
					<div>
						<Link to="/account/reset-password">Can't login?</Link>
					</div>
				</section>
				<footer>
					<Link to="/account/signup">Sign up for an account</Link>
				</footer>
			</AuthForm>
		);
	}
}

export default AccountSignIn;