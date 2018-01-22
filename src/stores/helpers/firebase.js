import 'firebase/firestore';
import fb from 'firebase';
import fromPairs from 'lodash/fromPairs';
import get from 'lodash/get';
import has from 'lodash/has';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { omitKeysWith } from './';
import reduce from 'lodash/reduce';
import upperFirst from 'lodash/upperFirst';

const firebase = fb.initializeApp({
	apiKey: 'AIzaSyBlvDQQfMR66mrdo4UdCeS4vZOJugGk6rc',
	authDomain: 'open-sea.firebaseapp.com',
	databaseURL: 'https://open-sea.firebaseio.com',
	projectId: 'open-sea',
	storageBucket: 'open-sea.appspot.com',
	messagingSenderId: '543244209934'
});

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const getRef = (path) => reduce(path.split('/'), (ref, seg, i) => (i === 0 || i %2 === 0) ? ref.collection(seg) : ref.doc(seg), db);

export const docExists = async (path) => (await getDoc(path)).exists;

export const getDoc = (path) => getRef(path).get();

export const setDoc = (path, obj, options = {}) => getRef(path).set(omitKeysWith(obj, '_'), { merge: true, ...options });

export const putFile = (path, blob) => storage.ref().child(path).put(blob);

let listeners = {};

const addListener = (obj) => listeners = { ...listeners, ...obj };

const setListeners = (obj) => listeners = obj;

const removeAllListeners = () => {
	map(listeners, (listener, path) => {
		listener();
		setListeners(omit(listeners, path));
	});
};

export const addFirebaseListener = (path, cb) => {
	if (has(listeners, path)) return;
	addListener(fromPairs([[path, getRef(path).onSnapshot(cb)]]));
};

export const removeFirebaseListener = (path) => {
	if (!path) return removeAllListeners();
	get(listeners, path)();
	setListeners(omit(listeners, path));
};