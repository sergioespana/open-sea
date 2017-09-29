import { h, Component } from 'preact';
import { injector } from 'react-services-injector';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Components
import Header from './Header';
import Drawer from './Drawer';
import Observer from './Observer';

// Private routes
import Home from '../routes';

class App extends Component {
	state = {
		appHasScrolled: false,
		drawerIsOpen: false
	}

	onAppScroll = (changes) => this.setState({ appHasScrolled: changes[0].isIntersecting });

	toggleDrawer = () => this.setState({ drawerIsOpen: !this.state.drawerIsOpen });

	componentWillMount() {
		const { AuthService } = this.services;

		if (AuthService.isAuthed) return;

		AuthService.parseHash()
			.then((result) => {
				if (result === false) return AuthService.login();
				return this.forceUpdate();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	render(props, { appHasScrolled, drawerIsOpen }) {
		const { AuthService } = this.services;

		if (this._component) {
			this._component.history.replace('/');
		}

		return AuthService.isAuthed ? (
			<Router>
				<div id="app">
					<Header hasScrolled={appHasScrolled} toggleDrawer={this.toggleDrawer} />
					<Drawer isOpen={drawerIsOpen} toggleDrawer={this.toggleDrawer} />

					<Route path="/" exact component={Home} />

					<Observer cb={this.onAppScroll} />
				</div>
			</Router>
		) : null;
	}
}

export default injector.connect(App);
