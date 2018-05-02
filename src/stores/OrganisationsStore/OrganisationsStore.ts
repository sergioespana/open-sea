import { extendObservable } from 'mobx';
import { Organisation } from '../../domain/Organisation';
import { actions } from './actions';

export const OrganisationsStore = (state) => {

	extendObservable(state, {
		organisations: [] as Organisation[]
	});

	return actions(state);
};
