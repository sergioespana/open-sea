import { h, Component } from 'preact';
import PropTypes from 'proptypes';
import { injector } from 'react-services-injector';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Components
import Header from './Header';
import Drawer from './Drawer';
import Observer from './Observer';

// Private routes
import Home from '../routes';
import Validator from '../routes/validator';

class App extends Component {
	state = {
		appHasScrolled: false,
		drawerIsOpen: false
	}

	onAppScroll = (changes) => this.setState({ appHasScrolled: changes[0].isIntersecting });

	toggleDrawer = () => this.setState({ drawerIsOpen: !this.state.drawerIsOpen });

	getChildContext() {
		return { services: this.services };
	}

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

	componentWillUpdate() {
		const { AuthService } = this.services;

		if (!AuthService.isAuthed) return AuthService.login();
	}

	render(props, { appHasScrolled, drawerIsOpen }) {
		const { AuthService } = this.services;

		if (this._component && this._component.history.location.hash.includes('access_token')) {
			this._component.history.replace(this._component.history.location.pathname);
		}

		return AuthService.isAuthed ? (
			<Router>
				<div id="app">
					<Header hasScrolled={appHasScrolled} toggleDrawer={this.toggleDrawer} />
					<Drawer isOpen={drawerIsOpen} toggleDrawer={this.toggleDrawer} />

					<Route path="/" exact component={Home} />
					<Route path="/validator" component={Validator} />

					<Observer cb={this.onAppScroll} />
				</div>
			</Router>
		) : null;
	}
}

App.childContextTypes = {
	services: PropTypes.object
};

export default injector.connect(App);
