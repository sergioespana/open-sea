import { action } from 'mobx';
import history from '../../history';
import isBoolean from 'lodash/isBoolean';
import localStorage from 'mobx-localstorage';
import Mousetrap from 'mousetrap';
import reject from 'lodash/reject';
import slugify from 'slugify';

const actions = (state) => {

	const setBusy = action((val) => state.busy = isBoolean(val) ? val : false);

	const toggle = () => localStorage.setItem('navExpanded', !state.expanded);

	const toggleCreateDrawer = action(() => state.createDrawerOpen = !state.createDrawerOpen);

	const toggleSearchDrawer = action(() => state.searchDrawerOpen = !state.searchDrawerOpen);

	const showFlag = (obj) => state.flags = [{ ...obj, id: slugify(obj.title, { lower: true }) }, ...state.flags];

	const dismissFlag = (id) => state.flags = reject(state.flags, { id });

	Mousetrap.bind('[', toggle);
	Mousetrap.bind('c', action(() => state.createDrawerOpen = true));
	Mousetrap.bind('/', action(() => {
		state.searchDrawerOpen = true;
		return false;
	}));
	Mousetrap.bind('esc', action(() => {
		state.createDrawerOpen = false;
		state.searchDrawerOpen = false;
	}));
	Mousetrap.bind('d', () => history.push('/dashboard'));
	Mousetrap.bind('d o', () => history.push('/dashboard/organisations'));
	Mousetrap.bind('d n', () => history.push('/dashboard/networks'));
	Mousetrap.bind('d p', () => history.push('/dashboard/people'));

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