import { h, Component } from 'preact';
import PropTypes from 'proptypes';
import { injector } from 'react-services-injector';
import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

// Components
import Header from './Header';
import Drawer from './Drawer';
import Observer from './Observer';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Routes
import Signup from '../routes/signup';
import Login from '../routes/login';
import Logout from '../routes/logout';
import Dashboard from '../routes';
import Organisation from '../routes/organisation';

const theme = createMuiTheme();

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

	render = (props, { appHasScrolled, drawerIsOpen }) => {
		let { AuthService } = this.services;
		return AuthService.loading ? (
			<CircularProgress />
		) : (
			<MuiThemeProvider theme={theme}>
				<Router>
					<div id="app">
						<Header hasScrolled={appHasScrolled} toggleDrawer={this.toggleDrawer} />
						<Drawer isOpen={drawerIsOpen} toggleDrawer={this.toggleDrawer} />

						<Switch>
							<PublicRoute path="/signup" component={Signup} />
							<PublicRoute path="/login" component={Login} />

							<Route path="/logout" component={Logout} />

							<PrivateRoute path="/" exact component={Dashboard} />

							<PrivateRoute path="/:org" component={Organisation} />
						</Switch>

						<Observer cb={this.onAppScroll} />
					</div>
				</Router>
			</MuiThemeProvider>
		);
	}
}

App.childContextTypes = {
	services: PropTypes.object
};

export default injector.connect(App);
