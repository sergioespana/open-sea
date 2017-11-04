import { h } from 'preact';
import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }, { mobxStores: { AuthStore } }) => {
	let { isAuthed } = AuthStore;
	return (
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
