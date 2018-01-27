import { action } from 'mobx';
import isBoolean from 'lodash/isBoolean';
import localStorage from 'mobx-localstorage';

const actions = (state) => {

	const setBusy = action((val) => state.busy = isBoolean(val) ? val : false);

	const toggle = () => localStorage.setItem('navExpanded', !state.expanded);

	const toggleCreateDrawer = action(() => state.createDrawerOpen = !state.createDrawerOpen);

	const toggleSearchDrawer = action(() => state.searchDrawerOpen = !state.searchDrawerOpen);

	const showSnackbar = action((message) => state.snackbar = { open: true, message });

	const hideSnackbar = action((delay) => delay ? setTimeout(hideSnackbar, delay) : state.snackbar = { open: false, message: '' });

	return {
		setBusy,
		showSnackbar,
		hideSnackbar,
		toggle,
		toggleCreateDrawer,
		toggleSearchDrawer
	};
};

export default actions;