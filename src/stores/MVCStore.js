import { action, extendObservable } from 'mobx';
import isBoolean from 'lodash/isBoolean';

const mvcActions = (state) => {

	const toggleExpanded = action(() => state.mainNavExpanded = !state.mainNavExpanded);

	const toggleCreateDrawer = action(() => state.createDrawerOpen = !state.createDrawerOpen);

	const toggleSearchDrawer = action(() => state.searchDrawerOpen = !state.searchDrawerOpen);

	const setBusy = (val) => state.busy = isBoolean(val) ? val : false;

	return {
		setBusy,
		toggleCreateDrawer,
		toggleExpanded,
		toggleSearchDrawer
	};
};

const MVCStore = (state, initialData) => {

	extendObservable(state, {
		busy: false,
		mainNavExpanded: false,
		createDrawerOpen: false,
		searchDrawerOpen: false
	});

	const actions = mvcActions(state);

	return actions;
};

export default MVCStore;