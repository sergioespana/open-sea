import { computed, extendObservable } from 'mobx';
import actions from './actions';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';

const AuthStore = (state, initial) => {

	extendObservable(state, {
		authed: computed(() => {
			const currentUser = find(state.users, ['_isCurrent', true]);
			return isUndefined(currentUser) ? false : currentUser;
		}),
		listening: false,
		users: []
	});

	return actions(state);
};

export default AuthStore;