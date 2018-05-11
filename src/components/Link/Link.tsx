import { isFunction } from 'lodash';
import React, { MouseEvent, SFC } from 'react';
import { Link as RouterLink, LinkProps, NavLink as RouterNavLink } from 'react-router-dom';

export const Link: SFC<LinkProps> = (props) => <RouterLink {...props} onClick={onClick(props, window)} />;

export const NavLink: SFC<LinkProps> = (props) => <RouterNavLink {...props} onClick={onClick(props, window)} />;

export const onClick = (props: LinkProps, window: any) => (event: MouseEvent<HTMLAnchorElement>) => {
	const { to, onClick } = props;
	if (window.shouldRefresh) {
		// Reload the page if we need to do a refresh.
		// Prevent default event so we don't flash the new page before reloading.
		event && event.preventDefault();
		return window.location.assign(to);
	}
	// If a reload isn't necessary, call the user-defined onClick handler if it's there.
	if (isFunction(onClick)) onClick(event);
};
