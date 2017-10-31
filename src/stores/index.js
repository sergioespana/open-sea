import { observable, computed } from 'mobx';
import { auth, db, googleAuthProvider } from '../lib/firebase';
import { assign, merge, isEmpty, set, map, trim, trimEnd, get, find } from 'lodash';
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
	
	_setListener = (str, handler) => {
		let path = str.split('/'),
			ref = db;

		path.forEach((item, index) => {
			let even = index === 0 || index %2 === 0;
			if (even) ref = ref.collection(item);
			else ref = ref.doc(item);
		});

		this.listeners[path] = ref.onSnapshot(handler);
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
	
	_wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
		
		let uid = res.uid,
			user = await db.collection('users').doc(res.uid).get();
		
		let currentUser = assign({},
			user.data(),
			{ uid }
		);
		
		if (isEmpty(this.currentUser)) {
			this.currentUser = currentUser;
			this._initOrgs(uid);
		}
		else this.currentUser = currentUser;
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
		return auth.signOut();
	}
	
	
	/* ==================================== */	
	/* =============== ORGS =============== */
	/* ==================================== */	
	
	
	@observable organisations = {};
	orgCount = 0;
	orgLimit = 0;
	
	_initOrgs = () => {
		this._setListener(`users/${this.currentUser.uid}/organisations`, this._handleUserOrgsSnapshot);
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
	
	checkOrgModelPresent = (id) => {
		if (find(this.organisations[id], 'model') === undefined) {
			this.showSnackbar(
				'No model exists on the server for this organisation.',
				4000,
				() => console.log('TODO'),
				'upload'
			);
		};
	}

	
	/* ==================================== */	
	/* =============== YAML =============== */
	/* ==================================== */	
	
	
	parseFile = (file) => {
		let fr = new FileReader();
		fr.onload = this._parseStringToModel;
		fr.readAsText(file);
	}

	_parseStringToModel = (event) => {
		let str = event.target.result,
			model = yaml.safeLoad(str),
			valid = ajv.validate(schema, model);

		if (valid) {
			this._storeModel(model);
			return;
		}

		this._displayModelError(ajv.errors[0]);
	}
	
	_displayModelError = (error) => {
		let fieldPath = trim(error.dataPath, '.'),
			field = get(model, fieldPath),
			objectPath = fieldPath.split('.')[0],
			object = get(model, objectPath),
			objectType = trimEnd(objectPath.split('[')[0], 's'),
			message = `Field "${field}" in ${objectType} "${object.id}" ${error.message}.`;

		this.showSnackbar(message);
	}

	_storeModel = () => {

	}
}

const AppStore = new Store();
export default AppStore;