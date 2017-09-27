import { h } from 'preact';
import { Route, Redirect } from 'react-router-dom';

// TODO check actual authentication
const isAuthed = false;

const PrivateRoute = ({ component: Component, ...rest }) => (
	// eslint-disable-next-line react/jsx-no-bind
	<Route {...rest} render={(props) => (
		isAuthed ? (
			<Component {...props} />
		) : (
			<Redirect
				to={{
					pathname: '/login',
					state: { from: props.location }
				}}
			/>
		)
	)}
	/>
);

export default PrivateRoute;
