import { h, Component } from 'preact';

export default class Login extends Component {
	state = {
		email: '',
		pass: '',
		error: null
	}

	signInWithEmailAndPassword = (e) => {
		e.preventDefault();
		let { email, pass, error } = this.state,
			{ AuthService } = this.context.services;

		if (error) this.setState({ error: null });
		
		return AuthService.signInWithEmailAndPassword(email, pass)
			.catch((error) => this.setState({ error }));
	}
	
	signInWithGoogle = (event) => {
		let { error } = this.state,
			{ AuthService } = this.context.services;

		if (error) this.setState({ error: null });

		return AuthService.signInWithGoogle()
			.catch((error) => this.setState({ error }));
	}

	render = (props, { email, pass, error }) => (
		<div id="main">
			<h1>Login</h1>
			{ error && <p>{ error.message }</p> }
			<form onSubmit={this.signInWithEmailAndPassword}>
				<input type="email" placeholder="Email" value={email} onInput={this.linkState('email', 'target.value')} /><br />
				<input type="password" placeholder="Password" value={pass} onInput={this.linkState('pass', 'target.value')} /><br />
				<br />
				<button type="submit">Login</button>
			</form>
			<br />
			<br />
			<button onClick={this.signInWithGoogle}>Log in with Google</button>
		</div>
	);
}