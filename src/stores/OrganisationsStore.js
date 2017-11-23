import { toJS, observable } from 'mobx';
import AuthStore from './AuthStore';
import FirebaseStore from './FirebaseStore';
import ReportsStore from './ReportsStore';
import slug from 'slug';
import SnackbarStore from './SnackbarStore';

class OrganisationsStore {
	
	@observable loading = true;
	@observable busy = false;
	organisations = observable.map({});

	init = (uid) => {
		if (!this.loading) this.loading = true;
		if (uid) FirebaseStore.addListener(`users/${uid}/organisations`, this._onOrgScopeChanged);
		else FirebaseStore.addListener(`organisations`, this._onOrgScopeChanged);
	}

	findById = (id, toObj = false) => {
		let col = id ? this.organisations.get(id) : this.organisations;
		if (toObj) return toJS(col);
		return col;
	}

	create = async (name) => {
		this.busy = true;

		const id = slug(name).toLowerCase(),
			exists = await FirebaseStore.docExists(`organisations/${id}`);
		
		if (exists) {
			SnackbarStore.show(`${name} already exists`);
			return;
		}

		const created = new Date(),
			uid = AuthStore.users.get('current').get('uid'),
			role = 'owner';

		SnackbarStore.show(`Creating ${name}...`, 0);
		await FirebaseStore.setDoc(`organisations/${id}`, { name, created, public: false });
		await FirebaseStore.setDoc(`users/${uid}/organisations/${id}`, { role });
		SnackbarStore.show(`Saved ${name}`, 4000, 'VIEW', () => console.log('TODO: Go to new organisation'));
		this.busy = false;
	}

	reset = () => {
		this.limit = 0;
		this.count = 0;
		this.organisations.clear();
	}

	limit = 0;
	count = 0;

	_onOrgScopeChanged = (snapshot) => {
		if (snapshot.empty) return this.loading = false;

		this.limit = snapshot.size;
		snapshot.docChanges.forEach(this._handleOrgScopeChange);
	}

	_handleOrgScopeChange = (change) => {
		if (change.type === 'added') return this._addOrganisationListener(change.doc);
		if (change.type === 'removed') return this._removeOrganisationListener(change.doc);
	}

	_addOrganisationListener = (doc) => {
		const id = doc.id,
			{ role } = doc.data(),
			path = `organisations/${id}`,
			org = observable.map({ id, role });

		FirebaseStore.addListener(path, this._onOrgData);
		this.organisations.set(id, org);
		ReportsStore.init(id);
	}

	_removeOrganisationListener = (doc) => {
		const id = doc.id,
			path = `organisations/${id}`,
			name = this.organisations.get(id).get('name');

		SnackbarStore.show(`Your access to ${name} has been revoked`);
		FirebaseStore.removeListener(path);
		this.organisations.delete(id);
	}

	_onOrgData = (doc) => {
		if (!doc.exists) return this._removeOrganisationListener(doc);
		this.organisations.get(doc.id).merge(doc.data());

		this.count++;
		if (this.count === this.limit) this.loading = false;
	}
}

export default new OrganisationsStore();