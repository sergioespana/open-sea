import { find, get, Many, omitBy, PropertyName, set } from 'lodash';
import { action } from 'mobx';
import { User } from '../domain/User';

export const getCurrentUser = (state: any): User => find(state.users, ['_isCurrent', true]);

export const getCurrentUserAccess = (state: any, organisation): number => get(find(organisation._users, { _id: get(getCurrentUser(state), '_id') }), 'access') || 0;

export const setAppState = action((object: any, path: Many<PropertyName>, value: any) => set(object, path, value));

export const omitKeysPrefixedWithChar = (str: string) => (obj: object) => omitBy(obj, (_, key) => key[0] === str);

export const removePrivates = omitKeysPrefixedWithChar('_');
