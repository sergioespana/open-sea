import { h } from 'preact';
import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }, { mobxStores: { store } }) => {
	let { isAuthed } = store;
	return (
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
};

export default observer(PrivateRoute);
