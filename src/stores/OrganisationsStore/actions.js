import { action, autorun } from 'mobx';
import { firebase, prefixKeysWith, omitKeysWith } from '../helpers';
import { collection } from 'mobx-app';
import gt from 'lodash/gt';
import gte from 'lodash/gte';
import isBoolean from 'lodash/isBoolean';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import partition from 'lodash/partition';
import reject from 'lodash/reject';

const actions = (state) => {

	const organisations = collection(state.organisations);

	const onUserOrganisations = ({ docChanges, size }) => {
		const max = size - 1;
		
		if (gt(0, max)) return setLoading(false);
		
		const [removed, added] = partition(docChanges, { type: 'removed' });

		added.forEach(async ({ doc }, i) => {
			const data = prefixKeysWith({ id: doc.id, reports: [], ...doc.data() });
			firebase.addFirebaseListener(`organisations/${doc.id}`, onOrganisationData(data, max, i));
			firebase.addFirebaseListener(`organisations/${doc.id}/reports`, onOrganisationReports(doc.id, max, i));
		});

		removed.forEach(action(({ doc: { id } }) => {
			organisations.setItems(reject(state.organisations, { _id: id }));
			firebase.removeFirebaseListener(`organisations/${id}`);
		}));
	};

	const onOrganisationData = (data, max = 0, i = 0) => action((doc) => doc.exists && organisations.updateOrAdd({ ...data, ...doc.data() }, '_id'));

	const onOrganisationReports = (orgId, orgMax = 0, orgI = 0) => ({ docChanges, size }) => {
		const max = size - 1;

		if (gt(0, max) && gte(orgI, orgMax)) return setLoading(false);

		const [removed, added] = partition(docChanges, { type: 'removed' });
		const organisation = organisations.getItem(orgId, '_id');
		const reports = collection(organisation._reports);

		added.forEach(action(({ doc }, i) => {
			const data = doc.data();
			reports.updateOrAdd({ _id: doc.id, ...data, _data: data.data || {} }, '_id');
			(i >= max && orgI >= orgMax) && setLoading(false);
		}));

		removed.forEach(action(({ doc }) => reports.setItems(reject(organisation._reports, { _id: doc.id }))));
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

	const setLoading = action((val) => state.loading = isBoolean(val) ? val : false);

	autorun(() => {
		const { authed, listening } = state;
		if (!listening) return;
		if (listening && !authed) return organisations.clear();
		setLoading(true);
		firebase.addFirebaseListener(`users/${authed._uid}/organisations`, onUserOrganisations);
	});

	return {
		...organisations,
		addUser,
		create
	};
};

export default actions;