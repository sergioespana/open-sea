import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './Header';
import Drawer from './Drawer';
import Observer from './Observer';

import Home from '../routes';

export default class App extends Component {
	state = {
		appHasScrolled: false,
		drawerIsOpen: false
	}

	onAppScroll = (changes) => this.setState({ appHasScrolled: changes[0].isIntersecting });

	toggleDrawer = () => this.setState({ drawerIsOpen: !this.state.drawerIsOpen });

	render(props, { appHasScrolled, drawerIsOpen }) {
		return (
			<div id="app">
				<Header hasScrolled={appHasScrolled} toggleDrawer={this.toggleDrawer} />
				<Drawer isOpen={drawerIsOpen} toggleDrawer={this.toggleDrawer} />
				<Router>
					<Home path="/" />
				</Router>
				<Observer cb={this.onAppScroll} />
			</div>
		);
	}
}
