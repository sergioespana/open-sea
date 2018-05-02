import fb, { firestore } from 'firebase';
import 'firebase/firestore';
import { find, findIndex, isUndefined, map, partition, reject } from 'lodash';
import { observable } from 'mobx';
import { User } from '../domain/User';

const firebase = fb.initializeApp({
	apiKey: 'AIzaSyBlvDQQfMR66mrdo4UdCeS4vZOJugGk6rc',
	authDomain: 'open-sea.firebaseapp.com',
	databaseURL: 'https://open-sea.firebaseio.com',
	projectId: 'open-sea',
	storageBucket: 'open-sea.appspot.com',
	messagingSenderId: '543244209934'
});

const auth = firebase.auth();
const db = firebase.firestore();

// Export an object of listeners so we can react to changes in, for example,
// UIStore (by turning off loading once all listeners have been fired once).
type Listener = {
	f: () => void,
	path: string;
	status: 'pending' | 'listening';
};
export let listeners: Listener[] = observable([]);

// Add a listener, but only if it doesn't exist yet.
type snapshotHandler = (snapshot: firestore.DocumentSnapshot | firestore.QuerySnapshot) => void;
const addListener = (path: string, handler: snapshotHandler) => isUndefined(find(listeners, { path })) && listeners.push({
	path,
	f: path.split('/').length % 2 === 0 ? db.doc(path).onSnapshot(handler, console.error) : db.collection(path).onSnapshot(handler),
	status: 'pending'
});

// Remove a single listener.
const removeListener = (path: string) => listeners = observable(reject(listeners, { path }));

// Remove all listeners at once. Called when the user logs out.
export const stopListening = () => {
	listeners.forEach(({ f }) => f());
	listeners.length = 0;
};

const updateListenerStatus = (path, status: 'pending' | 'listening') => {
	const index = findIndex(listeners, { path });
	const listener = { ...listeners[index], status };
	listeners[index] = listener;
};

// Convenient method to add a listener. Manages all Firebase interactions here, so the stores just
// have to deal with updating state accordingly.
export const startListening = (path: string, initialData: object = {}, ...callbacks: Function[]) => {
	// TODO: Indicate that listeners have fired once. This way, if all listeners have been fired at least once,
	// we can turn off loading state.

	const isDocument = path.split('/').length % 2 === 0;

	const docIntermediate = (doc) => {
		map(callbacks, (cb): User => cb({
			_id: doc.id,
			...initialData,
			...doc.data()
		}));
		updateListenerStatus(path, 'listening');
	};

	const colIntermediate = ({ docChanges }) => {
		const [removed, added] = partition(docChanges, { type: 'removed' });
		added.forEach(({ doc }: any) => startListening(doc.ref.path, doc.data(), ...callbacks));
		removed.forEach(({ doc }: any) => removeListener(doc.ref.path));
		updateListenerStatus(path, 'listening');
	};

	return addListener(path, isDocument ? docIntermediate : colIntermediate);
};

export const saveDoc = async (path: string, data: object, callbacks?: { onError?: Function, onSuccess?: Function }) => {
	const { onError, onSuccess } = callbacks;

	try {
		await db.doc(path).set(data, { merge: true });
		if (onSuccess) onSuccess(data);
	} catch (error) {
		if (onError) onError(error);
	}
};

export const signInWithEmailAndPassword = (email, pass) => auth.signInWithEmailAndPassword(email, pass);

export const signUpWithEmailAndPassword = (email, pass) => auth.createUserWithEmailAndPassword(email, pass);

export const signOut = () => auth.signOut();

export const startListeningForAuthChanges = (handler) => auth.onAuthStateChanged(handler);
