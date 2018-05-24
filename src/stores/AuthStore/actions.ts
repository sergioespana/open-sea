import { User, UserOrganisation } from '../../domain/User';
import * as FirebaseService from '../../services/FirebaseService';
import collection from '../collection';
import { setAppState } from '../helpers';

export const actions = (state) => {

	const users = collection(state.users);

	const onAuthStateChanged = async (res) => {
		if (res) {
			// User is logged in. Set listeners for:
			// - The user's information in the database
			// - The collection of organisations the user has access to
			const { uid } = res;
			FirebaseService.startListening(`users/${uid}`, { _isCurrent: true, _organisations: [] }, { onAdded: onUser });
			FirebaseService.startListening(`users/${uid}/organisations`, {}, { onAdded: onUserOrganisation(uid, 'added'), onRemoved: onUserOrganisation(uid, 'removed') });
		} else {
			// User is not logged in or has just logged out. Remove all loaded
			// users from memory and remove all listeners.
			users.clear();
			FirebaseService.stopListening();
		}

		setAppState(state, 'isReady', true);
	};

	const onUser = (user: User) => {
		users.updateOrInsert(user);
	};

	const onUserOrganisation = (uid: string, action: 'added' | 'removed') => (organisation: any) => {
		const user = users.findById(uid);
		if (action === 'added') return collection(user._organisations).updateOrInsert(organisation);
		return collection(user._organisations).remove(organisation);
	};

	const signOut = () => FirebaseService.signOut();

	const signIn = (email: string, pass: string) => FirebaseService.signInWithEmailAndPassword(email, pass);

	const signUp = (email: string, pass: string) => FirebaseService.signUpWithEmailAndPassword(email, pass);

	FirebaseService.startListeningForAuthChanges(onAuthStateChanged);

	return {
		...users,
		signIn,
		signOut,
		signUp
	};
};
