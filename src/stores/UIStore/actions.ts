import { isBoolean } from 'lodash';
import { action, reaction } from 'mobx';
import localStorage from 'mobx-localstorage';
import Mousetrap from 'mousetrap';
import { setAppState } from '../helpers';

export const actions = (state) => {

	const onLoadingStateChanged = reaction(
		() => state.isLoading,
		(isLoading) => !isLoading && setAppState(state, 'isBusy', false)
	);

	const toggleNavExpanded = action((value?: boolean) => localStorage.setItem('navExpanded', String(isBoolean(value) ? value : !state.isNavExpanded)));

	const toggleCreateDrawerOpen = action((value?: boolean) => state.isCreateDrawerOpen = isBoolean(value) ? value : !state.isCreateDrawerOpen);

	const toggleSearchDrawerOpen = action((value?: boolean) => state.isSearchDrawerOpen = isBoolean(value) ? value : !state.isSearchDrawerOpen);

	const toggleKSModalOpen = action((value?: boolean) => state.isKSModalOpen = isBoolean(value) ? value : !state.isKSModalOpen);

	Mousetrap.bind('[', () => {
		toggleNavExpanded();
		return false;
	});
	Mousetrap.bind('/', () => {
		toggleSearchDrawerOpen(true);
		return false;
	});
	Mousetrap.bind('?', () => {
		toggleKSModalOpen();
		return false;
	});
	Mousetrap.bind('esc', () => {
		toggleCreateDrawerOpen(false);
		toggleKSModalOpen(false);
		toggleSearchDrawerOpen(false);
		return false;
	});

	return {
		toggleNavExpanded,
		toggleCreateDrawerOpen,
		toggleKSModalOpen,
		toggleSearchDrawerOpen
	};
};
