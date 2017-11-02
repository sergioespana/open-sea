// TODO: Split up into multiple stores:
// - fbStore for everything Firebase (auth, keeping organisastions in sync with the db)
// - snackStore for snackbars

import { observable, computed } from 'mobx';
import { auth, db, googleAuthProvider } from '../lib/firebase';
import { assign, merge, isEmpty, set, map, trim, trimEnd, get } from 'lodash';
import AJV from 'ajv';
import delve from 'dlv';
import mathjs from 'mathjs';
import yaml from 'js-yaml';
import schema from './schema.json';

const ajv = new AJV({
	coerceTypes: true
});

class Store {
	@observable appIsLoading = true;
	@observable drawerIsOpen = false;
	listeners = {};
	
	constructor() {
		auth.onAuthStateChanged(this._onAuthStateChanged);
	}
	
	_setListener = (path, handler) => {
		this.listeners[path] = this._getRef(path).onSnapshot(handler);
	}

	_unsetListener = (path) => {
		if (!path) {
			map(this.listeners, (listener) => listener());
			this.listeners = {};
		}
		else {
			this.listeners[path]();
			delete this.listeners[path];
		}
	}

	_getRef = (str) => {
		let path = str.split('/'),
			ref = db;

		path.forEach((item, index) => {
			let even = index === 0 || index %2 === 0;
			if (even) ref = ref.collection(item);
			else ref = ref.doc(item);
		});

		return ref;
	}
	
	_wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

	_setDocument = (path, obj, merge = true) => this._getRef(path).set(obj, { merge });

	toggleDrawer = () => {
		this.drawerIsOpen = !this.drawerIsOpen;
	}
	
	
	/* ==================================== */	
	/* ============= SNACKBAR ============= */
	/* ==================================== */	
	
	@observable snackbar = {
		open: false,
		doClose: false,
		message: '',
		action: null,
		actionMessage: null
	};

	showSnackbar = async (message, autohide = 4000, action = null, actionMessage = null) => {
		if (!message || message === '') return;

		if (this.snackbar.open) {
			if (this.snackbar.message === message) return;
			
			clearTimeout(this.snackbarTimeout);
			await this.hideSnackbar();
		}

		merge(this.snackbar, {
			open: true,
			message,
			action,
			actionMessage
		});

		if (autohide > 0) this.snackbarTimeout = setTimeout(this.hideSnackbar, autohide);
	}

	hideSnackbar = async () => {
		this.snackbar.doClose = true;

		await this._wait(195);

		this.snackbar = {
			open: false,
			doClose: false,
			message: '',
			action: null,
			actionMessage: null
		};

		return Promise.resolve();
	}

	doSnackbarAction = () => {
		this.snackbar.action();
		this.hideSnackbar();
	}
	
	
	/* ==================================== */	
	/* =============== AUTH =============== */
	/* ==================================== */	
	
	
	@observable currentUser = {};
	@computed get isAuthed() { return !isEmpty(this.currentUser) && this.currentUser !== false; }
	
	_onAuthStateChanged = async (res) => {
		if (!res) {
			this.currentUser = false;
			this.appIsLoading = false;
			return;
		}
		
		let uid = res.uid;

		if (isEmpty(this.currentUser)) {
			this._initOrgs(uid);

			let user = await db.collection('users').doc(res.uid).get();

			let currentUser = assign({},
				user.data(),
				{ uid }
			);

			this.currentUser = currentUser;
		}
	}
	
	signIn = (method, email = '', pass = '') => {
		if (method === 'google') return auth.signInWithPopup(googleAuthProvider);
		
		return auth.signInWithEmailAndPassword(email, pass);
	}
	
	signUp = (method, email = '', pass = '') => {
		if (method === 'google') return this.signIn('google');
		
		return auth.createUserWithEmailAndPassword(email, pass);
	}
	
	signOut = () => {
		this._unsetListener();

		this.organisations = {};
		this.orgCount = 0;
		this.orgLimit = 0;

		this.hideSnackbar();

		return auth.signOut();
	}
	
	
	/* ==================================== */	
	/* =============== ORGS =============== */
	/* ==================================== */	
	
	
	@observable organisations = {};
	orgCount = 0;
	orgLimit = 0;
	
	_initOrgs = (uid) => {
		this.appIsLoading = true;
		this._setListener(`users/${uid}/organisations`, this._handleUserOrgsSnapshot);
	}
	
	_handleUserOrgsSnapshot = (snapshot) => {
		this.orgLimit = snapshot.size;
		snapshot.docChanges.forEach((change) => {
			let type = change.type,
			doc = change.doc,
			id = doc.id,
			path = `organisations/${id}`;
			
			if (type === 'added') {
				set(this.organisations, id, { _id: id, _role: doc.data().role });
				this._setListener(path, this._handleOrgSnapshot);
			}
			
			if (type === 'removed') {
				this._unsetListener(path);
			}
		});
	}
	
	_handleOrgSnapshot = (doc) => {
		if (!doc.exists) return;
		this.orgCount++;
		merge(this.organisations[doc.id], doc.data());
		if (this.orgCount === this.orgLimit && this.appIsLoading === true) this.appIsLoading = false;
	}
	
	checkOrgModelPresent = (id, notify = true) => {
		let modelPresent = this.organisations[id].model !== undefined;
		if (notify) {
			let message = 'No model exists on the server for this organisation';
			
			if (modelPresent) {
				if (this.snackbar.open && this.snackbar.message === message) return this.hideSnackbar();
			} else {
				this.showSnackbar(
					'No model exists on the server for this organisation',
					4000,
					() => console.log('TODO'),
					'upload'
				);
			}
			
		}

		return modelPresent;
	}

	
	/* ==================================== */	
	/* =============== YAML =============== */
	/* ==================================== */	
	
	storeModel = (org, file) => {
		let fr = new FileReader();
		fr.onload = (event) => this._parseFile(org, event);
		fr.readAsText(file);
	}

	_parseFile = async (org, event) => {
		let str = event.target.result || false;

		if (str) {
			let model = yaml.safeLoad(str) || {},
				valid = this.validateModel(model);
			
			if (valid) {
				this.showSnackbar('Saving model...', 0);

				await this._setDocument(`organisations/${org}`, { model });

				return this.showSnackbar(
					'Model saved',
					4000,
					() => console.log('TODO'),
					'undo'
				);
			}

			return this.showSnackbar(this._buildErrorMessage(model, ajv.errors[0]), 6000);
		}

		this.showSnackbar('Unable to read the selected file');
	}

	validateModel = (model) => ajv.validate(schema, model);

	_buildErrorMessage = (model, error) => {
		let fieldPath = trim(error.dataPath, '.'),
			field = get(model, fieldPath),
			objectPath = fieldPath.split('.')[0],
			object = get(model, objectPath),
			objectType = trimEnd(objectPath.split('[')[0], 's');

		return `Field "${field}" in ${objectType} "${object.id}" ${error.message}`;
	}
}

const AppStore = new Store();
export default AppStore;