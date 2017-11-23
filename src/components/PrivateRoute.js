import { inject, observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';
import React from 'react';

const PrivateRoute = inject('AuthStore')(observer(({ AuthStore, ...props }) => AuthStore.authed ? (
	<Route {...props} />
) : (
	<Redirect
		to={{
			pathname: '/login',
			state: { from: props.location }
		}}
	/>
)));

export default PrivateRoute;