import { h, Component } from 'preact';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer class Logout extends Component {
	componentDidMount() {
		let { AuthStore } = this.context.mobxStores;
		return AuthStore.signOut();
	}
	
	render() {
		let { AuthStore } = this.context.mobxStores;
		return AuthStore.isAuthed ? (
			<h1>Logging out...</h1>
		) : <Redirect to="/account/login" />;
	}
}

export default Logout;