import { observable } from 'mobx';
import authStore from './auth';
import appStore from './app';
import fbStore from './firebase';
import snackStore from './snack';

class OrganisationStore {

	organisations = observable.map({});

	initialise = (uid) => {
		appStore.isLoading = true;
		fbStore.addListener(`users/${uid}/organisations`, this._onUserOrganisationsSnapshot);
	}
	
	checkOrgModelPresent = (id, notify = true) => {
		let modelPresent = this.organisations.get(id).has('model');
		if (notify) {
			let message = 'No model exists on the server for this organisation';
			
			if (modelPresent) {
				if (snackStore.isOpen && snackStore.snackbar.get('message') === message) snackStore.hide();
			}
			else {
				snackStore.show(message, 4000, () => console.log('TODO: Open file input'), 'upload' );
			}
			
		}

		return modelPresent;
	}

	createNew = async (id, name) => {
		let org = await fbStore.getDoc(`organisations/${id}`);
		if (org.exists) {
			snackStore.show(`${name} already exists`);
			return Promise.reject();
		}

		snackStore.show('Creating organisation...', 0);
		await fbStore.setDoc(`organisations/${id}`, { name, created: new Date(), public: false });
		await fbStore.setDoc(`users/${authStore.user.get('uid')}/organisations/${id}`, { role: 'owner' });
		snackStore.show('Saved organisation', 4000, `/${id}`, 'VIEW');
		return Promise.resolve();
	}

	togglePublic = async (id, notify = true) => {
		let org = this.organisations.get(id),
			currentSetting = org.get('public');

		await fbStore.setDoc(`organisations/${id}`, { public: !currentSetting });

		if (notify) {
			snackStore.show(`Organisation is ${currentSetting ? 'no longer' : 'now'} public`, 4000, () => this.togglePublic(id, false), 'UNDO');
		}
	}

	limit = 0;
	count = 0;

	_onUserOrganisationsSnapshot = (snapshot) => {
		if (snapshot.empty) return appStore.isLoading = false;
		
		this.limit = snapshot.size;
		snapshot.docChanges.forEach((change) => {
			let { type, doc } = change,
				{ id } = doc,
				path = `organisations/${id}`;

			switch (type) {
				case 'added':
					fbStore.addListener(path, this._onOrganisationSnapshot);
					this.organisations.set(id, observable.map({ _id: id, _role: doc.data().role }));
					break;
				case 'removed':
					fbStore.removeListener(path);
					this.organisations.delete(id);
					break;
			}
		});
	}

	_onOrganisationSnapshot = (doc) => {
		let { exists, id } = doc;

		if (!exists && this.organisations.has(id)) return this.organisations.delete(id);

		this.count++;
		this.organisations.get(id).merge(doc.data());
		if (this.count === this.limit && appStore.isLoading === true) appStore.isLoading = false;
	}
}

const orgStore = new OrganisationStore();
export default orgStore;