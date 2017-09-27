import { h } from 'preact';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

// Private routes
import PrivateRoutes from './private';

// Public routes
import Login from '../routes/login';
import Signup from '../routes/signup';

const App = () => (
	<Router>
		<Switch>
			<Route path="/login" component={Login} />
			<Route path="/signup" component={Signup} />
			<PrivateRoute path="*" component={PrivateRoutes} />
		</Switch>
	</Router>
);

export default App;
