import { map } from 'lodash';
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
		FirebaseService.startListening(`organisations/${orgId}`, { _organisations: [], _reports: [], _users: [] }, onOrganisation(orgId));
		FirebaseService.startListening(`organisations/${orgId}/reports`, {}, onOrganisationReport(orgId));
		FirebaseService.startListening(`organisations/${orgId}/users`, {}, onOrganisationUser(orgId));
	};

	const onNetworkOrganisation = (netId: string) => (organisation: Organisation) => {
		const network = organisations.findById(netId);
		collection(network._organisations).updateOrInsert(organisation);

		startListening(organisation._id);
	};

	const onOrganisation = (orgId: string) => (organisation: Organisation) => {
		organisations.updateOrInsert(organisation);
		if (organisation.isNetwork) FirebaseService.startListening(`organisations/${orgId}/organisations`, {}, onNetworkOrganisation(orgId));
	};

	const onOrganisationReport = (_orgId: string) => (report: Report) => {
		const { _id: _repId, ...data } = report;
		const _id = `${_orgId}/${_repId}`;
		const organisation = organisations.findById(_orgId);
		collection(organisation._reports).updateOrInsert({ _id, _orgId, _repId, ...data });
	};

	const onOrganisationUser = (orgId: string) => (user: User) => {
		const organisation = organisations.findById(orgId);
		collection(organisation._users).updateOrInsert(user);

		FirebaseService.startListening(`users/${user._id}`, {}, onUser);
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

	return {
		...organisations,
		addReport
	};
};
