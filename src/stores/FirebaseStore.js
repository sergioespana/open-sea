import fb from 'firebase';
import { observable } from 'mobx';
require('firebase/firestore');

class FirebaseStore {

	firebase = fb;
	db;
	auth;
	providers;

	listeners = observable.map({});

	constructor() {
		this.firebase.initializeApp({
			apiKey: 'AIzaSyBlvDQQfMR66mrdo4UdCeS4vZOJugGk6rc',
			authDomain: 'open-sea.firebaseapp.com',
			databaseURL: 'https://open-sea.firebaseio.com',
			projectId: 'open-sea',
			storageBucket: 'open-sea.appspot.com',
			messagingSenderId: '543244209934'
		});

		this.db = this.firebase.firestore();
		this.auth = this.firebase.auth();
		this.providers = {
			google: new fb.auth.GoogleAuthProvider()
		};
	}

	addListener = (path, handler) => {
		if (this.listeners.has(path)) return;
		this.listeners.set(path, this.getRef(path).onSnapshot(handler));
	}

	removeListener = (path) => {
		if (path) {
			this.listeners.get(path)();
			this.listeners.delete(path);
			return;
		}

		this.listeners.forEach((listener) => listener());
		this.listeners.clear();
	}

	getRef = (str) => {
		let path = str.split('/'),
			ref = this.db;

		path.forEach((item, index) => {
			if (index === 0 || index %2 === 0) ref = ref.collection(item);
			else ref = ref.doc(item);
		});

		return ref;
	}

	getDoc = (path) => this.getRef(path).get();

	docExists = async (path) => {
		try { return (await this.getDoc(path)).exists; }
		catch (error) { return false; } // FIXME: Do we want to say the document does not exist if we do not have access?
	}

	setDoc = (path, obj, merge = true) => this.getRef(path).set(obj, { merge });
}

export default new FirebaseStore();