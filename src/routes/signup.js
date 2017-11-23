import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import Button from 'material-styled-components/Button';
import linkState from 'linkstate';
import Main from 'components/Main';

// TODO: Show indeterminate horizontal loader when signing up

@inject('AuthStore') @observer class Signup extends Component {
	state = {
		email: '',
		password: ''
	}

	handleFormSubmit = (event) => {
		event.preventDefault();
		
		const { AuthStore } = this.props,
			{ email, password } = this.state;
		
		AuthStore.createUserWithEmailAndPassword(email, password);
	}

	render() {
		const { email, password } = this.state,
			{ AuthStore } = this.props;

		return AuthStore.authed ? (
			<Redirect to="/" />
		) : (
			<Main container slim style={{ textAlign: 'center' }}>
				<h1>Sign up for a new account</h1>
				<br />
				<form onSubmit={this.handleFormSubmit}>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onInput={linkState(this, 'email')}
						disabled={AuthStore.busy}
						required
					/><br />
					<br />
					<input
						type="password"
						placeholder="Password"
						value={password}
						onInput={linkState(this, 'password')}
						disabled={AuthStore.busy}
						required
					/><br />
					<br />
					<Button type="submit" primary raised disabled={AuthStore.busy}>Sign up</Button>
				</form>
				<br />
				<br />
				<p>--- Or ---</p>
				<br />
				<br />
				<Button raised onClick={AuthStore.signUpWithGoogle} disabled={AuthStore.busy}>Sign up with Google</Button>
				<br />
				<br />
				<p>Already have an account? <Link to="/login">Log in</Link></p>
			</Main>
		);
	}
}

export default Signup;