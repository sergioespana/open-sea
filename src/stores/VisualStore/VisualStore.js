import { computed, extendObservable } from 'mobx';
import actions from './actions';
import localStorage from 'mobx-localstorage';

const VisualStore = (state, initial) => {

	extendObservable(state, {
		busy: false,
		expanded: computed(() => localStorage.getItem('navExpanded')),
		createDrawerOpen: false,
		searchDrawerOpen: false
	});

	return actions(state);
};

export default VisualStore;