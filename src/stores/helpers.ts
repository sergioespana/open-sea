import { find, Many, omitBy, PropertyName, set } from 'lodash';
import { action } from 'mobx';
import { User } from '../domain/User';

export const getCurrentUser = (state): User => find(state.users, ['_isCurrent', true]);

export const setAppState = action((object: any, path: Many < PropertyName >, value: any) => set(object, path, value));

export const omitKeysPrefixedWithChar = (str: string) => (obj: object) => omitBy(obj, (val, key) => key[0] === str);

export const removePrivates = omitKeysPrefixedWithChar('_');
