import { extendObservable } from 'mobx';
import { actions } from './actions';

export const InfographicsStore = (state) => {

	extendObservable(state, {});

	return actions(state);
};
