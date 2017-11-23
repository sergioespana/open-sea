import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import Button from 'material-styled-components/Button';
import linkState from 'linkstate';
import Main from 'components/Main';

// TODO: Show indeterminate horizontal loader when logging in

@inject('AuthStore') @observer class Login extends Component {
	state = {
		email: '',
		password: ''
	}

	handleFormSubmit = (event) => {
		event.preventDefault();
		
		const { AuthStore } = this.props,
			{ email, password } = this.state;
		
		AuthStore.signInWithEmailAndPassword(email, password);
	}

	render() {
		const { email, password } = this.state,
			{ AuthStore, location } = this.props,
			from = location.state ? location.state.from : undefined;

		return AuthStore.authed ? (
			<Redirect to={from || '/'} />
		) : (
			<Main container slim style={{ textAlign: 'center' }}>
				<h1>Sign in to your account</h1>
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
					<Button type="submit" primary raised disabled={AuthStore.busy}>Sign in</Button>
				</form>
				<br />
				<br />
				<p>--- Or ---</p>
				<br />
				<br />
				<Button raised onClick={AuthStore.signInWithGoogle} disabled={AuthStore.busy}>Sign in with Google</Button>
				<br />
				<br />
				<p>Don't have an account yet? <Link to="/signup">Sign up</Link></p>
			</Main>
		);
	}
}

export default Login;