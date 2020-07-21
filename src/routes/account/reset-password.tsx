import linkstate from 'linkstate';
import { trim } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import AuthForm, { AuthFormAlert, AuthFormFooter, AuthFormHeader, AuthFormWrapper } from '../../components/AuthForm';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import { Input } from '../../components/NewInput';

const initialState = {
	email: '',
	error: null
};

type State = Readonly<typeof initialState>;

@inject(app('AuthStore'))
@observer
export default class AccountResetPassword extends Component<any, State> {
	readonly state: State = initialState;

	render () {
		const { state } = this.props;
		const { isBusy } = state;
		const { email, error } = this.state;

		return (
			<AuthFormWrapper>
				<AuthFormHeader>
					<h1>openESEA</h1>
					<h2>Unable to login?</h2>
				</AuthFormHeader>
				<AuthForm onSubmit={this.onSubmit}>
					{error && <AuthFormAlert>{error.message}</AuthFormAlert>}
					<Input
						appearance="default"
						autoFocus
						onChange={linkstate(this, 'email')}
						placeholder="Enter email"
						type="email"
						value={email}
					/>
					<Button
						appearance="default"
						disabled={!trim(email) || isBusy}
						type="submit"
					>
						Send recovery link
					</Button>
				</AuthForm>
				<AuthFormFooter>
					<Link to="/account/signin">Return to login</Link>
				</AuthFormFooter>
			</AuthFormWrapper>
		);
	}

	private onSubmit = async (event) => {
		event.preventDefault();

		const { props, state } = this;
		const { AuthStore } = props;
		const { email } = state;

		this.setState({ error: null });
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		try {
			await AuthStore.resetPassword(email);
			this.setState({ error: { message: `We've sent you an e-mail with a password reset link.` } });
		} catch (error) {
			this.setState({ error });
		} finally {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
		}
	}
}
