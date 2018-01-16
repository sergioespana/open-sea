import actions from './actions';
import { extendObservable } from 'mobx';

const OrganisationsStore = (state, initial) => {

	extendObservable(state, {
		loading: true,
		organisations: [],
		reports: []
	});

	return actions(state);
};

export default OrganisationsStore;