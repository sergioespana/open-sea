import { extendObservable } from 'mobx';
import { actions } from './actions';

export const ReportsStore = (state) => {

	extendObservable(state, {});

	return actions(state);
};
