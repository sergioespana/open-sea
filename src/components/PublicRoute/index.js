import { h } from 'preact';
import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }, { mobxStores: { store } }) => {
	let { isAuthed } = store;
	return (
		// eslint-disable-next-line react/jsx-no-bind
		<Route {...rest} render={(props) => (
			isAuthed ? (
				<Redirect to="/" />
			) : (
				<Component {...props} />
			)
		)}
		/>
	);
};

export default observer(PublicRoute);
