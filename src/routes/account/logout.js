import { h, Component } from 'preact';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer class Logout extends Component {
	componentDidMount() {
		let { store } = this.context.mobxStores;
		return store.signOut();
	}
	
	render() {
		let { store } = this.context.mobxStores;
		return store.isAuthed ? (
			<h1>Logging out...</h1>
		) : <Redirect to="/account/login" />;
	}
}

export default Logout;