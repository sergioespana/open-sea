import { h } from 'preact';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }, { services: { AuthService } }) => (
	// eslint-disable-next-line react/jsx-no-bind
	<Route {...rest} render={(props) => (
		AuthService.isAuthed() ? (
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
