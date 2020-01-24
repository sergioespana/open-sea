import { difference, filter, find, isString, map } from 'lodash';
import { reaction } from 'mobx';
import { Infographic, Organisation, Report, Stakeholder, StakeholderGroup } from '../../domain/Organisation';
import { User } from '../../domain/User';
import * as FirebaseService from '../../services/FirebaseService';
import collection from '../collection';
import { getCurrentUser, removePrivates } from '../helpers';

export const actions = (state) => {

	const organisations = collection(state.organisations);

	reaction(
		() => {
			const currentUser = getCurrentUser(state);
			return currentUser ? currentUser._organisations.length : 0;
		},
		(length) => {
			// User either doesn't have access to any organisations OR has logged out,
			// remove loaded organisations from memory.
			if (length === 0) return organisations.clear();

			// Create lists of organisation IDs the user has access to as well as the ones
			// we currently have in memory.
			const userOrgIds = map(getCurrentUser(state)._organisations, ({ _id }) => _id);
			const memoryOrgIds = map(state.organisations, ({ _id }) => _id);

			// Remove organisations that are in memory but not in the user's organisations
			// from memory as we no longer have access to those.
			const removed = difference(memoryOrgIds, userOrgIds);
			removed.forEach((orgId) => organisations.remove(orgId));

			// Set a listener for organisations that aren't in memory but are in the user's
			// organisations.
			const added = difference(userOrgIds, memoryOrgIds);
			added.forEach(startListening);
		}
	);

	const startListening = (orgId: string) => {
		FirebaseService.startListening(`organisations/${orgId}`, { _organisations: [], _reports: [], _users: [], _stakeholderGroups: [], _stakeholders: [], _infographics: [] }, { onAdded: onOrganisation(orgId), onRemoved: organisations.remove });
		FirebaseService.startListening(`organisations/${orgId}/reports`, {}, { onAdded: onOrganisationReport(orgId, 'added'), onRemoved: onOrganisationReport(orgId, 'removed') });
		FirebaseService.startListening(`organisations/${orgId}/users`, {}, { onAdded: onOrganisationUser(orgId, 'added'), onRemoved: onOrganisationUser(orgId, 'removed') });
		FirebaseService.startListening(`organisations/${orgId}/stakeholdergroups`, {}, { onAdded: onOrganisationStakeholderGroup(orgId, 'added'), onRemoved: onOrganisationStakeholderGroup(orgId, 'removed') });
		FirebaseService.startListening(`organisations/${orgId}/stakeholders`, {}, { onAdded: onOrganisationStakeholder(orgId, 'added'), onRemoved: onOrganisationStakeholder(orgId, 'removed') });
		FirebaseService.startListening(`organisations/${orgId}/infographics`, {}, { onAdded: onOrganisationInfographic(orgId, 'added'), onRemoved: onOrganisationInfographic(orgId, 'removed') });

	};

	const onNetworkOrganisation = (netId: string, action: 'added' | 'removed') => (organisation: any) => {
		const network = organisations.findById(netId);

		if (action === 'added') {
			collection(network._organisations).updateOrInsert(organisation);
			startListening(organisation._id);
		} else collection(network._organisations).remove(organisation);
	};

	const onOrganisation = (orgId: string) => (organisation: Organisation) => {
		organisations.updateOrInsert(organisation);
		if (organisation.isNetwork) FirebaseService.startListening(`organisations/${orgId}/organisations`, {}, { onAdded: onNetworkOrganisation(orgId, 'added'), onRemoved: onNetworkOrganisation(orgId, 'removed') });
	};

	const onOrganisationReport = (_orgId: string, action: 'added' | 'removed') => (report: any) => {
		const organisation = organisations.findById(_orgId);

		if (action === 'added') {
			const { _id: _repId, ...data } = report;
			const _id = `${_orgId}/${_repId}`;
			collection(organisation._reports).updateOrInsert({ _id, _orgId, _repId, ...data });
		} else collection(organisation._reports).remove(report);
	};

	const onOrganisationStakeholderGroup = (_orgId: string, action: 'added' | 'removed') => (stakeholdergroup: any) => {
		const organisation = organisations.findById(_orgId);

		if (action === 'added') {
			const { _id: _sgId, ...data } = stakeholdergroup;
			const _id = `${_orgId}/${_sgId}`;
			collection(organisation._stakeholderGroups).updateOrInsert({ _id, _orgId, _sgId, ...data });
		} else collection(organisation._stakeholderGroups).remove(stakeholdergroup);
	};

	const onOrganisationStakeholder = (_orgId: string, action: 'added' | 'removed') => (stakeholder: any) => {
		const organisation = organisations.findById(_orgId);

		if (action === 'added') {
			const { _id: _sId, ...data } = stakeholder;
			const _id = `${_orgId}/${_sId}`;
			collection(organisation._stakeholders).updateOrInsert({ _id, _orgId, _sId, ...data });
		} else collection(organisation._stakeholders).remove(stakeholder);
	};

	const onOrganisationInfographic = (_orgId: string, action: 'added' | 'removed') => (infographic: any) => {
		const organisation = organisations.findById(_orgId);

		if (action === 'added') {
			const { _id: _infographicId, ...data } = infographic;
			const _id = `${_orgId}/${_infographicId}`;
			collection(organisation._infographics).updateOrInsert({ _id, _orgId, _infographicId, ...data });
		} else collection(organisation._infographics).remove(infographic);
	};

	const onOrganisationUser = (orgId: string, action: 'added' | 'removed') => (user: any) => {
		const organisation = organisations.findById(orgId);

		if (action === 'added') {
			collection(organisation._users).updateOrInsert(user);
			FirebaseService.startListening(`users/${user._id}`, {}, { onAdded: onUser });
		} else collection(organisation._users).remove(user);
	};

	const onUser = (user: User) => {
		const users = collection(state.users);
		users.updateOrInsert(user);
	};

	const addReport = (rep: Report, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = rep;
		const report = { ...removePrivates(rep), created: new Date(), createdBy: getCurrentUser(state)._id };
		FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, report, callbacks);
	};

	const removeReport = (rep: Report, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = rep;
		FirebaseService.removeDoc(`organisations/${_orgId}/reports/${_repId}`, callbacks);
	};

	const addStakeholderGroup = (stg: StakeholderGroup, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _sgId } = stg;
		const stakeholdergroup = { ...removePrivates(stg), created: new Date(), createdBy: getCurrentUser(state)._id };
		FirebaseService.saveDoc(`organisations/${_orgId}/stakeholdergroups/${_sgId}`, stakeholdergroup, callbacks);
	};

	const removeStakeholderGroup = (stg: StakeholderGroup , callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _sgId } = stg;
		FirebaseService.removeDoc(`organisations/${_orgId}/stakeholdergroups/${_sgId}`, callbacks);
	};

	const addStakeholder = (sh: Stakeholder, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _sId } = sh;
		const stakeholder = { ...removePrivates(sh), created: new Date(), createdBy: getCurrentUser(state)._id };
		FirebaseService.saveDoc(`organisations/${_orgId}/stakeholders/${_sId}`, stakeholder, callbacks);
	};

	const removeStakeholder = (sh: Stakeholder , callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _sId } = sh;
		FirebaseService.removeDoc(`organisations/${_orgId}/stakeholders/${_sId}`, callbacks);
	};

	const addInfographic = (infog: Infographic, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _infographicId } = infog;
		const infographic = { ...removePrivates(infog), created: new Date(), createdBy: getCurrentUser(state)._id };
		FirebaseService.saveDoc(`organisations/${_orgId}/infographics/${_infographicId}`, infographic, callbacks);
	};

	const removeInfographic = (infog: Infographic, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _infographicId } = infog;
		FirebaseService.removeDoc(`organisations/${_orgId}/infographics/${_infographicId}`, callbacks);
	};

	const addOrganisation = (net: string | Organisation, org: string | Organisation, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const netId = isString(net) ? net : net._id;
		const orgId = isString(org) ? org : org._id;
		FirebaseService.saveDoc(`organisations/${netId}/organisations/${orgId}`, { added: new Date() }, callbacks);
	};

	const removeOrganisation = (net: string | Organisation, org: string | Organisation, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const netId = isString(net) ? net : net._id;
		const orgId = isString(org) ? org : org._id;
		FirebaseService.removeDoc(`organisations/${netId}/organisations/${orgId}`, callbacks);
	};

	const updateOrganisation = (org: Organisation, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _id } = org;
		const organisation = { ...removePrivates(org), updated: new Date(), updatedBy: getCurrentUser(state)._id };
		FirebaseService.saveDoc(`organisations/${_id}`, organisation, callbacks);
	};

	const updateOrAddAccess = (org: string | Organisation, user: string | User, access: number = 10, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const orgId = isString(org) ? org : org._id;
		const userId = isString(user) ? user : user._id;
		FirebaseService.saveDoc(`organisations/${orgId}/users/${userId}`, { access, added: new Date() }, callbacks);
	};

	const removeAccess = (org: string | Organisation, user: string | User, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const orgId = isString(org) ? org : org._id;
		const userId = isString(user) ? user : user._id;
		FirebaseService.removeDoc(`organisations/${orgId}/users/${userId}`, callbacks);
	};

	const checkAvailability = (orgId: string) => FirebaseService.docExists(`organisations/${orgId}`);

	const create = (org: Organisation, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _id } = org;
		const organisation = { ...removePrivates(org), created: new Date(), createdBy: getCurrentUser(state)._id };
		FirebaseService.saveDoc(`organisations/${_id}`, organisation, callbacks);
	};

	const findParentNetworkById = (orgId: string) => {
		const networks = filter(state.organisations, { isNetwork: true });
		return find(networks, (network: Organisation) => find(network._organisations, { _id: orgId }));
	};

	return {
		...organisations,
		addInfographic,
		addOrganisation,
		addReport,
		addStakeholder,
		addStakeholderGroup,
		checkAvailability,
		create,
		findParentNetworkById,
		removeAccess,
		removeInfographic,
		removeOrganisation,
		removeReport,
		removeStakeholder,
		removeStakeholderGroup,
		startListening,
		updateOrganisation,
		updateOrAddAccess
	};
};
