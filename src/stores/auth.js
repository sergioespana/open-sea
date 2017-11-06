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

		let { uid, email, emailVerified, photoURL, displayName } = user;

		if (this.user.size === 0) {
			orgStore.initialise(uid);
		}

		let currentUser = {
			uid,
			email,
			avatar: photoURL,
			lastLogin: new Date(),
			name: {
				full: displayName,
				first: displayName ? displayName.split(' ')[0] : undefined,
				last: displayName ? displayName.split(' ').slice(1).join(' ').trim() : undefined
			}
		};

		this._set(currentUser);
		this._storeLogin(currentUser);

		if (!emailVerified) snackStore.show('Please verify your e-mail address to confirm your account');
	}

	_storeLogin = ({ uid, ...settings }) => fbStore.setDoc(`users/${uid}`, { ...settings });

	_set = (settings) => {
		let defaults = {};

		let obj = Object.assign({}, defaults, settings);

		Object.keys(obj).forEach((key) => {
			this.user.set(key, obj[key]);
		});
	}

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

	resetPassword = () => {
		let email = this.user.get('email');
		this.auth.sendPasswordResetEmail(email)
			.then(() => snackStore.show(`We've sent a password reset link to ${email}`))
			.catch(() => snackStore.show(`An unexpected error occurred`));
	}

	togglePushNotifications = async (notify) => {
		let currentSetting = this.user.get('notifications') || false;

		if (Notification.permission !== 'granted') {
			snackStore.show('Please grant notification permission', 0);
			let permission = await Notification.requestPermission();
			if (permission === 'denied') return snackStore.show('Permission was denied');
		}

		this.user.set('notifications', !currentSetting);
		if (notify !== false) {
			snackStore.show(`Turned ${currentSetting ? 'off' : 'on'} push notifications`, 4000, () => this.togglePushNotifications(false), 'UNDO');
		}
	}
}

const authStore = new AuthStore();
export default authStore;