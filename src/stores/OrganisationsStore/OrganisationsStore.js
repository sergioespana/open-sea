import actions from './actions';
import { extendObservable } from 'mobx';

const OrganisationsStore = (state, initial) => {

	extendObservable(state, {
		initialCount: 0,
		initialSnapshotSize: 0,
		loading: true,
		organisations: [],
		reports: []
	});

	return actions(state);
};

export default OrganisationsStore;