import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import Main from '../../components/Main';
import Container from '../../components/Container';

export default class Login extends Component {
	state = {
		email: '',
		pass: '',
		error: null
	}

	signInWithEmailAndPassword = (e) => {
		e.preventDefault();
		let { store } = this.context.mobxStores,
			{ email, pass, error } = this.state;

		if (error) this.setState({ error: null });
		
		return store.signIn(email, pass)
			.catch((error) => this.setState({ error }));
	}
	
	signInWithGoogle = (event) => {
		let { store } = this.context.mobxStores,
			{ error } = this.state;

		if (error) this.setState({ error: null });

		return store.signIn('google')
			.catch((error) => this.setState({ error }));
	}

	render = (props, { email, pass, error }) => (
		<Main>
			<Container>
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
				<br />
				<br />
				<p>No account yet? <Link to="/account/create">Sign up</Link></p>
			</Container>
		</Main>
	);
}