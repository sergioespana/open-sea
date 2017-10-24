import { h, Component } from 'preact';

export default class Signup extends Component {
	state = {
		email: '',
		pass: '',
		error: null
	}

	createUserWithEmailAndPassword = (e) => {
		e.preventDefault();
		let { email, pass, error } = this.state,
			{ AuthService } = this.context.services;

		if (error) this.setState({ error: null });
		
		return AuthService.createUserWithEmailAndPassword(email, pass)
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
			<h1>Signup</h1>
			{ error && <p>{ error.message }</p> }
			<form onSubmit={this.createUserWithEmailAndPassword}>
				<input type="email" placeholder="Email" value={email} onInput={this.linkState('email', 'target.value')} /><br />
				<input type="password" placeholder="Password" value={pass} onInput={this.linkState('pass', 'target.value')} /><br />
				<br />
				<button type="submit">Signup</button>
			</form>
			<br />
			<br />
			<button onClick={this.signInWithGoogle}>Signup in with Google</button>
		</div>
	);
}