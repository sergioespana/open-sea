import { inject, observer } from 'mobx-react';
import React, { createElement } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { app } from 'mobx-app';
import isNull from 'lodash/isNull';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

const CustomRoute = inject(app('state'))(observer((props) => {
	const { authedOnly, component, path, state, unauthedOnly } = props;
	const { authed } = state;

	if (isNull(component) || isUndefined(component) || !isString(path)) return null;
	if (authedOnly && !authed) return <Redirect to="/account/signin" replace />;
	if (unauthedOnly && authed) return <Redirect to="/" replace />;

	// eslint-disable-next-line react/jsx-no-bind
	return <Route path={path} render={({ ...routerProps }) => createElement(component, { ...props, ...routerProps })} />;
}));

export default CustomRoute;