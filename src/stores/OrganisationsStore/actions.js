import { action, autorun } from 'mobx';
import { firebase, prefixKeysWith, omitKeysWith } from '../helpers';
import { collection } from 'mobx-app';
import filter from 'lodash/filter';
import Fuse from 'fuse.js';
import gt from 'lodash/gt';
import gte from 'lodash/gte';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import partition from 'lodash/partition';
import reject from 'lodash/reject';

const actions = (state) => {

	const organisations = collection(state.organisations);
	const reports = collection(state.reports);

	const onUserOrganisations = ({ docChanges, size }) => {
		const max = size - 1;
		
		if (gt(0, max)) return setLoading(false);
		
		const [removed, added] = partition(docChanges, { type: 'removed' });

		added.forEach(async ({ doc }, i) => {
			const data = prefixKeysWith({ id: doc.id, reports: [], ...doc.data() });
			firebase.addFirebaseListener(`organisations/${doc.id}`, onOrganisationData(data));
			firebase.addFirebaseListener(`organisations/${doc.id}/reports`, onOrganisationReports(doc.id, max, i));
		});

		removed.forEach(action(({ doc: { id } }) => {
			organisations.setItems(reject(state.organisations, { _id: id }));
			firebase.removeFirebaseListener(`organisations/${id}`);
		}));
	};

	const onOrganisationData = (data) => action((doc) => doc.exists && organisations.updateOrAdd({ ...data, ...doc.data() }, '_id'));

	const onOrganisationReports = (orgId, orgMax = 0, orgI = 0) => ({ docChanges, size }) => {
		const max = size - 1;

		if (gt(0, max) && gte(orgI, orgMax)) return setLoading(false);

		const [removed, added] = partition(docChanges, { type: 'removed' });

		added.forEach(action(({ doc, doc: { id: repId } }, i) => {
			const report = doc.data();
			reports.updateOrAdd({ ...prefixKeysWith({ orgId, repId, id: `${orgId}/${repId}` }, '_'), ...report, _data: report.data || {} }, '_id');
			(i >= max && orgI >= orgMax) && setLoading(false);
		}));

		removed.forEach(action(({ doc: { id: repId } }) => reports.setItems(reject(state.reports, { _id: `${orgId}/${repId}` }))));
	};

	const create = async (obj) => {
		const id = obj._id;
		const path = `organisations/${id}`;

		if (await firebase.docExists(path)) return ({ code: 'already-exists' });

		const avatar = await getAvatarString(obj.avatar, `${path}/${id}-avatar.png`);
		const organisation = { created: new Date(), owner: state.authed._uid, ...omitKeysWith(obj, '_'), avatar };

		return await firebase.setDoc(path, organisation).then(() => ({})).catch((error) => error);
	};

	const getAvatarString = async (avatar, path) => {
		const placeholder = '/assets/images/organisation-avatar-placeholder.png';
		if (isObject(avatar)) return (await firebase.putFile(path, avatar)).downloadURL;
		if (!isString(avatar)) return placeholder;
		return avatar === '' ? placeholder : avatar;
	};

	const addUser = async (orgId, role = 'owner', uid = state.authed._uid) => await firebase.setDoc(`users/${uid}/organisations/${orgId}`, { role }).then(() => ({})).catch((error) => error);

	const findById = (orgId) => {
		firebase.addFirebaseListener(`organisations/${orgId}`, onOrganisationData({ _id: orgId }));
		firebase.addFirebaseListener(`organisations/${orgId}/reports`, onOrganisationReports(orgId));
	};

	let searchable = new Fuse(state.organisations, { keys: ['name', '_id'] });
	const search = (query) => searchable.search(query);
	
	const setLoading = action((val) => state.loading = isBoolean(val) ? val : false);

	autorun(() => {
		const { authed, listening } = state;

		if (!listening) return;

		// FIXME: We still need to set loading to false when we're NOT on an organisation route and are unauthed.
		if (listening && !authed) {
			organisations.clear();
			reports.clear();
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