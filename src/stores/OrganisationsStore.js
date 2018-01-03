import { action, extendObservable } from 'mobx';
import { firebase, prefixKeysWith } from './helpers';
import get from 'lodash/get';
import has from 'lodash/has';
import isBoolean from 'lodash/isBoolean';
import set from 'lodash/set';
import slug from 'slug';
import unset from 'lodash/unset';

const orgActions = (state) => {

	const findById = (id) => {
		const path = `organisations.${id}`;
		// If the organisation is already loaded, simply return it.
		if (has(state, path)) return get(state, path);
		// Add a listener if it does not already exist. onOrganisationData will do the rest.
		// TODO: Catch no access errors.
		firebase.addFirebaseListener(`organisations/${id}`, onOrganisationData());
		return false;
	};

	const findByUid = (uid) => {
		// Return if we're not currently loading, because this means we've already initialised
		// organisations for the current user.
		if (!state.loading) return;
		firebase.addFirebaseListener(`users/${uid}/organisations`, onUserOrganisations);
	};

	const onUserOrganisations = (snapshot) => {
		const added = snapshot.docChanges.filter(({ type }) => type === 'added');
		const removed = snapshot.docChanges.filter(({ type }) => type === 'removed');
		const max = snapshot.size - 1;

		// Handle empty snapshot (user has access to no organisations).
		if (max < 0) return setLoading(false);
		
		// For each added organisation, set a listener.
		added.forEach(({ doc, doc: { id } }, i) => {
			firebase.addFirebaseListener(`organisations/${id}`, onOrganisationData({ id, ...doc.data() }, max, i));
		});

		// For each removed organisation, clean up.
		removed.forEach(({ doc: { id } }) => {
			firebase.removeFirebaseListener(`organisations/${id}`);
			unset(state.organisations, id);
		});

		// TODO: Handle updates such as access changes.
	};

	const onOrganisationData = (data = {}, max = 0, i = 0) => action((doc) => {
		// Make the data that we initially passed "private" by prefixing the object
		// keys with an _. We will filter these out when storing data in the database.
		const privateData = prefixKeysWith(data, '_');
		// Update or set the data in the global state.
		setOrganisation(doc.id, { ...privateData, ...doc.data() });
		// Set a listener for the organisation's reports.
		firebase.addFirebaseListener(`organisations/${doc.id}/reports`, onOrganisationReports(doc.id, max, i));
	});

	const onOrganisationReports = (orgId, orgMax, orgI) => (snapshot) => {
		const addedOrModified = snapshot.docChanges.filter(({ type }) => type === 'added' || type === 'modified');
		const removed = snapshot.docChanges.filter(({ type }) => type === 'removed');
		const max = snapshot.size - 1;

		// If there are not reports for this organisation ánd it was the last of the
		// organisations, set loading to be false.
		if (max < 0 && orgI >= orgMax) return setLoading(false);

		// For each report that was added, update or set the dat ain the global state.
		addedOrModified.forEach(({ doc, doc: { id } }, i) => {
			setReport(`${orgId}.${id}`, { _id: id, ...doc.data() });
			// If this was the last report we needed to load ánd it was part of the
			// last organisation we needed to load, set loading to be false.
			if (i >= max && orgI >= orgMax) setLoading(false);
		});

		// For each removed report, clean up.
		removed.forEach(({ doc: { id } }) => unset(state.reports[orgId][id]));
	};

	const createOrganisation = async (obj) => {
		const { name } = obj;
		const id = slug(name, { lower: true });
		const organisation = { _id: id, avatar: '/assets/images/organisation-avatar-placeholder.png', created: new Date(), ...obj };
		// Check if the organisation already exists.
		if ((await firebase.getDoc(`organisations/${id}`)).exists) return new Error('Organisation already exists.');
		// Store the new organisation in the database.
		await firebase.setDoc(`organisations/${id}`, obj);
		// Return the newly created organisation.
		return organisation;
	};
	
	// Give a user with id "uid" access to organisation with id "id".
	const addUser = async (id, uid, role = 'watcher') => {
		await firebase.setDoc(`users/${uid}/organisations/${id}`, { role, added: new Date() });
		return true;
	};

	// Update an organisation in the global state.
	const setOrganisation = (id, obj) => set(state.organisations, id, obj);

	// Update a report in the global state.
	const setReport = (path, obj) => set(state.reports, path, obj);

	// Update the loading state. Visually "blocks" the entire application, should only
	// be used during initialisation.
	const setLoading = (val) => state.loading = isBoolean(val) ? val : false;

	return {
		addUser,
		createOrganisation,
		findById,
		findByUid
	};
};

const OrganisationsStore = (state, initialData) => {

	extendObservable(state, {
		loading: true,
		organisations: {},
		reports: {}
	});

	const actions = orgActions(state);

	return actions;
};

export default OrganisationsStore;