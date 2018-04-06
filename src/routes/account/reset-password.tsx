import linkstate from 'linkstate';
import { trim } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import AuthForm, { AuthFormFooter, AuthFormHeader, AuthFormWrapper } from '../../components/AuthForm';
import { Button } from '../../components/Button';
import { TextField } from '../../components/Input';
import { Link } from '../../components/Link';

interface State {
	email: string;
}

@inject(app('state'))
@observer
export default class AccountResetPassword extends Component<any, State> {
	readonly state: State = {
		email: ''
	};

	render () {
		const { state } = this.props;
		const { isBusy } = state;
		const { email } = this.state;

		return (
			<AuthFormWrapper>
				<AuthFormHeader>
					<h1>openSEA</h1>
					<h2>Unable to login?</h2>
				</AuthFormHeader>
				<AuthForm onSubmit={this.onSubmit}>
					<TextField
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

	private onSubmit = (event) => event.preventDefault();
}
