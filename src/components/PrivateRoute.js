import { inject, observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';
import { app } from 'mobx-app';
import React from 'react';

const PrivateRoute = inject(app('state'))(observer(({ state, ...props }) => {
	const { authed } = state;
	return authed ? <Route {...props} /> : (
		<Redirect
			to={{
				pathname: '/account/login',
				state: { from: props.location }
			}}
		/>
	);
}));

export default PrivateRoute;