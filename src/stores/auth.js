import { observable, computed } from 'mobx';
import isEmpty from 'lodash/isEmpty';
import appStore from './app';
import fbStore from './firebase';
import orgStore from './orgs';

class AuthStore {

	auth = fbStore.auth;
	providers = fbStore.providers;
	user = observable.map({});
	
	@computed get isAuthed() { return this.user.size > 0; }

	constructor() {
		this.auth.onAuthStateChanged(this._handleAuthStateChanged);
	}

	_handleAuthStateChanged = (user) => {
		if (!user) return this.user.clear();

		let { uid } = user;

		if (this.user.size === 0) {
			orgStore.initialise(uid);
		}

		this.user.set('uid', uid);
	}

	signIn = (arg) => {
		if (typeof arg === 'string') {
			if (arg === 'google') return this.auth.signInWithPopup(this.providers.google);
			return Promise.reject();
		}
		
		if (typeof arg === 'object') {
			let { email, pass } = arg;
			if (!email || !pass) return Promise.reject();
			return this.auth.signInWithEmailAndPassword(arg.email, arg.pass);
		}
		
		return Promise.reject();
	}
	
	signUp = (arg) => {
		if (typeof arg === 'string') {
			if (arg === 'google') return this.signIn('google');
			return Promise.reject();
		}
		
		if (typeof arg === 'object') {
			let { email, pass } = arg;
			if (!email || !pass) return Promise.reject();
			return this.auth.createUserWithEmailAndPassword(arg.email, arg.pass);
		}
		
		return Promise.reject();
	}
	
	signOut = () => {
		fbStore.removeListener();
		orgStore.organisations.clear();
		return auth.signOut();
	}
}

const authStore = new AuthStore();
export default authStore;