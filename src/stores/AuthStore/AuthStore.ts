import { find, isUndefined } from 'lodash';
import { extendObservable } from 'mobx';
import { UserCollection } from '../../domain/User';
import { actions } from './actions';

export const AuthStore = (state) => {

	extendObservable(state, {
		get isAuthed (): boolean {
			return !isUndefined(find(state.users, ['_isCurrent', true]));
		},
		isReady: false as boolean,
		users: [] as UserCollection
	});

	return actions(state);
};
