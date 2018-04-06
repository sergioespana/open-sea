import linkstate from 'linkstate';
import { trim } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { AuthForm, AuthFormFooter, AuthFormHeader, AuthFormWrapper } from '../../components/AuthForm/index';
import { Button } from '../../components/Button/index';
import { TextField } from '../../components/Input/index';
import { Link } from '../../components/Link/index';

const initialState = {
	email: ''
};

type State = Readonly<typeof initialState>;

@inject(app('state'))
@observer
export default class AccountResetPassword extends Component<any, State> {
	readonly state: State = initialState;

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
