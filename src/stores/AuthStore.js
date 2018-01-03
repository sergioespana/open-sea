import { action, computed, extendObservable } from 'mobx';
import { firebase } from './helpers';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';

const authActions = (state) => {
	// TODO: Rework users to be an object of users.
	// TODO: Move currentUser into users object under id 'current'.
	// TODO: setCurrentUser --> setUser
	// TODO: onCurrentUserData --> onUserData

	const findById = (id) => {
		if (id === 'current') return state.currentUser;
	};

	const startListening = () => {
		firebase.auth.onAuthStateChanged(onAuthStateChanged);
	};

	const onAuthStateChanged = (res) => {
		// Return an empty user object if res is null. This means we're not logged in.
		if (res === null) return setCurrentUser({});
		setLoading(true);
		const { uid: _uid, email, emailVerified } = res;
		// Update local user fields and push to database.
		setCurrentUser({ _uid, email, emailVerified, lastLogin: new Date() }, { updateRemote: true, merge: true });
		// Start listening for changes to the user so that we can display them locally.
		// Note: this listener will not be created if it has already been set (when the account
		// has just been created, for example).
		firebase.addFirebaseListener(`users/${_uid}`, onCurrentUserData);
	};

	const setCurrentUser = action(async (obj, options = {}) => {
		const { merge, updateRemote } = options;

		if (merge) state.currentUser = { ...state.currentUser, ...obj };
		else state.currentUser = obj;

		if (updateRemote) return await firebase.setDoc(`users/${obj._uid}`, obj);
		return true;
	});

	const onCurrentUserData = (doc) => setCurrentUser(doc.data(), { merge: true });

	const createUser = async (email, password, obj) => {
		const newUser = { email, avatar: '/assets/images/profile-avatar-placeholder.png', created: new Date(), ...obj };
		const res = await firebase.auth.createUserWithEmailAndPassword(email, password)
			.catch((error) => error);
		const { uid } = res;

		if (uid) {
			// User was created successfully, use returned uid to set other provided fields
			// in the database.
			await setCurrentUser({ _uid: uid, ...newUser }, { updateRemote: true });
			// Start listening for changes to the user so that we can display them locally.
			firebase.addFirebaseListener(`users/${uid}`, onCurrentUserData);
			return true;
		}

		// User could not be created, return error.
		return res;
	};

	const signIn = async (email, password) => {
		const res = await firebase.auth.signInWithEmailAndPassword(email, password)
			.catch((error) => error);
		
		if (res.code) return res;
		return true;
	};

	const signOut = () => {
		reset();
		firebase.auth.signOut();
	};

	const reset = action(() => {
		firebase.removeFirebaseListener();
		state.organisations = {};
	});

	// Update the loading state. Visually "blocks" the entire application, should only
	// be used during initialisation.
	const setLoading = (val) => state.loading = isBoolean(val) ? val : false;

	return {
		createUser,
		findById,
		startListening,
		signIn,
		signOut
	};
};

const AuthStore = (state, initialData) => {

	extendObservable(state, {
		authed: computed(() => state.currentUser === null ? 'loading' : !isEmpty(state.currentUser)),
		currentUser: null,
		users: {}
	});
	
	const actions = authActions(state);

	actions.startListening();

	return actions;
};

export default AuthStore;