import linkstate from 'linkstate';
import { trim } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import AuthForm, { AuthButton, AuthFormAlert, AuthFormFooter, AuthFormHeader, AuthFormWrapper } from '../../components/AuthForm';
import { Button } from '../../components/Button';
import { PasswordField } from '../../components/Input';
import { Link } from '../../components/Link';
import { Input } from '../../components/NewInput';
import { setAppState } from '../../stores/helpers';

const initialState = {
	email: '',
	error: null,
	name: '',
	pass: ''
};

type State = Readonly<typeof initialState>;

@inject(app('AuthStore'))
@observer
export default class AccountSignout extends Component<any, State> {
	readonly state: State = initialState;

	render () {
		const { state } = this.props;
		const { isBusy } = state;
		const { email, error, name, pass } = this.state;

		return (
			<AuthFormWrapper>
				<AuthFormHeader>
					<h1>openSEA</h1>
					<h2>Create your account</h2>
				</AuthFormHeader>
				<AuthForm onSubmit={this.onSubmit}>
					<AuthButton type="button"><img src="/assets/images/google.svg" /><span>Sign up with Google</span></AuthButton>
					<p style={{ textAlign: 'center' }}>OR</p>
					{error && <AuthFormAlert>{error.message}</AuthFormAlert>}
					<Input
						appearance="default"
						autoFocus
						onChange={linkstate(this, 'name')}
						placeholder="Enter full name"
						type="text"
						value={name}
					/>
					<Input
						appearance="default"
						onChange={linkstate(this, 'email')}
						placeholder="Enter email"
						type="email"
						value={email}
					/>
					<PasswordField
						appearance="default"
						onChange={linkstate(this, 'pass')}
						placeholder="Create password"
						type="password"
						value={pass}
					/>
					<p>
						By signing up, you agree to the <a>Terms of Use</a> and <a>Privacy Policy</a>.
					</p>
					<Button
						appearance="default"
						disabled={!trim(email) || !trim(name) || !trim(pass) || isBusy}
						type="submit"
					>
						Sign up
					</Button>
				</AuthForm>
				<AuthFormFooter>
					<Link to="/account/signin">Already have an openSEA account? Log in</Link>
				</AuthFormFooter>
			</AuthFormWrapper>
		);
	}

	private onSubmit = async (event) => {
		event.preventDefault();

		const { props, state } = this;
		const { AuthStore } = props;
		const { email, name, pass } = state;

		this.setState({ error: null });
		props.state.isBusy = true; // FIXME: Use setAppState for this when it works
		try {
			await AuthStore.signUp(email, pass, { name });
		} catch (error) {
			this.setState({ error });
		} finally {
			props.state.isBusy = false; // FIXME: Use setAppState for this when it works
		}
	}
}
