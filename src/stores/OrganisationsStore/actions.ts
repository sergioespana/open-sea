import { map } from 'lodash';
import { reaction } from 'mobx';
import { collection } from 'mobx-app';
import { Organisation, Report } from '../../domain/Organisation';
import { User } from '../../domain/User';
import * as FirebaseService from '../../services/FirebaseService';
import { getCurrentUser } from '../helpers';

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
		const network = organisations.getItem(netId, '_id');
		collection(network._organisations).updateOrAdd(organisation, '_id');

		startListening(organisation._id);
	};

	const onOrganisation = (orgId: string) => (organisation: Organisation) => {
		organisations.updateOrAdd(organisation, '_id');
		if (organisation.isNetwork) FirebaseService.startListening(`organisations/${orgId}/organisations`, {}, onNetworkOrganisation(orgId));
	};

	const onOrganisationReport = (_orgId: string) => (report: Report) => {
		const { _id: _repId, ...data } = report;
		const _id = `${_orgId}/${_repId}`;
		const organisation = organisations.getItem(_orgId, '_id');
		collection(organisation._reports).updateOrAdd({ _id, _orgId, _repId, ...data }, '_id');
	};

	const onOrganisationUser = (orgId: string) => (user: User) => {
		const organisation = organisations.getItem(orgId, '_id');
		collection(organisation._users).updateOrAdd(user, '_id');

		FirebaseService.startListening(`users/${user._id}`, {}, onUser);
	};

	const onUser = (user: User) => {
		const users = collection(state.users);
		users.updateOrAdd(user, '_id');
	};

	return {
		...organisations
	};
};
