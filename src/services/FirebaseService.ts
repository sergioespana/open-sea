import fb, { firestore } from 'firebase';
import 'firebase/firestore';
import { find, findIndex, flatten, isString, isUndefined, map, partition, reject } from 'lodash';
import { observable } from 'mobx';

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
	f: path.split('/').length % 2 === 0 ? db.doc(path).onSnapshot(handler, handleError(path)) : db.collection(path).onSnapshot(handler, handleError(path)),
	status: 'pending'
});

const handleError = (path: string) => (error) => {
	console.error(error);
	console.error(`The above error was thrown from the onSnapshot method that belongs to listener for path "${path}".`);
};

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
export const startListening = (path: string, initialData: object = {}, callbacks: { onAdded?: (res: any) => void, onRemoved?: (id: string) => void } = {}) => {
	const { onAdded, onRemoved } = callbacks;

	// Handler for when we're dealing with a document reference.
	const docHandler = (doc) => {
		// Document exists and was added or updated.
		if (doc.exists && onAdded) onAdded({
			_id: doc.id,
			...initialData,
			...doc.data()
		});

		// Document does not exist and so we know it has been removed.
		if (!doc.exists && onRemoved) onRemoved(doc.id);

		updateListenerStatus(path, 'listening');
	};

	// Intermediate handler for when we're dealing with a collection. This intermediate
	// sets listeners up for each item in a collection and removes listeners for deleted
	// items. Removed individual items are handled in docHandler.
	const colIntermediate = ({ docChanges }) => {
		const [removed, added] = partition(docChanges, { type: 'removed' });
		added.forEach(({ doc }: any) => startListening(doc.ref.path, doc.data(), callbacks));
		removed.forEach(({ doc }: any) => removeListener(doc.ref.path));
		updateListenerStatus(path, 'listening');
	};

	const isDocument = path.split('/').length % 2 === 0;
	return addListener(path, isDocument ? docHandler : colIntermediate);
};

export const saveDoc = async (path: string, data: object, callbacks: { onError?: Function, onSuccess?: Function } = {}) => {
	const { onError, onSuccess } = callbacks;

	try {
		await db.doc(path).set(data, { merge: true });
		if (onSuccess) onSuccess(data);
	} catch (error) {
		if (onError) onError(error);
	}
};

export const removeDoc = async (path: string, callbacks: { onError?: Function, onSuccess?: Function } = {}) => {
	const { onError, onSuccess } = callbacks;

	try {
		await db.doc(path).delete();
		if (onSuccess) onSuccess();
	} catch (error) {
		if (onError) onError(error);
	}
};

export const search = async (collection: string, field: string | string[], query: string, callbacks: { onError?: Function, onSuccess?: Function } = {}) => {
	const { onError, onSuccess } = callbacks;

	try {
		const ref = db.collection(collection);
		const promises = isString(field) ? [ ref.where(field, '==', query).get() ] : map(field, (str) => ref.where(str, '==', query).get());
		const result = await Promise.all(promises);
		const userResult = flatten(map(result, (res) => map(res.docs, (doc) => doc.exists && ({ ...doc.data(), _id: doc.id }))));
		if (onSuccess) onSuccess(userResult);
		return userResult;
	} catch (error) {
		if (onError) onError(error);
	}
};

export const docExists = async (path: string) => (await db.doc(path).get()).exists;

export const resetPassword = (email: string) => auth.sendPasswordResetEmail(email);

export const signInWithEmailAndPassword = (email: string, pass: string) => auth.signInWithEmailAndPassword(email, pass);

export const signUpWithEmailAndPassword = (email: string, pass: string) => auth.createUserWithEmailAndPassword(email, pass);

export const signOut = () => auth.signOut();

export const startListeningForAuthChanges = (handler: (a: fb.User) => any) => auth.onAuthStateChanged(handler);
