import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';

@inject(app('AuthStore'))
@observer
class AccountLogout extends Component {

	componentDidMount() {
		const { AuthStore, state } = this.props;
		const { authed } = state;
		return authed && AuthStore.signOut();
	}

	render = () => null;
}

export default AccountLogout;