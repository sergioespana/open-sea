import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import Main from '../components/Main';
import Container from '../components/Container';

export default class Signup extends Component {
	state = {
		email: '',
		pass: '',
		error: null
	}

	createUserWithEmailAndPassword = (e) => {
		e.preventDefault();
		let { store } = this.context.mobxStores,
			{ email, pass, error } = this.state;

		if (error) this.setState({ error: null });
		
		return store.signUp(email, pass)
			.catch((error) => this.setState({ error }));
	}
	
	signUpWithGoogle = (event) => {
		let { store } = this.context.mobxStores,
			{ error } = this.state;

		if (error) this.setState({ error: null });

		return store.signUp('google')
			.catch((error) => this.setState({ error }));
	}
	
	render = (props, { email, pass, error }) => (
		<Main>
			<Container>
				<h1>Signup</h1>
				{ error && <p>{ error.message }</p> }
				<form onSubmit={this.createUserWithEmailAndPassword}>
					<input type="email" placeholder="Email" value={email} onInput={this.linkState('email', 'target.value')} /><br />
					<input type="password" placeholder="Password" value={pass} onInput={this.linkState('pass', 'target.value')} /><br />
					<br />
					<button type="submit">Sign up</button>
				</form>
				<br />
				<br />
				<button onClick={this.signUpWithGoogle}>Sign up with Google</button>
				<br />
				<br />
				<p>Already have an account? <Link to="/login">Log in</Link></p>
			</Container>
		</Main>
	);
}