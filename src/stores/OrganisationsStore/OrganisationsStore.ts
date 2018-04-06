import { extendObservable } from 'mobx';
import { OrganisationCollection } from '../../domain/Organisation';
import { actions } from './actions';

export const OrganisationsStore = (state) => {

	extendObservable(state, {
		organisations: [] as OrganisationCollection
	});

	return actions(state);
};
