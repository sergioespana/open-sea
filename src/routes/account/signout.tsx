import { app } from 'mobx-app';
import { inject } from 'mobx-react';
import { Component } from 'react';

@inject(app('AuthStore'))
class AccountSignout extends Component<any, any> {

	componentDidMount () {
		return this.props.AuthStore.signOut();
	}

	render () { return null; }
}

export default AccountSignout;
