import { h, Component } from 'preact';
import Container from '../components/Container';

export default class Home extends Component {
	render() {
		return (
			<div id="main">
				<Container>
					<h1>Home</h1>
					<p>This is the Home component.</p>
				</Container>
			</div>
		);
	}
}
