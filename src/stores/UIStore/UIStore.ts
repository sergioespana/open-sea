import { find, isUndefined } from 'lodash';
import { extendObservable } from 'mobx';
import localStorage from 'mobx-localstorage';
import { listeners } from '../../services/FirebaseService';
import { actions } from './actions';

export const UIStore = (state) => {

	extendObservable(state, {
		isBusy: false as boolean,
		get isLoading (): boolean {
			return !isUndefined(find(listeners, { status: 'pending' }));
		},
		get isNavExpanded (): boolean {
			return localStorage.getItem('navExpanded') === 'true';
		},
		isCreateDrawerOpen: false as boolean,
		isKSModalOpen: false as boolean,
		isSearchDrawerOpen: false as boolean
	});

	return actions(state);
};
