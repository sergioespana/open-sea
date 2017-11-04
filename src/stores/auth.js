import { observable, computed } from 'mobx';
import appStore from './app';
import fbStore from './firebase';
import orgStore from './orgs';
import snackStore from './snack';

class AuthStore {

	auth = fbStore.auth;
	providers = fbStore.providers;
	user = observable.map({});
	
	@computed get isAuthed() { return this.user.size > 0; }

	constructor() {
		this.auth.onAuthStateChanged(this._handleAuthStateChanged);
	}

	_handleAuthStateChanged = (user) => {
		if (!user) {
			this.user.clear();
			appStore.isLoading = false;
			return;
		}

		let { uid, email, emailVerified } = user;

		if (this.user.size === 0) {
			orgStore.initialise(uid);
		}

		this.user.set('uid', uid);
		this.user.set('email', email);
		this._storeLogin(uid, email);

		if (!emailVerified) snackStore.show('Please verify your e-mail address to confirm your account');
	}

	_storeLogin = (uid, email) => fbStore.setDoc(`users/${uid}`, { lastLogin: new Date(), email });

	signIn = (arg) => {
		if (typeof arg === 'string') {
			if (arg === 'google') return this.auth.signInWithPopup(this.providers.google);
			return Promise.reject();
		}
		
		if (typeof arg === 'object') {
			let { email, pass } = arg;
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
			return this.auth.createUserWithEmailAndPassword(arg.email, arg.pass);
		}
		
		return Promise.reject();
	}
	
	signOut = () => {
		fbStore.removeListener();
		orgStore.organisations.clear();
		return this.auth.signOut();
	}
}

const authStore = new AuthStore();
export default authStore;