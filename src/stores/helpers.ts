import { find, set } from 'lodash';
import { action } from 'mobx';
import { User } from '../domain/User';

export const getCurrentUser = (state): User => find(state.users, ['_isCurrent', true]);

export const setAppState = action(set);
