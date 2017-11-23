import { computed, observable, toJS } from 'mobx';
import FirebaseStore from './FirebaseStore';
import OrganisationsStore from './OrganisationsStore';
import ReportsStore from './ReportsStore';
import SnackbarStore from './SnackbarStore';

class AuthStore {
	auth = FirebaseStore.auth;
	providers = FirebaseStore.providers;

	@observable loading = true;
	@observable busy = false;
	users = observable.map({});

	@computed get authed() { return this.users.get('current').size > 0; }

	constructor() {
		this.users.set('current', observable.map({}));
		this.auth.onAuthStateChanged(this._handleAuthStateChanged);
	}

	findById = (id, toObj = false) => {
		let col = id ? this.users.get(id) : this.users;
		if (toObj) return toJS(col);
		return col;
	}

	signInWithGoogle = async () => {
		this.busy = true;
		try {
			await this.auth.signInWithPopup(this.providers.google);
		}
		catch (error) {
			SnackbarStore.show('Something went wrong logging you in');
			this.busy = false;
		}
	}

	signInWithEmailAndPassword = async (email, password) => {
		this.busy = true;
		try {
			await this.auth.signInWithEmailAndPassword(email, password);
		}
		catch (error) {
			if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
				SnackbarStore.show('Email address and password do not match');
			}
			else SnackbarStore.show('Something went wrong logging you in');
			this.busy = false;
		}
	}

	signUpWithGoogle = this.signInWithGoogle;

	createUserWithEmailAndPassword = async (email, password) => {
		this.busy = true;
		try {
			await this.auth.createUserWithEmailAndPassword(email, password);
		}
		catch (error) {
			SnackbarStore.show('Something went wrong creating your account');
			this.busy = false;
		}
	}

	logout = () => {
		FirebaseStore.removeListener();
		OrganisationsStore.reset();
		ReportsStore.reset();
		this._reset();
		this.auth.signOut();
	}
	
	_reset = () => {
		this.users.clear();
		this.users.set('current', observable.map({}));
	}

	_handleAuthStateChanged = (user) => {
		if (!user) {
			this.users.get('current').clear();
			this.loading = false;
			this.busy = false;
			return;
		}

		const { uid, email, emailVerified, photoURL: avatar } = user;

		if (!this.authed) OrganisationsStore.init(uid);

		FirebaseStore.setDoc(`users/${uid}`, { lastLogin: new Date(), email, emailVerified, avatar });
		FirebaseStore.addListener(`users/${uid}`, this._onUserData);
	}

	_onUserData = (doc) => {
		const uid = doc.id;

		if (!doc.exists) {
			FirebaseStore.setDoc(`users/${uid}`, { created: new Date() });
			return;
		}
		
		const data = doc.data(),
			user = { uid, ...data };
		
		this.users.get('current').merge(user);
		this.loading = false;
		this.busy = false;
	}
}

export default new AuthStore();