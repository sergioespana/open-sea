import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

@inject('AuthStore') @observer class Logout extends Component {
	componentDidMount = () => this.props.AuthStore.authed && this.props.AuthStore.logout();
	render = () => this.props.AuthStore.authed ? null : <Redirect to="/login" />;
}

export default Logout;