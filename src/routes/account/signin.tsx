import linkstate from 'linkstate';
import { trim } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthForm, { AuthButton, AuthFormAlert, AuthFormFooter, AuthFormHeader, AuthFormWrapper } from '../../components/AuthForm';
import { Button } from '../../components/Button';
import { Input } from '../../components/NewInput';

const initialState = {
	email: '',
	error: null,
	pass: ''
};

type State = Readonly<typeof initialState>;

@inject(app('AuthStore'))
@observer
export default class AccountSignin extends Component<any, State> {
	readonly state: State = initialState;

	render () {
		const { state } = this.props;
		const { isBusy } = state;
		const { email, error, pass } = this.state;

		return (
			<AuthFormWrapper>
				<AuthFormHeader>
					<h1>openSEA</h1>
					<h2>Log in to your account</h2>
				</AuthFormHeader>
				<AuthForm onSubmit={this.onSubmit}>
					<AuthButton type="button"><img src="/assets/images/google.svg" /><span>Log in with Google</span></AuthButton>
					<p style={{ textAlign: 'center' }}>OR</p>
					{error && <AuthFormAlert>{error.message}</AuthFormAlert>}
					<Input
						appearance="default"
						autoFocus
						disabled={isBusy}
						onChange={linkstate(this, 'email')}
						placeholder="Enter email"
						required
						type="email"
						value={email}
					/>
					<Input
						appearance="default"
						disabled={isBusy}
						onChange={linkstate(this, 'pass')}
						placeholder="Enter password"
						required
						type="password"
						value={pass}
					/>
					<Button
						appearance="default"
						disabled={!trim(email) || !trim(pass) || isBusy}
						type="submit"
					>
						Log in
					</Button>
				</AuthForm>
				<AuthFormFooter>
					<Link to="/account/signup">Sign up for an account</Link>
					<Link to="/account/reset-password">Can't login?</Link>
				</AuthFormFooter>
			</AuthFormWrapper>
		);
	}

	private onSubmit = async (event) => {
		event.preventDefault();

		const { props, state } = this;
		const { AuthStore } = props;
		const { email, pass } = state;

		this.setState({ error: null });
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		try {
			await AuthStore.signIn(email, pass);
		} catch (error) {
			this.setState({ error });
		} finally {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
		}
	}
}
