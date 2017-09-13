import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './Header';
import Observer from './Observer';

import Home from '../routes';

export default class App extends Component {
	state = {
		appHasScrolled: false
	}

	onAppScroll = (changes) => this.setState({ appHasScrolled: changes[0].isIntersecting });

	render({ appHasScrolled }) {
		return (
			<div id="app">
				<Header hasScrolled={appHasScrolled} />
				<Router>
					<Home path="/" />
				</Router>
				<Observer cb={this.onAppScroll} />
			</div>
		);
	}
}
