import { action } from 'mobx';
import isBoolean from 'lodash/isBoolean';
import localStorage from 'mobx-localstorage';
import reject from 'lodash/reject';
import slugify from 'slugify';

const actions = (state) => {

	const setBusy = action((val) => state.busy = isBoolean(val) ? val : false);

	const toggle = () => localStorage.setItem('navExpanded', !state.expanded);

	const toggleCreateDrawer = action(() => state.createDrawerOpen = !state.createDrawerOpen);

	const toggleSearchDrawer = action(() => state.searchDrawerOpen = !state.searchDrawerOpen);

	const showFlag = (obj) => state.flags = [{ ...obj, id: slugify(obj.title, { lower: true }) }, ...state.flags];

	const dismissFlag = (id) => state.flags = reject(state.flags, { id });

	return {
		dismissFlag,
		setBusy,
		showFlag,
		toggle,
		toggleCreateDrawer,
		toggleSearchDrawer
	};
};

export default actions;