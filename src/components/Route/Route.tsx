import { isNull, isString, isUndefined } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { createElement, SFC } from 'react';
import { Redirect, Route as ReactRoute, RouteProps as ReactRouteProps } from 'react-router-dom';

interface RouteProps extends ReactRouteProps {
	authedOnly?: boolean;
	unauthedOnly?: boolean;
}

export const Route: SFC<RouteProps> = inject(app('state'))(observer((props) => {
	const { authedOnly, component, path, state, unauthedOnly } = props;
	const { isAuthed } = state;

	if (isNull(component) || isUndefined(component) || !isString(path)) return null;
	if (authedOnly && !isAuthed) return <Redirect to="/account/signin" />;
	if (unauthedOnly && isAuthed) return <Redirect to="/" />;

	return <ReactRoute path={path} render={render(component, props)} />;
}));

const render = (component, props) => ({ ...routerProps }) => createElement(component, { ...props, ...routerProps });
