import AJV from 'ajv';
import { safeLoad } from 'js-yaml';
import { get, isNumber, round } from 'lodash';
import { Report } from '../../domain/Organisation';
import * as FirebaseService from '../../services/FirebaseService';
import schema from '../../util/schema.json';
import { getCurrentUser, removePrivates } from '../helpers';
import math from '../math';

const ajv = new AJV({
	coerceTypes: true,
	useDefaults: true
});

export const actions = (state) => {

	const compute = (value: string, data: object) => roundIfNumber(math.eval(value, data), 2);

	const roundIfNumber = (val: any, precision?: number) => isNumber(val) ? round(val, precision) : val;

	const parseStrToJson = (str: string) => safeLoad(str);

	const validateModel = (obj: object) => {
		if (ajv.validate(schema, obj)) return { accepted: obj, errors: null };
		return { accepted: false, errors: ajv.errors };
	};

	const addModel = (mod: Report, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = mod;
		const model = { ...removePrivates(mod) };
		// Add model to a report or to an organisation (only networks will call this function) depending
		// on whether _repId is set within the model.
		if (_repId) FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, { model, updated: new Date(), updatedBy: get(getCurrentUser(state), '_id') }, callbacks);
		else FirebaseService.saveDoc(`organisations/${_orgId}`, { model, updated: new Date() }, callbacks);
	};

	const addData = (obj: Report, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = obj;
		const data = { ...removePrivates(obj) };
		FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, { data, updated: new Date(), updatedBy: get(getCurrentUser(state), '_id') }, callbacks);
	};

	return {
		addData,
		addModel,
		compute,
		parseStrToJson,
		validateModel
	};
};
