import { User } from '../../domain/User';
import * as FirebaseService from '../../services/FirebaseService';
import collection from '../collection';

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

		state.isReady = true; // FIXME: Use setAppState for this when it works
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

	const signUp = async (email: string, pass: string, initialData: any) => {
		const { uid } = await FirebaseService.signUpWithEmailAndPassword(email, pass);
		const user = {
			...initialData,
			avatar: initialData.avatar || '/assets/images/profile-avatar-placeholder.png',
			created: new Date(),
			email
		};
		await FirebaseService.saveDoc(`users/${uid}`, user);
	};

	const resetPassword = (email: string) => FirebaseService.resetPassword(email);

	FirebaseService.startListeningForAuthChanges(onAuthStateChanged);

	return {
		...users,
		resetPassword,
		signIn,
		signOut,
		signUp
	};
};
