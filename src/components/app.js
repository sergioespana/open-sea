import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './Header';
import Home from '../routes';

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Header />
				<Router>
					<Home path="/" />
				</Router>
			</div>
		);
	}
}
