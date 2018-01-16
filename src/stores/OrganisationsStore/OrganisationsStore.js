import actions from './actions';
import { extendObservable } from 'mobx';

const OrganisationsStore = (state, initial) => {

	extendObservable(state, {
		loading: true,
		organisations: []
	});

	return actions(state);
};

export default OrganisationsStore;