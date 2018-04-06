import { reaction } from 'mobx';
import localStorage from 'mobx-localstorage';
import Mousetrap from 'mousetrap';
import { setAppState } from '../helpers';

export const actions = (state) => {

	const onLoadingStateChanged = reaction(
		() => state.isLoading,
		(isLoading) => !isLoading && setAppState(state, 'isBusy', false)
	);

	const toggleNavExpanded = () => localStorage.setItem('navExpanded', String(!state.isNavExpanded));

	Mousetrap.bind('[', toggleNavExpanded);
	// Mousetrap.bind('c', action(() => {
	// 	state.isCreateDrawerOpen = true;
	// 	return false;
	// }));
	// Mousetrap.bind('/', action(() => {
	// 	state.isSearchDrawerOpen = true;
	// 	return false;
	// }));
	// Mousetrap.bind('esc', action(() => {
	// 	state.isCreateDrawerOpen = false;
	// 	state.isSearchDrawerOpen = false;
	// 	return false;
	// }));

	return {
		toggleNavExpanded
	};
};
