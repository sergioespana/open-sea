import { h, Component } from 'preact';
import { Redirect } from 'react-router-dom';
import Container from '../components/Container';

export default class Login extends Component {
	state = {
		redirectToReferrer: false
	}

	render(props, { redirectToReferrer }) {
		const { from } = props.location.state || { from: { pathname: '/' } };

		if (redirectToReferrer) {
			return (
				<Redirect to={from} />
			);
		}

		return (
			<div id="login">
				<Container>
					<h1>Login</h1>
					<p>This is the Login component.</p>
				</Container>
			</div>
		);
	}
}
