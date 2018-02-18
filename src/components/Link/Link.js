import React, { Component } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import isFunction from 'lodash/isFunction';

class Link extends Component {
	
	onClick = (event) => {
		const { to, onClick } = this.props;
		if (isFunction(onClick)) onClick(event);
		if (window.swHasUpdated) return window.location.assign(to);
	}

	render = () => <RouterLink {...this.props} onClick={this.onClick} />;
}

class NavLink extends Component {
	
	onClick = (event) => {
		const { to, onClick } = this.props;
		if (isFunction(onClick)) onClick(event);
		if (window.swHasUpdated) return window.location.assign(to);
	}

	render = () => <RouterNavLink {...this.props} onClick={this.onClick} />;
}

export {
	Link,
	NavLink
};