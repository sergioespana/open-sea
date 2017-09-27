import { h, Component } from 'preact';
import { Route } from 'react-router-dom';

import Header from './Header';
import Drawer from './Drawer';
import Observer from './Observer';

import Home from '../routes';

export default class PrivateRoutes extends Component {
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

				<Route path="/" exact component={Home} />

				<Observer cb={this.onAppScroll} />
			</div>
		);
	}
}
