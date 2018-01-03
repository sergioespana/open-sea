import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import { Redirect } from 'react-router-dom';

@inject(app('AuthStore'))
@observer
class Logout extends Component {
	componentDidMount = () => this.props.state.authed && this.props.AuthStore.signOut();
	render = () => this.props.state.authed ? null : <Redirect to="/account/signin" />;
}

export default Logout;