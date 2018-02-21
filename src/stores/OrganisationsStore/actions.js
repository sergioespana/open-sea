import { action, autorun } from 'mobx';
import { firebase, prefixKeysWith, omitKeysWith } from '../helpers';
import { collection } from 'mobx-app';
import eq from 'lodash/eq';
import Fuse from 'fuse.js';
import get from 'lodash/get';
import gt from 'lodash/gt';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import { matchPath } from 'react-router-dom';
import reject from 'lodash/reject';

const actions = (state) => {

	const organisations = collection(state.organisations);
	const reports = collection(state.reports);
	const users = collection(state.users);

	const incrementSnapshotSize = action((inc) => {
		if (!isUndefined(state.initialSnapshotSize)) state.initialSnapshotSize += inc;
	});

	const incrementCount = action(() => {
		if (!isUndefined(state.initialCount)) state.initialCount++;
	});

	const onUserOrganisations = firebase.onSnapshot({
		before: ({ size }) => incrementSnapshotSize(size),
		onAdded: ({ doc }) => findById(doc.id),
		onRemoved: action(({ doc }) => {
			organisations.setItems(reject(state.organisations, { _id: doc.id }));
			firebase.removeFirebaseListener(`organisations/${doc.id}`);
		})
	});

	const onOrganisationUsers = (orgId) => firebase.onSnapshot({
		before: ({ size }) => incrementSnapshotSize(size),
		onAdded: action(({ doc }) => {
			// TODO: Store this role somewhere for the rest of the application
			// to be able to access and use.
			console.log(orgId, doc.id, doc.data().role);
			return firebase.hasFirebaseListener(`users/${doc.id}`) ? incrementCount() : firebase.addFirebaseListener(`users/${doc.id}`, onUserData);
		})
	});

	const onOrganisationReports = (orgId) => firebase.onSnapshot({
		before: ({ size }) => incrementSnapshotSize(size),
		onAdded: action(({ doc }) => {
			incrementCount();

			const repId = doc.id;
			const id = `${orgId}/${repId}`;
			const report = doc.data();
			const identifiers = prefixKeysWith({ orgId, repId, id }, '_');
			reports.updateOrAdd({ ...identifiers, ...report, _data: report.data || {} }, '_id');
		}),
		onRemoved: action(({ doc }) => {
			const repId = doc.id;
			const id = `${orgId}/${repId}`;
			reports.setItems(reject(state.reports, { _id: id }));
		})
	});

	const onOrganisationData = action((doc) => {
		incrementCount();
		return doc.exists && organisations.updateOrAdd({ _id: doc.id, ...doc.data() }, '_id');
	});

	const onUserData = action((doc) => {
		incrementCount();
		return doc.exists && users.updateOrAdd({ _uid: doc.id, ...doc.data() }, '_uid');
	});

	// TODO: this function could use some work.
	const create = async (obj) => {
		const id = obj._id;
		const path = `organisations/${id}`;

		if (await firebase.docExists(path)) return ({ code: 'already-exists' });

		const avatar = await getAvatarString(obj.avatar, `${path}/${id}-avatar.png`);
		const organisation = { created: new Date(), ...omitKeysWith(obj, '_'), avatar };

		return await firebase.setDoc(path, organisation).then(() => ({})).catch((error) => error);
	};

	const getAvatarString = async (avatar, path) => {
		const placeholder = '/assets/images/organisation-avatar-placeholder.png';
		if (isObject(avatar)) return (await firebase.putFile(path, avatar)).downloadURL;
		if (!isString(avatar)) return placeholder;
		return avatar === '' ? placeholder : avatar;
	};

	// TODO: this function could use some work.
	const addUser = async (orgId, role = 'owner', uid = state.authed._uid) => await firebase.setDoc(`users/${uid}/organisations/${orgId}`, { role }).then(() => ({})).catch((error) => error);

	const findById = (orgId) => {
		firebase.addFirebaseListener(`organisations/${orgId}`, onOrganisationData);
		firebase.addFirebaseListener(`organisations/${orgId}/users`, onOrganisationUsers(orgId));
		firebase.addFirebaseListener(`organisations/${orgId}/reports`, onOrganisationReports(orgId));
	};

	let searchable = new Fuse(state.organisations, { keys: ['name', '_id'] });
	const search = (query) => searchable.search(query);
	
	const setLoading = action((val) => state.loading = isBoolean(val) ? val : false);

	autorun(() => {
		const size = state.initialSnapshotSize;
		const count = state.initialCount;
		if (gt(count, 0) && eq(size, count)) {
			setLoading(false);
		}
	});

	autorun(() => {
		const { authed, listening } = state;

		if (!listening) return;

		if (listening && !authed) {
			organisations.clear();
			reports.clear();

			const match = matchPath(location.pathname, { path: '/:orgId' });
			const orgId = get(match, 'params.orgId');

			if (!orgId || ['account', 'create', 'dashboard'].includes(orgId)) return setLoading(false);
			return;
		}
		
		setLoading(true);
		firebase.addFirebaseListener(`users/${authed._uid}/organisations`, onUserOrganisations);
	});

	autorun(() => searchable = new Fuse(state.organisations, { keys: ['name'] }));

	return {
		...organisations,
		addUser,
		create,
		findById,
		search,
		setLoading
	};
};

export default actions;