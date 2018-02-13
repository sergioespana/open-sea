import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import AuthForm from 'components/AuthForm';
import Button from 'components/Button';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import { TextField } from 'components/Input';
import trim from 'lodash/trim';

const isBlank = (str) => !trim(str);

@inject(app('AuthStore', 'VisualStore'))
@observer
class AccountResetPassword extends Component {
	state = {
		email: '',
		alert: {}
	}

	onSubmit = async (event) => {
		const { email } = this.state;
		const { AuthStore, VisualStore } = this.props;

		this.setState({ alert: {} });
		VisualStore.setBusy(true);
		const { code } = await AuthStore.resetPassword(email);
		VisualStore.setBusy(false);

		if (!code) return this.handleError('auth/reset-sent');
		return this.handleError(code);
	}

	handleError = (code) => {
		switch (code) {
			case 'auth/reset-sent': return this.setState({ alert: { type: 'info', message: 'A password reset link was sent to your email address.' } });
			case 'auth/invalid-email': return this.setState({ alert: { type: 'error', message: 'The provided email address is invalid.' } });
			case 'auth/user-disabled': return this.setState({ alert: { type: 'error', message: <span>Your account is currently disabled. Please <Link to="/contact">contact support</Link>.</span> } });
			case 'auth/user-not-found': return this.setState({ alert: { type: 'error', message: <span>No account exists for this email address. You may sign up for an account <Link to="/account/signup">here</Link>.</span> } });
			case 'auth/wrong-password': return this.setState({ alert: { type: 'error', message: <span>The provided password is incorrect for this account. <a onClick={this.resetPassword}>Forgot your password?</a></span> } });
			default: return this.setState({ alert: { type: 'error', message: 'An unknown error has occurred.' } });
		}
	}

	render = () => {
		const { email } = this.state;
		const { state } = this.props;
		const { busy } = state;
		const shouldPreventSubmit = isBlank(email) || busy;

		return (
			<AuthForm onSubmit={this.onSubmit}>
				<header>
					<h1>openSEA</h1>
					<h1>Can't log in?</h1>
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
						<Button
							appearance="primary"
							type="submit"
							disabled={shouldPreventSubmit}
						>Send recovery link</Button>
					</div>
				</section>
				<footer>
					<Link to="/account/signin">Return to log in</Link>
				</footer>
			</AuthForm>
		);
	}
}

export default AccountResetPassword;