import { filter, find, isString, map } from 'lodash';
import { reaction } from 'mobx';
import { Organisation, Report } from '../../domain/Organisation';
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

			// User has access to some organisations, so set listers for each of them.
			const orgs = getCurrentUser(state)._organisations;
			map(orgs, ({ _id }) => _id).forEach(startListening);
		}
	);

	const startListening = (orgId: string) => {
		FirebaseService.startListening(`organisations/${orgId}`, { _organisations: [], _reports: [], _users: [] }, { onAdded: onOrganisation(orgId), onRemoved: organisations.remove });
		FirebaseService.startListening(`organisations/${orgId}/reports`, {}, { onAdded: onOrganisationReport(orgId, 'added'), onRemoved: onOrganisationReport(orgId, 'removed') });
		FirebaseService.startListening(`organisations/${orgId}/users`, {}, { onAdded: onOrganisationUser(orgId, 'added'), onRemoved: onOrganisationUser(orgId, 'removed') });
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
		addOrganisation,
		addReport,
		checkAvailability,
		create,
		findParentNetworkById,
		removeAccess,
		removeOrganisation,
		startListening,
		updateOrganisation,
		updateOrAddAccess
	};
};
